from django.db import models
from django.conf import settings


class Note(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notes',
    )
    scope = models.ForeignKey(
        'scopes.Scope',
        on_delete=models.CASCADE,
        related_name='notes',
    )
    title = models.CharField(max_length=500, blank=True, default='')
    content = models.TextField(blank=True, default='')
    is_pinned = models.BooleanField(default=False)
    tags = models.ManyToManyField(
        'tasks.Tag',
        blank=True,
        related_name='notes',
    )

    deleted_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_pinned', '-updated_at']

    def __str__(self):
        return self.title or 'Sin título'
