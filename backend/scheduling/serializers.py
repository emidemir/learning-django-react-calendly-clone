from rest_framework import serializers

from .models import EventType,AvailabilityRule,Booking

class EventTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventType
        fields = '__all__'

class AvailabilityRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvailabilityRule
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'