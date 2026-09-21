from django.db import models
from django.conf import settings


class TaskStatus(models.TextChoices):
    TODO = 'TODO', 'Por hacer'
    IN_PROGRESS = 'IN_PROGRESS', 'En proceso'
    BLOCKED = 'BLOCKED', 'Pendiente'
    DONE = 'DONE', 'Completado'


class BlockReason(models.TextChoices):
    WAITING_RESPONSE = 'WAITING_RESPONSE', 'Esperando respuesta'
    DEPENDENCY = 'DEPENDENCY', 'Dependo de otra persona'
    MISSING_INFORMATION = 'MISSING_INFORMATION', 'Falta información'
    MISSING_BUDGET = 'MISSING_BUDGET', 'Falta presupuesto'
    RESCHEDULED = 'RESCHEDULED', 'Reprogramada'
    TECHNICAL_PROBLEM = 'TECHNICAL_PROBLEM', 'Problema técnico'
    OTHER = 'OTHER', 'Otro'


class HistoryEventType(models.TextChoices):
    TASK_CREATED = 'TASK_CREATED', 'Tarea creada'
    TITLE_CHANGED = 'TITLE_CHANGED', 'Título modificado'
    DESCRIPTION_CHANGED = 'DESCRIPTION_CHANGED', 'Descripción modificada'
    STATUS_CHANGED = 'STATUS_CHANGED', 'Estado modificado'
    PRIORITY_CHANGED = 'PRIORITY_CHANGED', 'Prioridad modificada'
    SCOPE_CHANGED = 'SCOPE_CHANGED', 'Ámbito modificado'
    DUE_DATE_CHANGED = 'DUE_DATE_CHANGED', 'Fecha límite modificada'
    TASK_BLOCKED = 'TASK_BLOCKED', 'Tarea bloqueada'
    TASK_UNBLOCKED = 'TASK_UNBLOCKED', 'Tarea desbloqueada'
    CHECKLIST_UPDATED = 'CHECKLIST_UPDATED', 'Checklist actualizado'
    TASK_COMPLETED = 'TASK_COMPLETED', 'Tarea completada'
    TASK_REOPENED = 'TASK_REOPENED', 'Tarea reabierta'
    TASK_ARCHIVED = 'TASK_ARCHIVED', 'Tarea archivada'


class Tag(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='tags',
    )
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=7, default='#6b7280')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']
        unique_together = ['user', 'name']

    def __str__(self):
        return self.name


class Task(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='tasks',
    )
    scope = models.ForeignKey(
        'scopes.Scope',
        on_delete=models.CASCADE,
        related_name='tasks',
    )
    title = models.CharField(max_length=500)
    description = models.TextField(blank=True, default='')

    status = models.CharField(
        max_length=20,
        choices=TaskStatus.choices,
        default=TaskStatus.TODO,
    )

    importance = models.PositiveSmallIntegerField(default=2)
    urgency = models.PositiveSmallIntegerField(default=2)

    base_priority_score = models.PositiveSmallIntegerField(default=4)
    effective_priority_score = models.PositiveSmallIntegerField(default=4)

    due_date = models.DateField(null=True, blank=True)
    due_time = models.TimeField(null=True, blank=True)

    started_at = models.DateTimeField(null=True, blank=True)
    blocked_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    block_reason = models.CharField(
        max_length=30,
        choices=BlockReason.choices,
        blank=True,
        default='',
    )
    block_reason_detail = models.TextField(blank=True, default='')

    position = models.PositiveIntegerField(default=0)
    is_archived = models.BooleanField(default=False)

    tags = models.ManyToManyField(Tag, blank=True, related_name='tasks')

    deleted_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-effective_priority_score', 'position', '-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        self.base_priority_score = self.importance * self.urgency
        self._calculate_effective_priority()
        super().save(*args, **kwargs)

    def _calculate_effective_priority(self):
        from apps.tasks.services import calculate_effective_priority
        self.effective_priority_score = calculate_effective_priority(
            self.importance, self.urgency, self.due_date, self.due_time
        )


class TaskHistory(models.Model):
    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        related_name='history',
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )
    event_type = models.CharField(
        max_length=30,
        choices=HistoryEventType.choices,
    )
    previous_value = models.TextField(blank=True, default='')
    new_value = models.TextField(blank=True, default='')
    comment = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Task histories'

    def __str__(self):
        return f'{self.task.title} — {self.get_event_type_display()}'


class ChecklistItem(models.Model):
    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        related_name='checklist_items',
    )
    text = models.CharField(max_length=500)
    is_completed = models.BooleanField(default=False)
    position = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['position']

    def __str__(self):
        return self.text
