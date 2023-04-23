from django.urls import path
from . import views


urlpatterns = [
    path("learn", views.iniziate_training)
]
