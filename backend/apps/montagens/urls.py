from django.urls import path

from . import views

urlpatterns = [
    path("jogos/", views.ListaJogosView.as_view(), name="jogos"),
    path("programas/", views.ListaProgramasView.as_view(), name="programas"),
    path("setups/gerar/", views.GerarSetupsView.as_view(), name="gerar-setups"),
    path("setups/", views.SetupsDoUsuarioView.as_view(), name="setups"),
]
