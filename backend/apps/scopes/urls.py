from rest_framework.routers import DefaultRouter
from apps.scopes.views import ScopeViewSet

router = DefaultRouter()
router.register('', ScopeViewSet, basename='scope')

urlpatterns = router.urls
