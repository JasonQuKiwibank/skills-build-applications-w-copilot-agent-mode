from django.test import TestCase

from .models import Team


class TeamModelTest(TestCase):
    def test_team_string(self):
        team = Team.objects.create(name='team marvel')
        self.assertEqual(str(team), 'team marvel')
