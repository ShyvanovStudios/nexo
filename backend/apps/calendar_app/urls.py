from rest_framework.routers import DefaultRouter
from apps.calendar_app.views import EventViewSet

router = DefaultRouter()
router.register('', EventViewSet, basename='event')

urlpatterns = router.urls
