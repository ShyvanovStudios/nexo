from rest_framework import serializers
from apps.notes.models import Note
from apps.scopes.serializers import ScopeSerializer
from apps.tasks.serializers import TagSerializer


class NoteSerializer(serializers.ModelSerializer):
    scope = ScopeSerializer(read_only=True)
    scope_id = serializers.IntegerField(write_only=True)
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False,
        default=[],
    )

    class Meta:
        model = Note
        fields = [
            'id', 'scope', 'scope_id', 'title', 'content',
            'is_pinned', 'tags', 'tag_ids',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
