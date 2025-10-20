from rest_framework import serializers
from django.contrib.auth.models import Group, Permission
from .models import (
    Usuario,
)

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ["id", "name"]

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ["id", "name", "codename", "content_type"]


class UsuarioWithGroupsSerializer(serializers.ModelSerializer):
    groups = GroupSerializer(many=True, read_only=True)

    class Meta:
        model = Usuario
        fields = ["id", "username", "email", "groups", "photo_url"]


class UsuarioSerializer(serializers.ModelSerializer):
    groups = GroupSerializer(many=True, read_only=True)

    class Meta:
        model = Usuario
        fields = "__all__"
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = Usuario.objects.create(
            username=validated_data["username"],
            email=validated_data["email"],
        )
        if password is not None:
            user.set_password(password)
        user.save()
        return user

