# Generated by Django 5.0.6 on 2024-07-18 07:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('paytaca_map', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='location',
            name='town',
            field=models.CharField(max_length=255, null=True),
        ),
    ]
