import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from main.models import Category, ProjectItem

def seed():
    print("Seeding initial categories and project items...")

    categories_data = [
        {'name': 'Web Development', 'slug': 'web-dev', 'description': 'Frontend and backend development tasks.'},
        {'name': 'Machine Learning', 'slug': 'ml', 'description': 'Data modeling, feature engineering, and model training.'},
        {'name': 'DevOps & Setup', 'slug': 'devops', 'description': 'Environment setup, deployment scripts, and CI/CD pipelines.'},
        {'name': 'Documentation', 'slug': 'docs', 'description': 'Project READMEs, API docs, and architecture walkthroughs.'},
    ]

    cats = {}
    for cat_info in categories_data:
        cat, created = Category.objects.get_or_create(
            slug=cat_info['slug'],
            defaults={'name': cat_info['name'], 'description': cat_info['description']}
        )
        cats[cat_info['slug']] = cat

    items_data = [
        {
            'title': 'Initialize Django Starter Application',
            'category': cats['web-dev'],
            'description': 'Configured Django 6.1 project structure with core app, SQLite database, custom CSS design system, and responsive layout.',
            'status': 'completed',
            'priority': 'high'
        },
        {
            'title': 'Configure REST API & Status Endpoints',
            'category': cats['web-dev'],
            'description': 'Expose JSON response view at /api/status/ for application metrics and status monitoring.',
            'status': 'completed',
            'priority': 'medium'
        },
        {
            'title': 'Setup Project Admin Portal',
            'category': cats['devops'],
            'description': 'Register Category and ProjectItem models in Django admin dashboard for easy record management.',
            'status': 'in_progress',
            'priority': 'high'
        },
        {
            'title': 'Write Architectural & Usage Documentation',
            'category': cats['docs'],
            'description': 'Document project layout, routing, database schema, and management commands in walkthrough guide.',
            'status': 'pending',
            'priority': 'medium'
        },
    ]

    for item_info in items_data:
        ProjectItem.objects.get_or_create(
            title=item_info['title'],
            defaults=item_info
        )

    print(f"Seeding completed successfully! Total categories: {Category.objects.count()}, Total items: {ProjectItem.objects.count()}")

if __name__ == '__main__':
    seed()
