from django.db import models
from django.contrib.auth import get_user_model

CustomUser = get_user_model()

# 1. The Menu: Types of meetings you offer
class EventType(models.Model):
    host = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='event_types')
    title = models.CharField(max_length=200)
    description = models.TextField()
    duration = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

# 2. The Rules: When are you actually free?
class AvailabilityRule(models.Model):
    
    event_type = models.ForeignKey(EventType, on_delete=models.CASCADE, related_name='availability_rule')
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