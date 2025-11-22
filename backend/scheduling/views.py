from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .serializers import EventTypeSerializer
from .models import EventType

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