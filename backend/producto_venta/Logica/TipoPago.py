from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from boutique.models import MetodoPago
from boutique.serializers import MetodoPagoSerializer

@api_view(['GET'])
def extraer_tipo_pago(request):
    try:
        data = MetodoPago.objects.all()
        serializer = MetodoPagoSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"error": f"Error al obtener los métodos de pago: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
