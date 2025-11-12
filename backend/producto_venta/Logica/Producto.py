# producto_venta/Logica/Producto.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from boutique.models import Producto
from rest_framework import status
from boutique.serializers import ProductoSerializer

@api_view(["POST"])
def Crear_producto(request):
    try:
        # request.data funciona tanto con JSON como con FormData
        producto = Producto.objects.create(
            nombre=       request.data.get('nombre'),
            cantidad=     request.data.get('cantidad'),
            precio=       request.data.get('precio'),
            codigo_barra= request.data.get('codigo'),
            categoria_id= request.data.get('categoria'),  # FK
            url=          request.data.get('url'),
            costo_unitario=request.data.get('costo_unitario'),
        )

        serializer = ProductoSerializer(producto)

        return Response({
            "success": True,
            "message": "Producto creado correctamente",
            "data": serializer.data
        }, status=201)

    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({
            "success": False,
            "message": f"Error al crear producto: {str(e)}"
        }, status=400)


@api_view(["GET"])
def extraer_producto(request):
    try:
        productos = Producto.objects.select_related('categoria').values(
            "id", "nombre", "cantidad", "precio", "codigo_barra", 
            "categoria__nombre", "url", "creado_en"  # categoria__nombre en lugar de categoria
        )
        data = list(productos)
        return Response(data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(["GET"])
def extraer(request):
    try:
        productos = Producto.objects.select_related('categoria').values(
            "id", "nombre", "cantidad", "precio", "codigo_barra","costo_unitario", 
            "categoria__nombre", "url", "creado_en"  # categoria__nombre en lugar de categoria
        )
        data = list(productos)
        return Response(data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)