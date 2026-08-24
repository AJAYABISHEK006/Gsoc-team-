from django.contrib import admin

from .models import ContactMessage, Milestone, Profile, Project, Skill, SkillCategory, SocialLink


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'title', 'email', 'is_primary')
    list_filter = ('is_primary',)
    search_fields = ('full_name', 'email', 'title')


@admin.register(SkillCategory)
class SkillCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'display_order', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'level', 'display_order')
    list_filter = ('category', 'level')
    search_fields = ('name', 'category__name')


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'project_type', 'year', 'is_published', 'display_order')
    list_filter = ('project_type', 'is_published', 'year')
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ('title', 'short_description', 'technologies')


@admin.register(Milestone)
class MilestoneAdmin(admin.ModelAdmin):
    list_display = ('year', 'title', 'display_order')
    search_fields = ('year', 'title', 'description')


@admin.register(SocialLink)
class SocialLinkAdmin(admin.ModelAdmin):
    list_display = ('platform', 'label', 'display_order')
    search_fields = ('platform', 'label')


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'created_at')
    search_fields = ('name', 'email', 'message')
    readonly_fields = ('created_at',)
