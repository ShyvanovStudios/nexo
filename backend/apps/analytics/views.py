from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone

from apps.tasks.selectors import (
    get_today_tasks, get_overdue_tasks, get_blocked_tasks,
    get_priority_summary, get_weekly_completed, get_scope_distribution,
)
from apps.tasks.serializers import TaskSerializer
from apps.calendar_app.models import Event
from apps.calendar_app.serializers import EventSerializer


class DashboardView(APIView):
    def get(self, request):
        scope_id = request.query_params.get('scope_id')
        scope_id = int(scope_id) if scope_id else None

        today_tasks = get_today_tasks(request.user, scope_id)
        overdue_tasks = get_overdue_tasks(request.user, scope_id)
        blocked_tasks = get_blocked_tasks(request.user, scope_id)
        priority_summary = get_priority_summary(request.user, scope_id)
        weekly_completed = get_weekly_completed(request.user)
        scope_distribution = get_scope_distribution(request.user)

        # Upcoming events (next 7 days)
        now = timezone.now()
        upcoming_events = Event.objects.filter(
            user=request.user,
            deleted_at__isnull=True,
            start_datetime__gte=now,
            start_datetime__lte=now + timezone.timedelta(days=7),
        ).select_related('scope')[:10]

        if scope_id:
            upcoming_events = upcoming_events.filter(scope_id=scope_id)

        return Response({
            'today_tasks': TaskSerializer(today_tasks, many=True).data,
            'overdue_tasks': TaskSerializer(overdue_tasks, many=True).data,
            'blocked_tasks': TaskSerializer(blocked_tasks, many=True).data,
            'upcoming_events': EventSerializer(upcoming_events, many=True).data,
            'priority_summary': priority_summary,
            'weekly_completed': weekly_completed,
            'scope_distribution': scope_distribution,
        })
