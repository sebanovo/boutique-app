from boutique.models import AperturaCaja, CierreDeCaja, Persona
from rest_framework.decorators import api_view
from rest_framework.response import Response
from datetime import date, datetime
from rest_framework import status
from django.db.models import F


@api_view(['POST'])
def crear_apertura(request):
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
@api_view(["GET"])
def extraer_cajas_cerradas(request):
    try:
        # Filtrar cierres de caja que tienen fecha_cierre
        cierres = CierreDeCaja.objects.filter(
            fecha_cierre__isnull=False
        ).select_related('caja', 'usuarioapertura')
        
        data = []
        for cierre in cierres:
            data.append({
                "id": cierre.id,
                "administrador_nombre": cierre.caja.administrador.nombre if cierre.caja and cierre.caja.administrador else "N/A",
                "usuario_cierre_nombre": cierre.usuarioapertura.nombre if cierre.usuarioapertura else "N/A",
                "monto_inicio": float(cierre.caja.montoInicio) if cierre.caja else 0,
                "monto_final": float(cierre.montoFinal) if cierre.montoFinal else 0,
                "fecha_apertura": cierre.caja.fecha if cierre.caja else None,
                "fecha_cierre": cierre.fecha_cierre,
                "diferencia": float(cierre.montoFinal - cierre.caja.montoInicio) if cierre.montoFinal and cierre.caja else 0
            })
        
        return Response(data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {
                "success": False,
                "error": f"Error al obtener cajas cerradas: {str(e)}"
            }, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
@api_view(["GET"])
def extraer_caja(request):
    try:
        # ✅ Usando annotate para campos calculados
        categorias = AperturaCaja.objects.filter(
            fecha__date=date.today()
        ).annotate(
            administrador_nombre=F('administrador__nombre')
        ).values(
            "administrador_nombre", 
            "montoInicio", 
            "fecha"
        )
        
        data = list(categorias)
        return Response(data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )