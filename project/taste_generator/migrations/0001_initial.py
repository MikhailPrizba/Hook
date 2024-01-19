# Generated by Django 4.2 on 2024-01-17 15:54

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('storage', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Generator',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('main', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='main_generator', to='storage.tobacco')),
                ('secondary', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='secondary_generator', to='storage.tobacco')),
                ('tint', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tint_generator', to='storage.tobacco')),
            ],
        ),
    ]
