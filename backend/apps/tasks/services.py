from datetime import date, timedelta
from django.utils import timezone
from apps.tasks.models import (
    Task, TaskHistory, HistoryEventType, TaskStatus, ChecklistItem,
)


def calculate_effective_priority(importance, urgency, due_date, due_time):
    base = importance * urgency
    boost = _calculate_due_date_boost(due_date, due_time)
    if boost >= 99:
        return 99
    return min(base + boost, 9)


def _calculate_due_date_boost(due_date, due_time):
    if not due_date:
        return 0

    now = timezone.now()
    today = now.date()

    if due_time:
        from datetime import datetime
        due_dt = timezone.make_aware(
            datetime.combine(due_date, due_time),
            timezone.get_current_timezone(),
        )
        if due_dt < now:
            return 99  # overdue
        hours_left = (due_dt - now).total_seconds() / 3600
        if hours_left <= 24:
            return 3
    else:
        if due_date < today:
            return 99  # overdue
        days_left = (due_date - today).days
        if days_left <= 1:
            return 3
        if days_left <= 3:
            return 2
        if days_left <= 7:
            return 1
        return 0

    days_left = (due_date - today).days
    if days_left <= 3:
        return 2
    if days_left <= 7:
        return 1
    return 0


def create_task(user, **data):
    tag_ids = data.pop('tag_ids', [])
    task = Task.objects.create(user=user, **data)
    if tag_ids:
        task.tags.set(tag_ids)
    create_task_history(task, user, HistoryEventType.TASK_CREATED)
    return task


def change_task_status(task, user, new_status):
    old_status = task.status
    task.status = new_status

    if new_status == TaskStatus.IN_PROGRESS and not task.started_at:
        task.started_at = timezone.now()
    elif new_status == TaskStatus.DONE:
        task.completed_at = timezone.now()
    elif new_status == TaskStatus.TODO:
        if old_status == TaskStatus.DONE:
            task.completed_at = None
            create_task_history(
                task, user, HistoryEventType.TASK_REOPENED,
                previous_value=old_status, new_value=new_status,
            )
    elif new_status != TaskStatus.BLOCKED:
        task.blocked_at = None
        task.block_reason = ''
        task.block_reason_detail = ''

    task.save()

    if new_status != TaskStatus.TODO or old_status != TaskStatus.DONE:
        create_task_history(
            task, user, HistoryEventType.STATUS_CHANGED,
            previous_value=old_status, new_value=new_status,
        )
    return task


def block_task(task, user, block_reason, block_reason_detail=''):
    old_status = task.status
    task.status = TaskStatus.BLOCKED
    task.blocked_at = timezone.now()
    task.block_reason = block_reason
    task.block_reason_detail = block_reason_detail
    task.save()

    create_task_history(
        task, user, HistoryEventType.TASK_BLOCKED,
        previous_value=old_status, new_value=TaskStatus.BLOCKED,
        comment=f'{block_reason}: {block_reason_detail}'.strip(': '),
    )
    return task


def unblock_task(task, user):
    old_status = task.status
    task.status = TaskStatus.IN_PROGRESS
    task.blocked_at = None
    task.save()

    create_task_history(
        task, user, HistoryEventType.TASK_UNBLOCKED,
        previous_value=old_status, new_value=TaskStatus.IN_PROGRESS,
    )
    return task


def complete_task(task, user):
    old_status = task.status
    task.status = TaskStatus.DONE
    task.completed_at = timezone.now()
    task.blocked_at = None
    task.block_reason = ''
    task.block_reason_detail = ''
    task.save()

    create_task_history(
        task, user, HistoryEventType.TASK_COMPLETED,
        previous_value=old_status, new_value=TaskStatus.DONE,
    )
    return task


def reopen_task(task, user):
    old_status = task.status
    task.status = TaskStatus.TODO
    task.completed_at = None
    task.save()

    create_task_history(
        task, user, HistoryEventType.TASK_REOPENED,
        previous_value=old_status, new_value=TaskStatus.TODO,
    )
    return task


def create_task_history(task, user, event_type, previous_value='', new_value='', comment=''):
    TaskHistory.objects.create(
        task=task,
        user=user,
        event_type=event_type,
        previous_value=str(previous_value),
        new_value=str(new_value),
        comment=comment,
    )
