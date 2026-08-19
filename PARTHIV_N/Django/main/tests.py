from django.test import TestCase
from django.urls import reverse
from .models import Category, ProjectItem

class DjangoStarterTests(TestCase):
    def setUp(self):
        self.category = Category.objects.create(
            name='Test Category',
            slug='test-category',
            description='Test category description'
        )
        self.item = ProjectItem.objects.create(
            title='Test Project Task',
            category=self.category,
            description='Sample task description',
            status='pending',
            priority='high'
        )

    def test_home_view(self):
        response = self.client.get(reverse('home'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Test Project Task')
        self.assertContains(response, 'Project Control Hub')

    def test_item_detail_view(self):
        response = self.client.get(reverse('item_detail', args=[self.item.pk]))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Test Project Task')

    def test_toggle_status_view(self):
        response = self.client.post(reverse('toggle_status', args=[self.item.pk]))
        self.assertEqual(response.status_code, 302)
        self.item.refresh_from_db()
        self.assertEqual(self.item.status, 'in_progress')

    def test_api_status_view(self):
        response = self.client.get(reverse('api_status'))
        self.assertEqual(response.status_code, 200)
        json_data = response.json()
        self.assertEqual(json_data['status'], 'success')
        self.assertIn('stats', json_data)
