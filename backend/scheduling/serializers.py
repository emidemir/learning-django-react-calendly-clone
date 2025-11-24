from rest_framework import serializers

from .models import EventType,AvailabilityRule,Booking

from users.models import Profile

from .services.create_availability_slots import create_slots

class AvailabilityRuleSerializer(serializers.ModelSerializer):
    day = serializers.DateField(read_only=True)

    class Meta:
        model = AvailabilityRule
        fields = ['id', 'start_time', 'end_time', 'day_of_week', 'isAvailable', 'day']
        
class EventTypeSerializer(serializers.ModelSerializer):
    # READ ONLY FIELD for the frontend to read the existing events
    availability_rules = AvailabilityRuleSerializer(many=True, read_only=True)
    booking_url = serializers.SerializerMethodField(read_only=True) # SLug for an event

    # WRITE ONLY FIELD for the frontend to write the newly created rules
    newly_created_availability_rules = AvailabilityRuleSerializer(write_only=True, many=True, required=False)
    class Meta:
        model = EventType
        fields = ['id', 'title', 'description', 'booking_url', 'duration', 'availability_rules', 'is_active', 'bufferBefore', 'bufferAfter', 'newly_created_availability_rules', 'booking_url']
    
    def get_booking_url(self, obj):
        request = self.context.get('request')
        
        return f'booking/{obj.host.username}/{obj.slug}/'
    
    # Nested serializers are read_only by default. Override the create method to be able to
    # handle post requests without availabilty_rules
    def create(self, validated_data):
        new_rules = validated_data.pop('newly_created_availability_rules') # Talkin' in my sleep at night, makin' myself crazy ♪♪ (Dua lipa, you don't know the song? Really!!)
        
        duration = validated_data.get('duration')
        buffer_before = validated_data.get('bufferBefore')
        buffer_after = validated_data.get('bufferAfter')

        event_type = EventType.objects.create(**validated_data)
        # Add the availability creation service
        for rule in new_rules:
            create_slots(rule, duration, buffer_before, buffer_after, event_type)
            
        return event_type
    
    # For editing the existing event type object.
    def update(self, instance, validated_data):
        new_rules = validated_data.pop('newly_created_availability_rules', [])
        duration = validated_data.get('duration')
        buffer_before = validated_data.get('bufferBefore')
        buffer_after = validated_data.get('bufferAfter')

        # First, update the instance with fields other than availability rule.
        instance = super().update(instance, validated_data)

        # Clear the list so that we can create them again with the newly added values
        instance.availability_rules.all().delete()

        # Add the availability creation service
        for rule in new_rules:
            create_slots(rule, duration, buffer_before, buffer_after, instance)
            
        return instance

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'

class PublicBookingSerializer(serializers.ModelSerializer):
    host_name = serializers.CharField()
    event_slug = serializers.SlugField()
    event_title = serializers.CharField()

    event_date_time = serializers.DateTimeField()

    time_zone = serializers.timezone

    booker_name = serializers.CharField()
    booker_email = serializers.EmailField()
    notes = serializers.CharField()