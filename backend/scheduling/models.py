from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator

CustomUser = get_user_model()

# 1. The Menu: Types of meetings you offer
class EventType(models.Model):
    host = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='event_types')
    title = models.CharField(max_length=200)
    description = models.TextField()
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
# 3. The Result: Who booked what?

class Booking(models.Model):
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