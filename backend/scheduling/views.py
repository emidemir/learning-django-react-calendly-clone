from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from .serializers import EventTypeSerializer, PublicBookingSerializer
from .models import EventType, Booking
from users.models import Profile

# Ensure the correct path to check_booking is used
from .services.check_booking import check_booking

from django.shortcuts import render, get_object_or_404

class PublicBookingView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, username, slug):
        event_type = get_object_or_404(
            EventType,
            host__username = username,
            slug=slug,
            is_active = True
        )

        serializer = EventTypeSerializer(event_type, context={'request': request})

        return Response(serializer.data)
    
class BookingProfileEventFetch(APIView):
    permission_classes = [AllowAny]

    def get(self, request, username):
        host_profile = get_object_or_404(Profile, user__username=username)
        serializer = PublicBookingSerializer(host_profile, context={'request': request})

        return Response(serializer.data)

class BookEventView(APIView):
    def post(self, request, username, slug):
        # Check if the availability matches
        is_available = check_booking(request)

        if not is_available:
            return Response({
                'error': 'Host is not available during this date-time. Please select another slot.'
            },status=status.HTTP_400_BAD_REQUEST)
        
        else:
            return Response({
                'message': 'Booking succesfully created!',
            },status=status.HTTP_200_OK)
        
