from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.db.models import Count
from .models import Category, ProjectItem

def home_view(request):
    # Quick item creation from form
    if request.method == 'POST':
        title = request.POST.get('title')
        category_id = request.POST.get('category')
        description = request.POST.get('description', '')
        priority = request.POST.get('priority', 'medium')
        
        if title and category_id:
            category = get_object_or_404(Category, id=category_id)
            ProjectItem.objects.create(
                title=title,
                category=category,
                description=description,
                priority=priority,
                status='pending'
            )
            return redirect('home')

    category_slug = request.GET.get('category')
    status_filter = request.GET.get('status')

    items = ProjectItem.objects.select_related('category').all()

    if category_slug:
        items = items.filter(category__slug=category_slug)
    if status_filter:
        items = items.filter(status=status_filter)

    categories = Category.objects.annotate(item_count=Count('items'))

    stats = {
        'total': ProjectItem.objects.count(),
        'completed': ProjectItem.objects.filter(status='completed').count(),
        'in_progress': ProjectItem.objects.filter(status='in_progress').count(),
        'pending': ProjectItem.objects.filter(status='pending').count(),
    }

    context = {
        'items': items,
        'categories': categories,
        'stats': stats,
        'selected_category': category_slug,
        'selected_status': status_filter,
    }
    return render(request, 'index.html', context)

def item_detail_view(request, pk):
    item = get_object_or_404(ProjectItem, pk=pk)
    
    if request.method == 'POST':
        item.status = request.POST.get('status', item.status)
        item.priority = request.POST.get('priority', item.priority)
        item.description = request.POST.get('description', item.description)
        item.save()
        return redirect('item_detail', pk=item.pk)

    return render(request, 'detail.html', {'item': item})

def toggle_status_view(request, pk):
    if request.method == 'POST':
        item = get_object_or_404(ProjectItem, pk=pk)
        next_status = {
            'pending': 'in_progress',
            'in_progress': 'completed',
            'completed': 'pending'
        }
        item.status = next_status.get(item.status, 'pending')
        item.save()
    return redirect('home')

def api_status_view(request):
    data = {
        'status': 'success',
        'message': 'Django Starter Project API is online',
        'stats': {
            'total_items': ProjectItem.objects.count(),
            'completed': ProjectItem.objects.filter(status='completed').count(),
            'in_progress': ProjectItem.objects.filter(status='in_progress').count(),
            'pending': ProjectItem.objects.filter(status='pending').count(),
        },
        'categories': list(Category.objects.values('name', 'slug'))
    }
    return JsonResponse(data)
