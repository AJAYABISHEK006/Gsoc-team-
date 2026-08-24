from django.shortcuts import get_object_or_404, redirect, render

from .models import ContactMessage, Milestone, Profile, Project, SkillCategory, SocialLink


def home_view(request):
    profile = Profile.objects.filter(is_primary=True).first() or Profile.objects.first()
    skill_categories = SkillCategory.objects.prefetch_related('skills').all()
    projects = Project.objects.filter(is_published=True).order_by('display_order', '-created_at')
    milestones = Milestone.objects.order_by('display_order')
    social_links = SocialLink.objects.order_by('display_order')

    if request.method == 'POST':
        name = (request.POST.get('name') or '').strip()
        email = (request.POST.get('email') or '').strip()
        message = (request.POST.get('message') or '').strip()

        if name and email and message:
            ContactMessage.objects.create(name=name, email=email, message=message)
            return redirect('home')

    context = {
        'profile': profile,
        'skill_categories': skill_categories,
        'projects': projects,
        'milestones': milestones,
        'social_links': social_links,
    }
    return render(request, 'index.html', context)


def project_detail_view(request, slug):
    project = get_object_or_404(Project, slug=slug, is_published=True)
    context = {'project': project}
    return render(request, 'detail.html', context)
