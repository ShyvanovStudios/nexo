from rest_framework import serializers
from apps.calendar_app.models import Event
from apps.scopes.serializers import ScopeSerializer


class EventSerializer(serializers.ModelSerializer):
    scope = ScopeSerializer(read_only=True)
    scope_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Event
        fields = [
            'id', 'scope', 'scope_id', 'title', 'description',
            'start_datetime', 'end_datetime', 'all_day', 'location',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
