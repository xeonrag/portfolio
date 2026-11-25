from django.db import migrations


LIVE_URL_CHANGES = (
    (
        "income-expense-tracker",
        "https://myexpense.hrithikuday.me/",
        "",
    ),
    (
        "customer-bill-system",
        "https://billsystem.demo/",
        "",
    ),
    (
        "xeon-e-commerce",
        "https://ecommerce.hrithikuday.me/",
        "",
    ),
    (
        "developer-portfolio",
        "https://hrithikuday.me/",
        "https://hrithikuday.in/",
    ),
)

REPOSITORY_URL_CHANGES = (
    (
        "income-expense-tracker",
        "",
        "https://github.com/hrithikuday/MyExpense",
    ),
    (
        "xeon-e-commerce",
        "",
        "https://github.com/hrithikuday/Ecommerce",
    ),
    (
        "myapis",
        "http://hvjhojp.github.com",
        "https://github.com/hrithikuday/MyAPIs",
    ),
)


def update_project_links(apps, schema_editor):
    Project = apps.get_model("contact", "Project")
    database = schema_editor.connection.alias

    for slug, old_url, new_url in LIVE_URL_CHANGES:
        Project.objects.using(database).filter(
            slug=slug,
            live_url=old_url,
        ).update(live_url=new_url)

    for slug, old_url, new_url in REPOSITORY_URL_CHANGES:
        Project.objects.using(database).filter(
            slug=slug,
            repository_url__in=("", old_url),
        ).update(repository_url=new_url)


def reverse_project_links(apps, schema_editor):
    Project = apps.get_model("contact", "Project")
    database = schema_editor.connection.alias

    for slug, old_url, new_url in LIVE_URL_CHANGES:
        Project.objects.using(database).filter(
            slug=slug,
            live_url=new_url,
        ).update(live_url=old_url)

    for slug, old_url, new_url in REPOSITORY_URL_CHANGES:
        Project.objects.using(database).filter(
            slug=slug,
            repository_url=new_url,
        ).update(repository_url=old_url)


class Migration(migrations.Migration):
    dependencies = [
        ("contact", "0003_project_delete_projectrepositorylink"),
    ]

    operations = [
        migrations.RunPython(update_project_links, reverse_project_links),
    ]
