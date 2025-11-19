from rest_framework import routers

from users.viewsets import ProfileViewset

router = routers.DefaultRouter()

router.register(prefix='profiles', viewset=ProfileViewset, basename='profile')

urlpatterns = router.urls