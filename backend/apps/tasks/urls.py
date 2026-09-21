from rest_framework.routers import DefaultRouter
from apps.tasks.views import TaskViewSet, ChecklistItemViewSet, TagViewSet, HistoryListView

router = DefaultRouter()
router.register('tasks', TaskViewSet, basename='task')
router.register('checklist', ChecklistItemViewSet, basename='checklist')
router.register('tags', TagViewSet, basename='tag')
router.register('history', HistoryListView, basename='history')

urlpatterns = router.urls
