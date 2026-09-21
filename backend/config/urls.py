from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('apps.users.urls')),
    path('api/v1/scopes/', include('apps.scopes.urls')),
    path('api/v1/', include('apps.tasks.urls')),
    path('api/v1/events/', include('apps.calendar_app.urls')),
    path('api/v1/notes/', include('apps.notes.urls')),
    path('api/v1/inbox/', include('apps.inbox.urls')),
    path('api/v1/dashboard/', include('apps.analytics.urls')),
]
