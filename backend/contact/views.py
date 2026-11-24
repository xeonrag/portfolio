import json

from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods

from .models import ContactMessage


@ensure_csrf_cookie
@require_http_methods(["GET", "POST"])
def contact(request):
    if request.method == "GET":
        return JsonResponse({"csrfToken": get_token(request)})

    if request.content_type != "application/json":
        return JsonResponse(
            {"error": "Send the form as JSON."},
            status=415,
        )

    try:
        payload = json.loads(request.body)
    except (UnicodeDecodeError, json.JSONDecodeError):
        return JsonResponse({"error": "The request body is not valid JSON."}, status=400)

    if not isinstance(payload, dict):
        return JsonResponse({"error": "The request body must be a JSON object."}, status=400)

    name = payload.get("name")
    email = payload.get("email")
    interest = payload.get("interest")
    project_details = payload.get("project_details")

    if not all(
        isinstance(value, str)
        for value in (name, email, interest, project_details)
    ):
        return JsonResponse({"error": "Please complete all fields."}, status=400)

    name = name.strip()
    email = email.strip()
    project_details = project_details.strip()

    if not name or len(name) > 120:
        return JsonResponse(
            {"error": "Enter a name of 1 to 120 characters."},
            status=400,
        )
    if not email or len(email) > 254:
        return JsonResponse(
            {"error": "Enter an email address of 1 to 254 characters."},
            status=400,
        )
    try:
        validate_email(email)
    except ValidationError:
        return JsonResponse({"error": "Enter a valid email address."}, status=400)
    if interest not in dict(ContactMessage.INTEREST_CHOICES):
        return JsonResponse({"error": "Choose a valid area of interest."}, status=400)
    if not project_details or len(project_details) > 5000:
        return JsonResponse(
            {"error": "Project details must be between 1 and 5000 characters."},
            status=400,
        )

    ContactMessage.objects.create(
        name=name,
        email=email,
        interest=interest,
        project_details=project_details,
    )
    return JsonResponse({"message": "Message received."}, status=201)
