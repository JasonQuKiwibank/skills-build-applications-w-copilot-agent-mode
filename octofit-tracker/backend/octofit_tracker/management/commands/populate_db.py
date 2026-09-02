from datetime import date

from django.core.management.base import BaseCommand
from django.db import transaction

from octofit_tracker.models import Activity, Leaderboard, Team, User, Workout


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    @transaction.atomic
    def handle(self, *args, **options):
        Leaderboard.objects.all().delete()
        Activity.objects.all().delete()
        User.objects.all().delete()
        Workout.objects.all().delete()
        Team.objects.all().delete()

        marvel = Team.objects.create(name='team marvel')
        dc = Team.objects.create(name='team dc')

        users = [
            User.objects.create(email='ironman@marvel.test', name='Iron Man', team=marvel),
            User.objects.create(email='captainamerica@marvel.test', name='Captain America', team=marvel),
            User.objects.create(email='batman@dc.test', name='Batman', team=dc),
            User.objects.create(email='wonderwoman@dc.test', name='Wonder Woman', team=dc),
        ]

        activities = [
            (users[0], 'Strength Training', 45, 90),
            (users[1], 'Running', 30, 75),
            (users[2], 'Cycling', 60, 120),
            (users[3], 'Yoga', 40, 80),
        ]
        for user, activity_type, duration, points in activities:
            Activity.objects.create(
                user=user,
                activity_type=activity_type,
                duration=duration,
                date=date.today(),
                points=points,
            )

        leaderboard = [
            (users[2], dc, 120, 1),
            (users[0], marvel, 90, 2),
            (users[3], dc, 80, 3),
            (users[1], marvel, 75, 4),
        ]
        for user, team, points, rank in leaderboard:
            Leaderboard.objects.create(user=user, team=team, points=points, rank=rank)

        Workout.objects.bulk_create([
            Workout(
                name='Avenger Power Circuit',
                description='A full-body circuit inspired by Earth\'s mightiest heroes.',
                difficulty='Intermediate',
                duration=35,
            ),
            Workout(
                name='Amazon Warrior Flow',
                description='Mobility and strength work for a balanced training session.',
                difficulty='Beginner',
                duration=25,
            ),
            Workout(
                name='Gotham Endurance Run',
                description='A progressive cardio workout for building steady endurance.',
                difficulty='Advanced',
                duration=50,
            ),
        ])

        self.stdout.write(self.style.SUCCESS('Successfully populated octofit_db with test data.'))
