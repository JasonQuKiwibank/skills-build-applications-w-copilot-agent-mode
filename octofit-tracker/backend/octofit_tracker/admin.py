from django.contrib import admin

from .models import Activity, Leaderboard, Team, User, Workout

admin.site.register(User)
admin.site.register(Team)
admin.site.register(Activity)
admin.site.register(Leaderboard)
admin.site.register(Workout)
