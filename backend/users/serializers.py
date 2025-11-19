from rest_framework import serializers

from .models import Profile, CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'full_name', 'first_name', 'last_name', 'email']

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    email = serializers.EmailField(read_only=True)

    img_url = serializers.SerializerMethodField() # img_url is read_only, and used to retrive images
    # avatar is used to update the current user profile image

    class Meta:
        model = Profile
        fields = ['id', 'user_id', 'first_name', 'last_name', 'email', 'bio', 'img_url', 'avatar']

    def get_img_url(self, obj):
        return obj.avatar.url
    
    # For updating user via Profile serializer
    def update(self, instance, validated_data):
        user_data = {}

        if 'user' in validated_data:
            user_data = validated_data.pop('user')
        
        instance.bio = validated_data.pop('bio')
        instance.avatar = validated_data.get('avatar', instance.avatar)
        instance.save()

        user = instance.user
        if 'first_name' in user_data:
            user.first_name = user_data.pop('first_name')
        if 'last_name' in user_data:
            user.last_name = user_data.pop('last_name')
        user.save()

        return instance