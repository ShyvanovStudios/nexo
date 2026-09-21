from rest_framework.routers import DefaultRouter
from apps.inbox.views import InboxViewSet

router = DefaultRouter()
router.register('', InboxViewSet, basename='inbox')

urlpatterns = router.urls
