from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator, MinValueValidator 

def avatar_upload_path(instance, filename):
    return f"avatars/{instance.user.username}/{filename}"

# Create your models here.
class CustomUser(AbstractUser):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    is_verified = models.BooleanField(default=False)
    verification_code = models.PositiveIntegerField(default=123456, validators=[
        MinValueValidator(100000), 
        MaxValueValidator(999999)
    ])

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"


class Profile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    bio = models.TextField(null=True, blank=True)
    avatar = models.ImageField(upload_to=avatar_upload_path, default="default.jpg", blank=True)

    def save(self, *args, **kwargs):
        if not self.bio and self.user:
            self.bio = f"Hi there, I'm {self.user.full_name}. I'm using this app!"
        super().save(*args, **kwargs)