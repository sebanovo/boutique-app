from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.generics import ListCreateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from config import settings

from .models import (
    Usuario,
)

from .serializers import (
    UsuarioSerializer,
)

import datetime
from .serializers import UsuarioSerializer
import jwt

from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import status
from .serializers import UsuarioSerializer, GroupSerializer, PermissionSerializer

