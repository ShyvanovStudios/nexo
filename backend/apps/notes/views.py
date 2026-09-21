from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone

from apps.notes.models import Note
from apps.notes.serializers import NoteSerializer
from apps.tasks.services import create_task


class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    filterset_fields = ['scope_id', 'is_pinned']
    search_fields = ['title', 'content']

    def get_queryset(self):
        return Note.objects.filter(
            user=self.request.user,
            deleted_at__isnull=True,
        ).select_related('scope').prefetch_related('tags')

    def perform_create(self, serializer):
        tag_ids = serializer.validated_data.pop('tag_ids', [])
        note = serializer.save(user=self.request.user)
        if tag_ids:
            note.tags.set(tag_ids)

    def perform_update(self, serializer):
        tag_ids = serializer.validated_data.pop('tag_ids', None)
        note = serializer.save()
        if tag_ids is not None:
            note.tags.set(tag_ids)

    def perform_destroy(self, instance):
        instance.deleted_at = timezone.now()
        instance.save()

    @action(detail=True, methods=['post'], url_path='to-task')
    def to_task(self, request, pk=None):
        note = self.get_object()
        task = create_task(
            request.user,
            title=note.title or 'Desde nota',
            description=note.content,
            scope_id=note.scope_id,
        )
        for tag in note.tags.all():
            task.tags.add(tag)
        return Response({'task_id': task.id}, status=status.HTTP_201_CREATED)
