from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from boutique.models import *
from django.db import transaction  # Añade esta importación
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import json
from datetime import date
from django.db import transaction

@api_view(['POST'])
def venta_online(request):
    try:
        data = request.data
        carrito = data.get('carrito', {})
        longitud = data.get('longitud')
        latitud = data.get('latitud')
        monto = data.get('monto')
        cliente_id = request.session.get('id')

        # ✅ Validaciones más robustas
        if not carrito or not cliente_id:
            return Response(
                {"error": "Datos incompletos: carrito o cliente faltante"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        if not longitud or not latitud:
            return Response(
                {"error": "Coordenadas de ubicación requeridas"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Obtener método de pago
        tipo_pago = MetodoPago.objects.filter(nombre='Stripe').first()
        if not tipo_pago:
            return Response(
                {"error": "Método de pago no configurado"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # ✅ Crear Venta con transacción atómica
        with transaction.atomic():
            venta = Venta.objects.create(
                persona_id=cliente_id,
                tipo_pago=tipo_pago,
                # total=monto  # ⚠️ Si tu modelo Venta tiene campo total
            )

            # Crear registro Online
            Online.objects.create(
                persona_id=cliente_id,
                longitud=longitud,
                latitud=latitud,
                venta=venta,
                estado="Espera"
            )

            # Crear detalles de venta
            detalles = []
            for item in carrito.get('items', []):
                producto = Producto.objects.get(id=item['id'])
                
                VentaDetalle.objects.create(
                    venta=venta,
                    producto=producto,
                    cantidad=item['cantidad'],
                    subtotal=item['precio'] * item['cantidad']
                )
                
                # ✅ Actualizar cantidad comprada del producto
                producto.cantidad_comprada += item['cantidad']
                producto.save()

            return Response({
                "mensaje": "Venta registrada correctamente",
                "venta_id": venta.id,
                "detalles_count": len(detalles)
            }, status=status.HTTP_201_CREATED)

    except Producto.DoesNotExist:
        return Response(
            {"error": "Producto no encontrado"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {"error": f"Error interno: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
@api_view(['POST'])
def venta_local(request):
    try:
        data = json.loads(request.body)
        print("📦 Datos recibidos:", data)

        persona_id = request.session.get('id')
        if not persona_id:
            return Response({
                'success': False,
                'message': 'No se encontró el ID de la persona en la sesión'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Obtener apertura de caja del día
        apertura = AperturaCaja.objects.filter(fecha__date=date.today()).first()
        if not apertura:
            return Response({
                'success': False,
                'message': 'No hay caja abierta para hoy'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Obtener persona desde la sesión
        try:
            persona = Persona.objects.get(id=persona_id)
        except Persona.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Persona no encontrada'
            }, status=status.HTTP_404_NOT_FOUND)

        # Obtener método de pago
        try:
            tipo_pago = MetodoPago.objects.get(id=data.get('tipo_pago'))
        except MetodoPago.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Método de pago no válido'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Usar transacción para asegurar consistencia
        with transaction.atomic():
            # 1. Crear la venta
            venta = Venta.objects.create(
                tipo_pago=tipo_pago,
                persona=persona,
            )

            # 2. Crear registro en Local
            local_venta = Local.objects.create(
                persona=persona,
                nit=data.get('nit', ''),
                nombre=data.get('nombre', ''),
                apellido=data.get('apellido', ''),
                apertura=apertura
            )

            # 3. Crear detalles de venta
            productos = data.get('productos', [])
            total_venta = 0
            
            for producto_data in productos:
                try:
                    producto = Producto.objects.get(id=producto_data['id'])
                    
                    # Calcular subtotal
                    cantidad = producto_data.get('cantidad', 1)
                    subtotal = producto.precio * cantidad
                    total_venta += subtotal
                    
                    # Crear detalle de venta
                    VentaDetalle.objects.create(
                        subtotal=subtotal,
                        producto=producto,
                        venta=venta,
                        cantidad=cantidad
                    )
                    
                    # Actualizar stock del producto
                    producto.cantidad -= cantidad
                    producto.cantidad_comprada += cantidad
                    producto.save()
                    
                except Producto.DoesNotExist:
                    return Response({
                        'success': False,
                        'message': f'Producto con ID {producto_data.get("id")} no encontrado'
                    }, status=status.HTTP_404_NOT_FOUND)

            # 4. Actualizar venta con total (si tu modelo tiene campo total)
            # Si no tiene, puedes calcularlo desde los detalles

        return Response({
            'success': True,
            'message': '✅ Venta registrada correctamente',
            'data': {
                'venta_id': venta.id,
                'local_id': local_venta.id,
                'cliente': f"{data.get('nombre', '')} {data.get('apellido', '')}",
                'nit': data.get('nit', ''),
                'total_venta': float(total_venta),
                'productos_vendidos': len(productos),
                'fecha': venta.fecha.strftime('%Y-%m-%d %H:%M:%S')
            }
        }, status=status.HTTP_201_CREATED)

    except json.JSONDecodeError:
        return Response({
            'success': False,
            'message': 'Error en el formato JSON'
        }, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        print(f"❌ Error interno: {str(e)}")
        return Response({
            'success': False,
            'message': f'Error interno del servidor: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)