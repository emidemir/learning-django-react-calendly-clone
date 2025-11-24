from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from django.template.defaultfilters import slugify

import pytz

CustomUser = get_user_model()

# 1. The Menu: Types of meetings you offer
class EventType(models.Model):
    host = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='event_types')
    title = models.CharField(max_length=200)
    description = models.TextField()

    # Slug is used for each event, created by serializer. A visitor will use this url for booking
    slug = models.SlugField(null=True, blank=True, unique=True, max_length=200)

    # Make sure the duration (in minutes) is less than 24 hours, greater than 0 hours
    duration = models.IntegerField(validators=[
        MinValueValidator(0),
        MaxValueValidator(1440)
    ])

    bufferBefore = models.IntegerField(default=10, validators=[
        MinValueValidator(0),
        MaxValueValidator(30),
    ])
    
    bufferAfter = models.IntegerField(default=10, validators=[
        MinValueValidator(0),
        MaxValueValidator(30),
    ])
    is_active = models.BooleanField(default=True, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ['host', 'slug']

    def save(self, *args, **kwargs):
        self.slug = slugify(self.title)
        super().save(*args, **kwargs)

# 2. The Rules: When are you actually free?
class AvailabilityRule(models.Model):
    
    event_type = models.ForeignKey(EventType, on_delete=models.CASCADE, related_name='availability_rules')
    start_time = models.TimeField()
    end_time = models.TimeField()

    class Days(models.TextChoices):
        MONDAY = 'MONDAY', 'Monday'
        TUESDAY = 'TUESDAY', 'Tuesday'
        WEDNESDAY = 'WEDNESDAY', 'Wednesday'
        THURSDAY = 'THURSDAY', 'Thursday'
        FRIDAY = 'FRIDAY', 'Friday'
        SATURDAY = 'SATURDAY', 'Saturday'
        SUNDAY = 'SUNDAY', 'Sunday'
    day_of_week = models.CharField(max_length=9, choices=Days.choices, blank=True, null=True)
    isAvailable = models.BooleanField(default = True)
    day = models.DateField(null=True, blank=True)

# 3. The Result: Who booked what?
class Booking(models.Model):
    TIMEZONE_CHOICES = tuple(zip(pytz.common_timezones, pytz.common_timezones))
    time_zone = models.CharField(max_length=32, choices=TIMEZONE_CHOICES, default='UTC')
    
    event_type = models.ForeignKey(EventType, on_delete=models.CASCADE, related_name='bookings')
    booker_name = models.CharField(max_length=100)
    booker_email = models.EmailField()
    
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    
    status = models.CharField(
        max_length=20, 
        choices=[('CONFIRMED', 'Confirmed'), ('CANCELED', 'Canceled')],
        default='confirmed'
    )