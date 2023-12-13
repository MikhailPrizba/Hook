# Generated by Django 4.2.7 on 2023-11-24 13:54

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("user", "0002_alter_user_user_role"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="user_role",
            field=models.TextField(
                choices=[
                    ("UNKNOWN", "Unknown"),
                    ("OWNER", "Owner"),
                    ("ADMIN", "Admin"),
                    ("HOOKAH", "Hookah"),
                ],
                default="OWNER",
            ),
        ),
    ]
