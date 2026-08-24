import os

import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from main.models import ContactMessage, Milestone, Profile, Project, Skill, SkillCategory, SocialLink


def seed():
    profile, _ = Profile.objects.get_or_create(
        is_primary=True,
        defaults={
            'full_name': 'Parthiv',
            'title': 'B.Tech Information Technology | Developer | AI/ML Enthusiast',
            'tagline': 'Building systems. Breaking limits. Learning relentlessly.',
            'about': 'I am a technology-focused student who enjoys Python, Django, machine learning, data science, and building meaningful projects that solve real problems.',
            'email': 'parthiv@example.com',
            'github_url': 'https://github.com/',
            'linkedin_url': 'https://www.linkedin.com/',
            'leetcode_url': 'https://leetcode.com/',
        },
    )

    programming, _ = SkillCategory.objects.get_or_create(slug='programming', defaults={'name': 'Programming', 'display_order': 1})
    web, _ = SkillCategory.objects.get_or_create(slug='web', defaults={'name': 'Web', 'display_order': 2})
    data_ai, _ = SkillCategory.objects.get_or_create(slug='data-ai', defaults={'name': 'Data / AI', 'display_order': 3})
    tools, _ = SkillCategory.objects.get_or_create(slug='tools', defaults={'name': 'Tools', 'display_order': 4})

    skill_data = [
        (programming, 'Python', 'Advanced'),
        (programming, 'Java', 'Intermediate'),
        (programming, 'SQL', 'Intermediate'),
        (web, 'HTML', 'Advanced'),
        (web, 'CSS', 'Advanced'),
        (web, 'JavaScript', 'Intermediate'),
        (web, 'Django', 'Advanced'),
        (web, 'REST APIs', 'Intermediate'),
        (data_ai, 'NumPy', 'Intermediate'),
        (data_ai, 'Pandas', 'Intermediate'),
        (data_ai, 'Matplotlib', 'Intermediate'),
        (data_ai, 'Machine Learning', 'Intermediate'),
        (tools, 'Git', 'Advanced'),
        (tools, 'GitHub', 'Advanced'),
        (tools, 'VS Code', 'Advanced'),
        (tools, 'Jupyter', 'Intermediate'),
    ]

    for category, name, level in skill_data:
        Skill.objects.get_or_create(category=category, name=name, defaults={'level': level})

    project_data = [
        {
            'title': 'AI Environmental Monitoring System',
            'slug': 'ai-environmental-monitoring-system',
            'short_description': 'An intelligent monitoring platform for environmental evidence analysis.',
            'description': 'This project combines data pipelines, analytics, and machine learning models to assist environmental monitoring and early detection workflows.',
            'technologies': 'Python • Django • ML • PostgreSQL',
            'source_url': 'https://github.com/',
            'project_type': 'AI / ML',
            'year': '2025',
            'display_order': 1,
        },
        {
            'title': 'Air Quality Prediction Dashboard',
            'slug': 'air-quality-prediction-dashboard',
            'short_description': 'A dashboard that interprets air quality patterns and trends.',
            'description': 'This dashboard visualizes pollutant metrics, highlights risk factors, and gives a practical insight view for city-level environmental monitoring.',
            'technologies': 'Python • Django • Pandas • Matplotlib',
            'source_url': 'https://github.com/',
            'project_type': 'Data Science',
            'year': '2025',
            'display_order': 2,
        },
        {
            'title': 'Water Surveillance Portal',
            'slug': 'water-surveillance-portal',
            'short_description': 'A web portal for monitoring important water metrics and alerts.',
            'description': 'This solution focuses on water quality surveillance and accessibility of structured reports for environmental insight.',
            'technologies': 'Python • Django • SQL • Visualization',
            'source_url': 'https://github.com/',
            'project_type': 'Environmental Tech',
            'year': '2025',
            'display_order': 3,
        },
    ]

    for project in project_data:
        Project.objects.get_or_create(slug=project['slug'], defaults=project)

    milestone_data = [
        ('2024', 'START', 'Started learning fundamentals, problem solving, and programming practices.'),
        ('2025', 'PROGRAMMING', 'Built a deeper foundation in Python, web development, and data-driven thinking.'),
        ('2026', 'WEB + AI', 'Focused on Django, APIs, and the intersection of machine learning with product design.'),
        ('CURRENT', 'BUILDING PROJECTS', 'Creating practical, real-world projects with clean architecture and measurable impact.'),
        ('NEXT', 'BECOME BETTER', 'Constantly refining skill, curiosity, and execution through learning and development.'),
    ]

    for index, (year, title, description) in enumerate(milestone_data):
        Milestone.objects.get_or_create(year=year, title=title, defaults={'description': description, 'display_order': index})

    social_data = [
        ('GitHub', 'https://github.com/', 'GitHub', 1),
        ('LinkedIn', 'https://www.linkedin.com/', 'LinkedIn', 2),
        ('LeetCode', 'https://leetcode.com/', 'LeetCode', 3),
    ]

    for platform, url, label, order in social_data:
        SocialLink.objects.get_or_create(platform=platform, defaults={'url': url, 'label': label, 'display_order': order})

    print('Portfolio data seeded successfully.')


if __name__ == '__main__':
    seed()
