from rest_framework.routers import DefaultRouter
from apps.notes.views import NoteViewSet

router = DefaultRouter()
router.register('', NoteViewSet, basename='note')

urlpatterns = router.urls
