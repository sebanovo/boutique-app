from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password
from boutique.models import Persona, Rol
from boutique.serializers import PersonaSerializer, RolSerializer

# =========================
# VER PERSONAS
# =========================
@api_view(['POST'])
def login(request):
    try:
        data = request.data
        email = data.get('email')
        password = data.get('password')

        persona = Persona.objects.filter(correo=email).first()
        if not persona:
            return Response(
                {"success": False, "message": "No está registrado en el sistema."},
                status=status.HTTP_404_NOT_FOUND
            )

        if password == persona.password:
            request.session['nombre'] = persona.nombre
            request.session['paterno'] = persona.apellidop
            request.session['materno'] = persona.apellidom
            request.session['id'] = persona.id

            return Response(
                {
                "success": True, 
                 "message": f"Bienvenido al sistema, {persona.nombre}.",
                 "nombre":f"{persona.nombre} {persona.apellidop}",
                 "correo":f"{persona.correo}",
                 },
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"success": False, "message": "Contraseña incorrecta."},
                status=status.HTTP_401_UNAUTHORIZED
            )

    except Exception as e:
        return Response(
            {"success": False, "message": f"Error al obtener las credenciales: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
@api_view(['GET'])
def verUsuario(request):
    try:
        usuarios = Persona.objects.all()  # Obtiene todos los usuarios
        serializer = PersonaSerializer(usuarios, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"error": f"Error al obtener los usuarios: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
# =========================
# VER ROLES
# =========================
@api_view(['GET'])
def verRol(request):
    try:
        roles = Rol.objects.all()
        serializer = RolSerializer(roles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"error": f"Error al obtener los roles: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# =========================
# CREAR PERSONA CLIENTE
# =========================
@api_view(['POST'])
def Crear_persona_cliente(request):
    try:
        print("=== INICIANDO CREACIÓN DE PERSONA ===")
        print("Datos recibidos:", request.data)
        
        data = request.data
        password = data.get('password')
        confirmar = data.get('confirmarPassword')

        # Validación de contraseñas
        if password != confirmar:
            return Response({'error': 'Las contraseñas no coinciden.'}, status=status.HTTP_400_BAD_REQUEST)

        # Campos requeridos
        campos_requeridos = ['username', 'nombre', 'email', 'password']
        for campo in campos_requeridos:
            if not data.get(campo):
                return Response({'error': f'El campo {campo} es requerido.'}, status=status.HTTP_400_BAD_REQUEST)

        # Verificar duplicados
        if Persona.objects.filter(correo=data.get('email')).exists():
            return Response({'error': 'El correo ya está registrado.'}, status=status.HTTP_400_BAD_REQUEST)

        if Persona.objects.filter(usuario=data.get('username')).exists():
            return Response({'error': 'El nombre de usuario ya existe.'}, status=status.HTTP_400_BAD_REQUEST)

        # Obtener rol 'Usuario'
        rol_usuario = Rol.objects.filter(nombre='Usuario').first()
        if not rol_usuario:
            return Response({'error': 'Rol "Usuario" no encontrado.'}, status=status.HTTP_400_BAD_REQUEST)

        # Crear persona con contraseña encriptada
        nueva_persona = Persona.objects.create(
            usuario=data.get('username'),
            nombre=data.get('nombre'),
            apellidop=data.get('apellidop', ''),
            apellidom=data.get('apellidom', ''),
            telefono=data.get('telefono', ''),
            correo=data.get('email'),
            password=password,
            rol=rol_usuario  # Aquí va la instancia completa
        )

        print("Persona creada exitosamente:", nueva_persona.id)
        
        serializer = PersonaSerializer(nueva_persona)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        print("=== ERROR DETALLADO ===")
        import traceback
        traceback.print_exc()
        return Response({'error': f'Error al crear persona: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def Crear_persona_personal(request):
    try:
        nueva_persona = Persona.objects.create(
            nombre=request.data.get('nombre'),  # Cambiar request.POST por request.data
            apellidop=request.data.get('paterno', ''),
            apellidom=request.data.get('materno', ''),
            telefono=request.data.get('telefono', ''),
            correo=request.data.get('eamil'),  # Corregir el typo aquí también
            password=request.data.get('telefono'),
            rol_id=request.data.get('rol')
        )

        print("✅ Persona creada exitosamente:", nueva_persona.id)
        serializer = PersonaSerializer(nueva_persona)

        return Response({
            "success": True,
            "message": "Persona creada correctamente.",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({
            "success": False,
            "message": f"Error al crear persona: {str(e)}"
        }, status=status.HTTP_400_BAD_REQUEST)