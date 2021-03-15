from django.urls import path, include
from stream import views


urlpatterns = [
    path('', views.index, name='index'),
    path('video_feed/', views.video_feed, name='video_feed'),
    path('feature_feed/', views.feature_feed, name='feature_feed'),
    ]
