from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

# For manual token creation when a user signs up for the first time
from rest_framework_simplejwt.tokens import RefreshToken 

from django.shortcuts import render
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import get_user_model

import requests
import json

User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def sign_up(request):
    """Traditional signup via signup form"""
    username = request.data.get('username')
    email = request.data.get('email') 
    password = request.data.get('password') 
    first_name = request.data.get('first_name')
    last_name = request.data.get('last_name')

    if not email or not password:
        return Response({
            'error': 'Email and password are required'
        }, status=status.HTTP_400_BAD_REQUEST)

    # Check if user already exists
    if User.objects.filter(email=email).exists():
        return Response({
            'error': "A user with this email already exists"
        }, status=status.HTTP_400_BAD_REQUEST)
    

    try:
        # Validate password
        # I'm commenting this step because for development, I want to be able to 
        # use passwords like 123
        # validate_password(password)
        # Create user
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
        }, status=status.HTTP_201_CREATED)
    except Exception as E:
        return Response(
            {'error': E},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def sign_in(request):
    """Traditional signin via signin form"""
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({
            'error': "Email and passwords are required."
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email = email)
        username = user.username
    except User.DoesNotExist:
        return Response({
            'error': 'Invalid credentials.'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(username = username, password=password)
    
    if user is None:
        return Response({
            'error': 'Invalid credentials'
        },status=status.HTTP_400_BAD_REQUEST)
    
    refresh = RefreshToken.for_user(user)

    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': {
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
        }
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def google_oauth(request):
    """Google OAuth signup & signin. Single view handles both"""
    # JWT token check (provided by the google api on frontend)
    # -check your notes if you forget it-

    google_access_token = request.data.get('access_token')
    print("1")

    if not google_access_token:
        return Response({
            'error': "access_token is required"
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # https://stackoverflow.com/a/24646356/17799171
        # https://developers.google.com/identity/sign-in/android/backend-auth
        verification_url = f"https://oauth2.googleapis.com/tokeninfo?id_token={google_access_token}"
        verification_response = requests.get(verification_url)
        
        if verification_response.status_code != 200:
            return Response({
                'error':'Invalid google totken'
            },status=status.HTTP_400_BAD_REQUEST)
        
        user_info = verification_response.json()

        # If user is not email verified, don't perform the action. Just return
        email_verified = user_info.get('email_verified') == 'true' or user_info.get('email_verified') == True
        if not email_verified:
            return Response({
                'error': "Email is not verified by Google."
            },status=status.HTTP_400_BAD_REQUEST)

        email = user_info.get('email')
        first_name = user_info.get('name')
        last_name = user_info.get("family_name")

        if not email:
            return Response({
                'error': "Email not provided by Google"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user exists
        try:
            user = User.objects.get(email=email)
            created = False

        except User.DoesNotExist:
            user = User.objects.create_user(
                username=first_name,
                email=email,
                first_name=first_name,
                last_name=last_name)
            created = True
        refresh = RefreshToken.for_user(user)

        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            },
            'created': created
        }, status=status.HTTP_200_OK)
    
    except requests.exceptions.RequestException as e:
        return Response(
            {'error': f'Failed to verify token with Google: {str(e)}'},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': f'Authentication failed: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
@api_view(['POST'])
def logout(request):
    """Logout by blacklisting the token"""
    try:
        refresh_token = request.data.get('refresh')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': "Logout succesful"}, status=status.HTTP_200_OK)
    except Exception:
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)