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
    email = serializers.EmailField(source='user.email', read_only=True)
    current_password = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True,
        help_text='Leave empty if no change needed',
        style={'input_type': 'password', 'placeholder': 'Password'}
    )
    new_password = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True,
        help_text='Leave empty if no change needed',
        style={'input_type': 'password', 'placeholder': 'Password'}
    )

    img_url = serializers.SerializerMethodField() # img_url is read_only, and used to retrive images
    # avatar is used to update the current user profile image

    class Meta:
        model = Profile
        fields = ['id', 'user_id', 'username', 'first_name', 'last_name', 'email', 'bio', 'img_url', 'avatar', 'current_password', 'new_password']

    def get_img_url(self, obj):
        print(obj.avatar.url)
        return obj.avatar.url
    
    # For updating user via Profile serializer
    def update(self, instance, validated_data):
        user_data = {}

        # Get values, defaulting to None
        current_password = validated_data.pop('current_password', None)
        new_password = validated_data.pop('new_password', None)
        
        # IMPORTANT NOTE! DON'T RETURN VALIDATION ERROR! SIMPLY RAISE IT!
        if current_password and new_password:
            
            if current_password == new_password:
                raise serializers.ValidationError({'error': "Bro, the current password and the new one are the same!"})

            user = instance.user
            if not user.check_password(current_password):
                raise serializers.ValidationError({'error': "Given current password is not valid!"})
            
            user.set_password(new_password)
            user.save()


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