from django.db import models


class Profile(models.Model):
    full_name = models.CharField(max_length=120, default='Parthiv')
    title = models.CharField(max_length=200, default='B.Tech Information Technology | Developer | AI/ML Enthusiast')
    tagline = models.CharField(max_length=200, default='Building systems. Breaking limits. Learning relentlessly.')
    about = models.TextField(default='Technology-focused student exploring Python, web development, ML, and practical problem solving.')
    email = models.EmailField(default='parthiv@example.com')
    github_url = models.URLField(blank=True, default='https://github.com/')
    linkedin_url = models.URLField(blank=True, default='https://www.linkedin.com/')
    leetcode_url = models.URLField(blank=True, default='https://leetcode.com/')
    resume_url = models.URLField(blank=True, default='')
    is_primary = models.BooleanField(default=True)

    class Meta:
        ordering = ['-is_primary', 'full_name']

    def __str__(self):
        return self.full_name


class SkillCategory(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True, default='')
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['display_order', 'name']
        verbose_name_plural = 'Skill categories'

    def __str__(self):
        return self.name


class Skill(models.Model):
    LEVEL_CHOICES = [
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
    ]

    category = models.ForeignKey(SkillCategory, on_delete=models.CASCADE, related_name='skills')
    name = models.CharField(max_length=100)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='Intermediate')
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['category__display_order', 'display_order', 'name']

    def __str__(self):
        return f'{self.name} ({self.level})'


class Project(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    short_description = models.CharField(max_length=250)
    description = models.TextField()
    technologies = models.CharField(max_length=250, default='Python • Django • ML')
    source_url = models.URLField(blank=True, default='')
    demo_url = models.URLField(blank=True, default='')
    project_type = models.CharField(max_length=120, default='AI / Web')
    year = models.CharField(max_length=20, default='2025')
    is_published = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['display_order', '-created_at']

    def __str__(self):
        return self.title


class Milestone(models.Model):
    year = models.CharField(max_length=20)
    title = models.CharField(max_length=120)
    description = models.TextField(blank=True, default='')
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['display_order']

    def __str__(self):
        return f'{self.year} - {self.title}'


class SocialLink(models.Model):
    platform = models.CharField(max_length=50)
    url = models.URLField()
    label = models.CharField(max_length=100, blank=True, default='')
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['display_order', 'platform']

    def __str__(self):
        return self.platform


class ContactMessage(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.name} - {self.email}'
