from rest_framework import serializers

from .models import EventType,AvailabilityRule,Booking

from users.models import Profile

class AvailabilityRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvailabilityRule
        fields = ['id', 'start_time', 'end_time', 'day_of_week', 'isAvailable']
        
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
        event_type = EventType.objects.create(**validated_data)

        for rule in new_rules:
            AvailabilityRule.objects.create(event_type=event_type, **rule)
        
        return event_type
    
    # For editing the existing event type object.
    def update(self, instance, validated_data):
        new_rules = validated_data.pop('newly_created_availability_rules', [])
        
        # First, update the instance with fields other than availability rule.
        instance = super().update(instance, validated_data)

        # Clear the list so that we can create them again with the newly added values
        instance.availability_rules.all().delete()

        for rule in new_rules:
            AvailabilityRule.objects.create(event_type=instance, **rule)

        return instance

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'

class PublicBookingSerializer(serializers.ModelSerializer):
    # Fields from the user model
    full_name = serializers.CharField(source='user.full_name')
    username = serializers.CharField(source='user.username')
    
    # Fields from the profile model
    profile_picture = serializers.ImageField(source='avatar')
    
    # Fields from the event model
    event_types = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ['full_name', 'username', 'profile_picture', 'bio', 'event_types']

    def get_event_types(self, obj):
        user = obj.user
        active_events = EventType.objects.filter(host = user, is_active = True)
        return EventTypeSerializer(active_events, many=True).data