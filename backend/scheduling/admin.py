from django.contrib import admin

from .models import EventType, AvailabilityRule, Booking

# Register your models here.
admin.site.register(EventType)
admin.site.register(AvailabilityRule)
admin.site.register(Booking)