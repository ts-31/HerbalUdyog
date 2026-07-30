# Generated manually — migrate existing UserProfile addresses into Address book

from django.db import migrations


def forwards(apps, schema_editor):
    UserProfile = apps.get_model('users', 'UserProfile')
    Address = apps.get_model('users', 'Address')

    for profile in UserProfile.objects.select_related('user').all():
        if not (profile.address_line1 or '').strip():
            continue
        if Address.objects.filter(user_id=profile.user_id).exists():
            continue
        user = profile.user
        full_name = f"{user.first_name or ''} {user.last_name or ''}".strip() or user.email
        Address.objects.create(
            user_id=profile.user_id,
            label='Home',
            full_name=full_name,
            phone_number=profile.phone_number or '',
            address_line1=profile.address_line1,
            address_line2=profile.address_line2 or '',
            city=profile.city or '',
            state=profile.state or '',
            postal_code=profile.postal_code or '',
            country=profile.country or 'India',
            is_default=True,
        )


def backwards(apps, schema_editor):
    Address = apps.get_model('users', 'Address')
    Address.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0008_address_model'),
    ]

    operations = [
        migrations.RunPython(forwards, backwards),
    ]
