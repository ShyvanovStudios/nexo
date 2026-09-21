from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone

from apps.tasks.models import Task, TaskHistory, ChecklistItem, Tag
from apps.tasks.serializers import (
    TaskSerializer, TaskHistorySerializer, ChecklistItemSerializer,
    TagSerializer, BlockTaskSerializer,
)
from apps.tasks.services import (
    create_task, block_task, unblock_task, complete_task, reopen_task,
    change_task_status, create_task_history,
)
from apps.tasks.models import HistoryEventType


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    filterset_fields = ['status', 'scope_id', 'is_archived']
    search_fields = ['title', 'description']
    ordering_fields = ['effective_priority_score', 'due_date', 'created_at', 'position']

    def get_queryset(self):
        qs = Task.objects.filter(
            user=self.request.user,
            deleted_at__isnull=True,
        ).select_related('scope').prefetch_related('tags', 'checklist_items')

        due_date_gte = self.request.query_params.get('due_date_gte')
        due_date_lte = self.request.query_params.get('due_date_lte')
        if due_date_gte:
            qs = qs.filter(due_date__gte=due_date_gte)
        if due_date_lte:
            qs = qs.filter(due_date__lte=due_date_lte)

        return qs

    def perform_create(self, serializer):
        data = serializer.validated_data
        tag_ids = data.pop('tag_ids', [])
        task = create_task(self.request.user, **data)
        if tag_ids:
            task.tags.set(tag_ids)

    def perform_update(self, serializer):
        task = self.get_object()
        user = self.request.user
        data = serializer.validated_data
        tag_ids = data.pop('tag_ids', None)

        if 'title' in data and data['title'] != task.title:
            create_task_history(task, user, HistoryEventType.TITLE_CHANGED, task.title, data['title'])
        if 'description' in data and data['description'] != task.description:
            create_task_history(task, user, HistoryEventType.DESCRIPTION_CHANGED)
        if 'scope_id' in data and data['scope_id'] != task.scope_id:
            create_task_history(task, user, HistoryEventType.SCOPE_CHANGED, str(task.scope_id), str(data['scope_id']))
        if 'due_date' in data and data.get('due_date') != task.due_date:
            create_task_history(task, user, HistoryEventType.DUE_DATE_CHANGED, str(task.due_date), str(data.get('due_date')))
        if 'status' in data and data['status'] != task.status:
            change_task_status(task, user, data['status'])
            data.pop('status')

        instance = serializer.save()
        if tag_ids is not None:
            instance.tags.set(tag_ids)

    def perform_destroy(self, instance):
        instance.deleted_at = timezone.now()
        instance.save()

    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        task = self.get_object()
        task = change_task_status(task, request.user, 'IN_PROGRESS')
        return Response(TaskSerializer(task).data)

    @action(detail=True, methods=['post'])
    def block(self, request, pk=None):
        task = self.get_object()
        serializer = BlockTaskSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        task = block_task(
            task, request.user,
            serializer.validated_data['block_reason'],
            serializer.validated_data.get('block_reason_detail', ''),
        )
        return Response(TaskSerializer(task).data)

    @action(detail=True, methods=['post'])
    def unblock(self, request, pk=None):
        task = self.get_object()
        task = unblock_task(task, request.user)
        return Response(TaskSerializer(task).data)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        task = self.get_object()
        task = complete_task(task, request.user)
        return Response(TaskSerializer(task).data)

    @action(detail=True, methods=['post'])
    def reopen(self, request, pk=None):
        task = self.get_object()
        task = reopen_task(task, request.user)
        return Response(TaskSerializer(task).data)

    @action(detail=True, methods=['get'], url_path='history')
    def history(self, request, pk=None):
        task = self.get_object()
        history = TaskHistory.objects.filter(task=task)
        return Response(TaskHistorySerializer(history, many=True).data)

    @action(detail=True, methods=['get', 'post'], url_path='checklist')
    def checklist(self, request, pk=None):
        task = self.get_object()
        if request.method == 'GET':
            items = task.checklist_items.all()
            return Response(ChecklistItemSerializer(items, many=True).data)
        else:
            serializer = ChecklistItemSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(task=task)
            return Response(serializer.data, status=status.HTTP_201_CREATED)


class ChecklistItemViewSet(viewsets.ModelViewSet):
    serializer_class = ChecklistItemSerializer
    http_method_names = ['patch', 'delete']

    def get_queryset(self):
        return ChecklistItem.objects.filter(task__user=self.request.user)

    def perform_update(self, serializer):
        instance = serializer.instance
        if 'is_completed' in serializer.validated_data:
            if serializer.validated_data['is_completed'] and not instance.is_completed:
                serializer.validated_data['completed_at'] = timezone.now()
            elif not serializer.validated_data['is_completed']:
                serializer.validated_data['completed_at'] = None
        serializer.save()


class TagViewSet(viewsets.ModelViewSet):
    serializer_class = TagSerializer

    def get_queryset(self):
        return Tag.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class HistoryListView(viewsets.GenericViewSet):
    serializer_class = TaskHistorySerializer

    def list(self, request):
        history = TaskHistory.objects.filter(user=request.user).order_by('-created_at')[:100]
        return Response(TaskHistorySerializer(history, many=True).data)
