from rest_framework import serializers
from apps.tasks.models import Task, TaskHistory, ChecklistItem, Tag
from apps.scopes.serializers import ScopeSerializer


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'color', 'created_at']
        read_only_fields = ['id', 'created_at']


class ChecklistItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChecklistItem
        fields = ['id', 'task_id', 'text', 'is_completed', 'position', 'created_at', 'completed_at']
        read_only_fields = ['id', 'task_id', 'created_at', 'completed_at']


class TaskSerializer(serializers.ModelSerializer):
    scope = ScopeSerializer(read_only=True)
    scope_id = serializers.IntegerField(write_only=True)
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False,
        default=[],
    )
    checklist_items = ChecklistItemSerializer(many=True, read_only=True)
    checklist_progress = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = [
            'id', 'scope', 'scope_id', 'title', 'description',
            'status', 'importance', 'urgency',
            'base_priority_score', 'effective_priority_score',
            'due_date', 'due_time',
            'started_at', 'blocked_at', 'completed_at',
            'block_reason', 'block_reason_detail',
            'position', 'is_archived',
            'tags', 'tag_ids',
            'checklist_items', 'checklist_progress',
            'created_at', 'updated_at',
        ]
        read_only_fields = [
            'id', 'base_priority_score', 'effective_priority_score',
            'started_at', 'blocked_at', 'completed_at',
            'created_at', 'updated_at',
        ]

    def get_checklist_progress(self, obj):
        items = obj.checklist_items.all()
        total = len(items)
        completed = sum(1 for i in items if i.is_completed)
        return {'completed': completed, 'total': total}


class TaskHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskHistory
        fields = ['id', 'task_id', 'event_type', 'previous_value', 'new_value', 'comment', 'created_at']
        read_only_fields = ['id', 'task_id', 'created_at']


class BlockTaskSerializer(serializers.Serializer):
    block_reason = serializers.ChoiceField(
        choices=[c[0] for c in Task._meta.get_field('block_reason').choices]
    )
    block_reason_detail = serializers.CharField(required=False, default='')
