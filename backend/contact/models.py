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
