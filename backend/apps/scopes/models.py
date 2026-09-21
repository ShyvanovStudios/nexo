from django.db import models
from django.conf import settings


class Scope(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='scopes',
    )
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=7, default='#3b82f6')
    icon = models.CharField(max_length=50, blank=True, default='')
    position = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['position', 'name']

    def __str__(self):
        return self.name
