from datetime import date
from django.utils import timezone
from apps.tasks.models import Task, TaskStatus


def get_user_tasks(user, **filters):
    qs = Task.objects.filter(user=user, deleted_at__isnull=True)
    if 'scope_id' in filters and filters['scope_id']:
        qs = qs.filter(scope_id=filters['scope_id'])
    if 'status' in filters and filters['status']:
        qs = qs.filter(status=filters['status'])
    if 'is_archived' in filters:
        qs = qs.filter(is_archived=filters['is_archived'])
    return qs.select_related('scope').prefetch_related('tags', 'checklist_items')


def get_today_tasks(user, scope_id=None):
    today = timezone.now().date()
    qs = Task.objects.filter(
        user=user,
        deleted_at__isnull=True,
        is_archived=False,
        due_date=today,
    ).exclude(status=TaskStatus.DONE)
    if scope_id:
        qs = qs.filter(scope_id=scope_id)
    return qs.select_related('scope').prefetch_related('tags', 'checklist_items')


def get_overdue_tasks(user, scope_id=None):
    today = timezone.now().date()
    qs = Task.objects.filter(
        user=user,
        deleted_at__isnull=True,
        is_archived=False,
        due_date__lt=today,
    ).exclude(status=TaskStatus.DONE)
    if scope_id:
        qs = qs.filter(scope_id=scope_id)
    return qs.select_related('scope').prefetch_related('tags', 'checklist_items')


def get_blocked_tasks(user, scope_id=None):
    qs = Task.objects.filter(
        user=user,
        deleted_at__isnull=True,
        is_archived=False,
        status=TaskStatus.BLOCKED,
    )
    if scope_id:
        qs = qs.filter(scope_id=scope_id)
    return qs.select_related('scope').prefetch_related('tags', 'checklist_items')


def get_priority_summary(user, scope_id=None):
    qs = Task.objects.filter(
        user=user,
        deleted_at__isnull=True,
        is_archived=False,
    ).exclude(status=TaskStatus.DONE)
    if scope_id:
        qs = qs.filter(scope_id=scope_id)

    high = qs.filter(effective_priority_score__gte=6).count()
    medium = qs.filter(effective_priority_score__gte=3, effective_priority_score__lt=6).count()
    low = qs.filter(effective_priority_score__lt=3).count()
    return {'high': high, 'medium': medium, 'low': low}


def get_weekly_completed(user):
    today = timezone.now().date()
    week_start = today - timezone.timedelta(days=today.weekday())
    return Task.objects.filter(
        user=user,
        status=TaskStatus.DONE,
        completed_at__date__gte=week_start,
    ).count()


def get_scope_distribution(user):
    from django.db.models import Count
    qs = Task.objects.filter(
        user=user,
        deleted_at__isnull=True,
        is_archived=False,
    ).exclude(status=TaskStatus.DONE)

    total = qs.count()
    if total == 0:
        return []

    dist = qs.values('scope__name').annotate(count=Count('id')).order_by('-count')
    return [
        {
            'scope_name': item['scope__name'],
            'count': item['count'],
            'percentage': round(item['count'] / total * 100),
        }
        for item in dist
    ]
