from django.urls import path
from . import views


urlpatterns = [
    path("start", views.iniziate_training)
]
