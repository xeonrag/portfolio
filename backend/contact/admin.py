from django.contrib import admin

from .models import ContactMessage


admin.site.site_header = "Hrithik Uday / Admin"
admin.site.site_title = "Hrithik Uday Admin"
admin.site.index_title = "Portfolio inbox"


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "interest", "created_at")
    list_filter = ("interest", "created_at")
    search_fields = ("name", "email", "project_details")
    readonly_fields = ("created_at",)
