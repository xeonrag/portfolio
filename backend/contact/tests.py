import json

from django.contrib.auth import get_user_model
from django.test import Client, TestCase

from .models import ContactMessage, Project


class AdminThemeTests(TestCase):
    def test_admin_login_loads_portfolio_theme(self):
        response = self.client.get("/admin/login/")

        self.assertContains(response, "Hrithik Uday Admin")
        self.assertContains(response, "/static/contact/admin.css")
        self.assertContains(response, "Ideas are only")
        self.assertContains(response, 'name="username"')
        self.assertContains(response, 'name="password"')
        self.assertContains(response, 'name="csrfmiddlewaretoken"')

    def test_admin_dashboard_uses_portfolio_branding(self):
        user = get_user_model().objects.create_superuser(
            username="admin-theme-test",
            email="admin-theme@example.com",
            password="test-password-123",
        )
        self.client.force_login(user)

        response = self.client.get("/admin/")

        self.assertContains(response, "Portfolio inbox")
        self.assertContains(response, "/static/contact/admin.css")
        self.assertContains(response, 'id="logout-form"')
        self.assertContains(response, "Log out")


class ContactSubmissionTests(TestCase):
    url = "/api/contact/"
    payload = {
        "name": "Test Sender",
        "email": "sender@example.com",
        "interest": "General collaboration",
        "project_details": "I'd like to discuss a project.",
    }

    def test_post_stores_message(self):
        response = self.client.post(
            self.url,
            data=json.dumps(self.payload),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(ContactMessage.objects.count(), 1)
        self.assertEqual(
            ContactMessage.objects.get().email,
            self.payload["email"],
        )

    def test_invalid_email_is_rejected(self):
        payload = {**self.payload, "email": "not-an-email"}
        response = self.client.post(
            self.url,
            data=json.dumps(payload),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(ContactMessage.objects.count(), 0)

    def test_csrf_token_endpoint_supports_protected_submission(self):
        client = Client(enforce_csrf_checks=True)
        token_response = client.get(self.url)
        token = token_response.json()["csrfToken"]

        response = client.post(
            self.url,
            data=json.dumps(self.payload),
            content_type="application/json",
            HTTP_X_CSRFTOKEN=token,
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(ContactMessage.objects.count(), 1)


class ProjectManagementTests(TestCase):
    url = "/api/projects/"

    def test_public_endpoint_returns_projects_and_links(self):
        Project.objects.create(
            slug="test-project",
            title="Test Project",
            category="TEST",
            description="A project used in an API test.",
            technologies="Python, Django",
            live_url="https://demo.example/projects/test",
            repository_url="https://code.example/projects/test",
        )

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 200)
        project = next(
            item
            for item in response.json()["projects"]
            if item["slug"] == "test-project"
        )
        self.assertEqual(project["technologies"], ["Python", "Django"])
        self.assertEqual(project["liveUrl"], "https://demo.example/projects/test")
        self.assertEqual(
            project["repositoryUrl"],
            "https://code.example/projects/test",
        )

    def test_admin_can_add_edit_and_delete_projects(self):
        user = get_user_model().objects.create_superuser(
            username="project-admin-test",
            email="project-admin@example.com",
            password="test-password-123",
        )
        self.client.force_login(user)

        add_url = "/admin/contact/project/add/"
        response = self.client.post(
            add_url,
            {
                "title": "Admin Project",
                "slug": "admin-project",
                "category": "TEST",
                "description": "Created from the Django admin.",
                "technologies": "Python, Django",
                "live_url": "",
                "repository_url": "https://code.example/repos/admin-project",
                "display_order": "99",
                "_save": "Save",
            },
        )

        self.assertEqual(response.status_code, 302)
        project = Project.objects.get(slug="admin-project")
        change_url = f"/admin/contact/project/{project.pk}/change/"
        response = self.client.post(
            change_url,
            {
                "title": "Updated Admin Project",
                "slug": "admin-project",
                "category": "UPDATED",
                "description": "Edited from the Django admin.",
                "technologies": "Python, Django, PostgreSQL",
                "live_url": "",
                "repository_url": "https://code.example/repos/updated",
                "display_order": "100",
                "_save": "Save",
            },
        )

        self.assertEqual(response.status_code, 302)
        project.refresh_from_db()
        self.assertEqual(project.title, "Updated Admin Project")

        delete_url = f"/admin/contact/project/{project.pk}/delete/"
        response = self.client.post(delete_url, {"post": "yes"})

        self.assertEqual(response.status_code, 302)
        self.assertFalse(Project.objects.filter(pk=project.pk).exists())
