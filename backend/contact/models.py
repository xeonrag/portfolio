from django.db import models


class ContactMessage(models.Model):
    INTEREST_CHOICES = [
        ("General collaboration", "General collaboration"),
        ("Frontend development", "Frontend development"),
        ("Backend development", "Backend development"),
        ("Full-stack project", "Full-stack project"),
        ("Other", "Other"),
    ]

    name = models.CharField(max_length=120)
    email = models.EmailField(max_length=254)
    interest = models.CharField(max_length=40, choices=INTEREST_CHOICES)
    project_details = models.TextField(max_length=5000)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} — {self.interest}"


class Project(models.Model):
    slug = models.SlugField(max_length=80, unique=True)
    title = models.CharField(max_length=120)
    category = models.CharField(max_length=80)
    description = models.TextField()
    technologies = models.CharField(
        max_length=500,
        help_text="Enter technologies separated by commas.",
    )
    live_url = models.URLField(max_length=500, blank=True)
    repository_url = models.URLField(max_length=500, blank=True)
    display_order = models.PositiveIntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["display_order", "title"]

    def __str__(self):
        return self.title
