"""
Rotas do projeto. Toda a API fica em /api/; o front chama /api/... e o
proxy do Vite repassa para cá (ver frontend/vite.config.js).
"""

from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("apps.usuarios.urls")),
    path("api/", include("apps.montagens.urls")),
]
