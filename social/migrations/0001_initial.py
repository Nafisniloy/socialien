from django.contrib.auth.models import User  # Import Django's built-in User model
from django.db import migrations

def migrate_usernames_to_name(apps, schema_editor):
    for user in User.objects.all():
        if not user.first_name and not user.last_name:  # Check if name is not already set
            user.first_name = user.username  # Assuming username is the old field
            user.save()

class Migration(migrations.Migration):

    dependencies = [
        # Add any dependencies here
    ]

    operations = [
        migrations.RunPython(migrate_usernames_to_name),
    ]
