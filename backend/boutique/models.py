from django.contrib.auth.models import AbstractUser
from django.db import models


class Usuario(AbstractUser):
    username = models.CharField(max_length=100, null=True, blank=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128, null=False, blank=False)
    photo = models.ImageField(
        upload_to="media/photo/",  # Directorio donde se guardarán las imágenes
        null=True,
        blank=True,
        max_length=500,  # Longitud máxima para la ruta del archivo
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.username} - {self.email}"

    @property
    def photo_url(self):
        if self.photo:
            return f"/media/{self.photo.name}"
        return None


