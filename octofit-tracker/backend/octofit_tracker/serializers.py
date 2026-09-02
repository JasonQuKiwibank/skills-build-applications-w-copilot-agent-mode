from rest_framework import serializers

from .models import Activity, Leaderboard, Team, User, Workout


class StringIdModelSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()

    def get_id(self, instance):
        return str(instance.pk)


class UserSerializer(StringIdModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class TeamSerializer(StringIdModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'


class ActivitySerializer(StringIdModelSerializer):
    class Meta:
        model = Activity
        fields = '__all__'


class LeaderboardSerializer(StringIdModelSerializer):
    class Meta:
        model = Leaderboard
        fields = '__all__'


class WorkoutSerializer(StringIdModelSerializer):
    class Meta:
        model = Workout
        fields = '__all__'
