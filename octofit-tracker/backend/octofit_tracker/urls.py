import os

from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ActivityViewSet, LeaderboardViewSet, TeamViewSet, UserViewSet, WorkoutViewSet

codespace_name = os.environ.get('CODESPACE_NAME')
if codespace_name:
    base_url = f'https://{codespace_name}-8000.app.github.dev'
else:
    base_url = 'http://localhost:8000'

router = DefaultRouter()
router.register('users', UserViewSet)
router.register('teams', TeamViewSet)
router.register('activities', ActivityViewSet)
router.register('leaderboard', LeaderboardViewSet)
router.register('workouts', WorkoutViewSet)


def api_root(request):
    return JsonResponse({
        'users': f'{base_url}/api/users/',
        'teams': f'{base_url}/api/teams/',
        'activities': f'{base_url}/api/activities/',
        'leaderboard': f'{base_url}/api/leaderboard/',
        'workouts': f'{base_url}/api/workouts/',
    })


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', api_root, name='api-root'),
    path('api/', include(router.urls)),
]
