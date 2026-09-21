from rest_framework import viewsets
from django.utils import timezone
from apps.calendar_app.models import Event
from apps.calendar_app.serializers import EventSerializer


class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    filterset_fields = ['scope_id']

    def get_queryset(self):
        qs = Event.objects.filter(
            user=self.request.user,
            deleted_at__isnull=True,
        ).select_related('scope')

        start = self.request.query_params.get('start')
        end = self.request.query_params.get('end')
        if start:
            qs = qs.filter(start_datetime__date__gte=start)
        if end:
            qs = qs.filter(start_datetime__date__lte=end)

        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_destroy(self, instance):
        instance.deleted_at = timezone.now()
        instance.save()
