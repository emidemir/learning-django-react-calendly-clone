from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import EventType, AvailabilityRule, Booking
from .serializers import EventTypeSerializer, AvailabilityRuleSerializer, BookingSerializer

class EventTypeViewset(viewsets.ModelViewSet):
    serializer_class = EventTypeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return EventType.objects.filter(host=user)


class AvailabiltyRuleViewset(viewsets.ModelViewSet):
    serializer_class = AvailabilityRuleSerializer



class BookingViewset(viewsets.ModelViewSet):
    serializer_class = BookingSerializer