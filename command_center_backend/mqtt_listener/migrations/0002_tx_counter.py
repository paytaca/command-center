# Generated by Django 5.0.6 on 2024-07-15 06:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mqtt_listener', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Tx_Counter',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('count', models.IntegerField(default=0)),
                ('date', models.DateField(auto_now_add=True)),
            ],
        ),
    ]
