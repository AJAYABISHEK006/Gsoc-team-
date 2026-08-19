from django.urls import path
from . import views

urlpatterns = [
    path('', views.home_view, name='home'),
    path('item/<int:pk>/', views.item_detail_view, name='item_detail'),
    path('item/<int:pk>/toggle/', views.toggle_status_view, name='toggle_status'),
    path('api/status/', views.api_status_view, name='api_status'),
]
