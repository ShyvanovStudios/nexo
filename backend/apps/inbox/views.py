from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import serializers as drf_serializers
from django.utils import timezone

from apps.inbox.models import InboxItem
from apps.tasks.services import create_task
from apps.notes.models import Note
from apps.calendar_app.models import Event


class InboxItemSerializer(drf_serializers.ModelSerializer):
    class Meta:
        model = InboxItem
        fields = ['id', 'content', 'processed', 'created_at', 'processed_at']
        read_only_fields = ['id', 'processed', 'created_at', 'processed_at']


class InboxViewSet(viewsets.ModelViewSet):
    serializer_class = InboxItemSerializer
    http_method_names = ['get', 'post', 'delete']

    def get_queryset(self):
        return InboxItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], url_path='to-task')
    def to_task(self, request, pk=None):
        item = self.get_object()
        scope_id = request.user.scopes.first().id if request.user.scopes.exists() else None
        if not scope_id:
            return Response({'error': 'No scopes configured'}, status=status.HTTP_400_BAD_REQUEST)
        task = create_task(request.user, title=item.content, scope_id=scope_id)
        item.processed = True
        item.processed_at = timezone.now()
        item.save()
        return Response({'task_id': task.id}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='to-note')
    def to_note(self, request, pk=None):
        item = self.get_object()
        scope = request.user.scopes.first()
        if not scope:
            return Response({'error': 'No scopes configured'}, status=status.HTTP_400_BAD_REQUEST)
        note = Note.objects.create(
            user=request.user,
            scope=scope,
            title=item.content[:100],
            content=item.content,
        )
        item.processed = True
        item.processed_at = timezone.now()
        item.save()
        return Response({'note_id': note.id}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='to-event')
    def to_event(self, request, pk=None):
        item = self.get_object()
        scope = request.user.scopes.first()
        if not scope:
            return Response({'error': 'No scopes configured'}, status=status.HTTP_400_BAD_REQUEST)
        now = timezone.now()
        event = Event.objects.create(
            user=request.user,
            scope=scope,
            title=item.content[:100],
            start_datetime=now,
            end_datetime=now + timezone.timedelta(hours=1),
        )
        item.processed = True
        item.processed_at = timezone.now()
        item.save()
        return Response({'event_id': event.id}, status=status.HTTP_201_CREATED)
