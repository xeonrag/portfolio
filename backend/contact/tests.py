import json

from django.contrib.auth import get_user_model
from django.test import Client, TestCase

from .models import ContactMessage


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
