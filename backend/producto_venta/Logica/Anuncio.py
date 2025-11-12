from boutique.models import AperturaCaja, CierreDeCaja, Persona
from rest_framework.decorators import api_view
from rest_framework.response import Response
from datetime import date, datetime
from rest_framework import status
from django.db.models import F

@api_view(['POST'])
def crear_Anuncio(request):
    try:
        if not request.data:
            return Response(
                {"error": "No se proporcionaron datos"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        monto = request.data.get("monto")
        
        if not monto:
            return Response(
                {"error": "El monto es obligatorio"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Obtener el usuario de la sesión
        usuario_id = request.session.get('id')
        if not usuario_id:
            return Response(
                {"error": "Usuario no autenticado"}, 
                status=status.HTTP_401_UNAUTHORIZED
            )    
        try:
            administrador = Persona.objects.get(id=usuario_id)
        except Persona.DoesNotExist:
            return Response(
                {"error": "Usuario no encontrado"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        apertura = AperturaCaja.objects.create(
            montoInicio=monto, 
            administrador=administrador
        )
        return Response({
            "success": True,
            "message": "Apertura de caja creada exitosamente",
            "data": {
                "id": apertura.id,
                "monto_inicio": float(apertura.montoInicio),
                "fecha": apertura.fecha,
                "administrador": administrador.nombre
            }
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(
            {"error": f"Error al crear apertura de caja: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
