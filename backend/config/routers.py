from rest_framework import routers

from users.viewsets import ProfileViewset
from scheduling.viewsets import EventTypeViewset,AvailabiltyRuleViewset,BookingViewset
router = routers.DefaultRouter()

router.register(prefix='profiles', viewset=ProfileViewset, basename='profile')
router.register(prefix='event_types', viewset=EventTypeViewset, basename='event_type')
router.register(prefix='availability_rules', viewset=AvailabiltyRuleViewset, basename='availability_rule')
router.register(prefix='bookngs', viewset=BookingViewset, basename='booking')

urlpatterns = router.urls