from django.contrib import admin

from .models import ContactMessage, Project


admin.site.site_header = "Hrithik Uday / Admin"
admin.site.site_title = "Hrithik Uday Admin"
admin.site.index_title = "Portfolio inbox"


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "interest", "created_at")
    list_filter = ("interest", "created_at")
    search_fields = ("name", "email", "project_details")
    readonly_fields = ("created_at",)


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "display_order", "updated_at")
    list_display_links = ("title",)
    list_editable = ("display_order",)
    list_filter = ("category",)
    search_fields = ("title", "slug", "description")
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("updated_at",)
    fieldsets = (
        (
            "Project details",
            {"fields": ("title", "slug", "category", "description", "technologies")},
        ),
        ("Links", {"fields": ("live_url", "repository_url")}),
        ("Display", {"fields": ("display_order", "updated_at")}),
    )
