# Generated by Django 5.0.4 on 2024-04-12 13:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('social', '0005_rename_user_userdetails'),
    ]

    operations = [
        migrations.AddField(
            model_name='userdetails',
            name='otp',
            field=models.CharField(blank=True, max_length=6, null=True),
        ),
    ]