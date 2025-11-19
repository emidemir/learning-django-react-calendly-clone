from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .permissions import IsOwner

from .models import Profile

from .serializers import ProfileSerializer

class ProfileViewset(viewsets.ModelViewSet):
    serializer_class = ProfileSerializer
    
    # IsOwner is redundant, but still a good practice to add in this case since the get_queryset is already overriden
    permission_classes = [IsAuthenticated, IsOwner]

    lookup_field = 'user'

    # To prevent users sending POST request to create a new profile if they signed up
    http_method_names = ['get', 'put', 'patch', 'delete', 'head', 'options']
    
    # Since we override the get_queryset method, we don't need to define it above
    def get_queryset(self):
        qs = Profile.objects.filter(user=self.request.user)
        return qs