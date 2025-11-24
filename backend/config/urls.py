# ===== DJANGO UTILITIES =====
from django.contrib import admin
from django.urls import path, include

# ===== MODULES FOR MEDIA URL =====
from django.conf import settings
from django.conf.urls.static import static

# ===== REST FRAMEWORK JWT VIEWS =====
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView, TokenVerifyView

# ===== AUTHENTICATION ENDPOINTS =====
from users.views import sign_in, sign_up, google_oauth, logout

# ===== AUTHENTICATION ENDPOINTS ===== 
from scheduling.views import PublicBookingView, BookingProfileEventFetch, BookEventView

urlpatterns = [
    path('admin/', admin.site.urls),
    

    # JWT 
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # Authentication
    path('auth/signin/', sign_in, name='signin'),
    path('auth/signup/', sign_up, name='signup'),
    path('auth/oauth/', google_oauth, name='google-auth'),
    path('auth/logout/', logout, name='logout'),

    # Router URLS
    path('', include('config.routers')),
    
    # Public booking endpoint
    path('booking/<str:username>/<slug:slug>/', PublicBookingView.as_view(), name='public-booking'), # Fetches event data
    path('<str:username>/', BookingProfileEventFetch.as_view(), name='public-user_events'), # Fetches profile data
    path('<str:username>/<slug:slug>/details', BookEventView.as_view(), name="book_event"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


