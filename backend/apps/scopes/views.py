from rest_framework import viewsets
from apps.scopes.models import Scope
from apps.scopes.serializers import ScopeSerializer


class ScopeViewSet(viewsets.ModelViewSet):
    serializer_class = ScopeSerializer

    def get_queryset(self):
        return Scope.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
