from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic import TemplateView

from contact.views import project_list


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/contact/", include("contact.urls")),
    path("api/projects/", project_list, name="project-list"),
    re_path(
        r"^(?!admin(?:/|$)|api(?:/|$)|static(?:/|$)).*$",
        TemplateView.as_view(template_name="index.html"),
        name="frontend",
    ),
]
