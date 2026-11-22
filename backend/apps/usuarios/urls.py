from django.urls import path

from .views import CadastroView, LoginView, RecuperarSenhaView, RedefinirSenhaView

urlpatterns = [
    path("cadastro/", CadastroView.as_view(), name="cadastro"),
    path("login/", LoginView.as_view(), name="login"),
    path("recuperar-senha/", RecuperarSenhaView.as_view(), name="recuperar-senha"),
    path("redefinir-senha/", RedefinirSenhaView.as_view(), name="redefinir-senha"),
]
