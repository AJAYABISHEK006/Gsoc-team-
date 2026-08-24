from django.test import TestCase
from django.urls import reverse

from .models import ContactMessage, Profile, Project, Skill, SkillCategory


class PortfolioTests(TestCase):
    def setUp(self):
        self.profile = Profile.objects.create(
            full_name='Parthiv',
            title='B.Tech Information Technology | Developer | AI/ML Enthusiast',
            tagline='Building systems. Breaking limits. Learning relentlessly.',
            about='Technology-focused student exploring AI and web development.',
            email='parthiv@example.com',
            is_primary=True,
        )
        self.category = SkillCategory.objects.create(name='Programming', slug='programming')
        self.skill = Skill.objects.create(
            category=self.category,
            name='Python',
            level='Advanced',
        )
        self.project = Project.objects.create(
            title='Air Quality Monitor',
            slug='air-quality-monitor',
            short_description='ML-powered environmental monitoring dashboard.',
            description='A project that tracks air quality and visualizes insights.',
            technologies='Python • Django • ML • PostgreSQL',
            source_url='https://github.com/example/air-quality-monitor',
            is_published=True,
        )

    def test_home_view(self):
        response = self.client.get(reverse('home'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'PARTHIV')
        self.assertContains(response, 'Building systems. Breaking limits. Learning relentlessly.')
        self.assertContains(response, 'Air Quality Monitor')

    def test_project_detail_view(self):
        response = self.client.get(reverse('project_detail', args=[self.project.slug]))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Air Quality Monitor')

    def test_contact_message_view(self):
        response = self.client.post(
            reverse('home'),
            {
                'name': 'Test User',
                'email': 'test@example.com',
                'message': 'Interested in working together.',
            },
            follow=True,
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue(ContactMessage.objects.filter(email='test@example.com').exists())
