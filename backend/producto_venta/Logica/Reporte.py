from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum, Count, Avg, F, Q
from django.db.models.functions import TruncDate, TruncMonth, TruncYear, ExtractWeek
from datetime import datetime, timedelta
import calendar
from boutique.models import Venta, VentaDetalle, Producto, Categoria, Persona, MetodoPago, CostoLaboral, CostoIndirecto

class DashboardDinamicoAPI(APIView):
    
    
    def get(self, request):
        # Obtener parámetros
        tipo_reporte = request.GET.get('tipo', 'ventas')
        periodo = request.GET.get('periodo', 'mes')
        fecha_inicio = request.GET.get('fecha_inicio')
        fecha_fin = request.GET.get('fecha_fin')
        mes = request.GET.get('mes')
        año = request.GET.get('año')
        categoria_id = request.GET.get('categoria_id')
        producto_id = request.GET.get('producto_id')
        
        # Construir filtros base
        filtros = self._construir_filtros(
            periodo, fecha_inicio, fecha_fin, mes, año
        )
        
        # Ejecutar reporte según tipo
        if tipo_reporte == 'ventas':
            data = self._reporte_ventas(filtros)
        elif tipo_reporte == 'productos':
            data = self._reporte_productos(filtros, categoria_id, producto_id)
        elif tipo_reporte == 'categorias':
            data = self._reporte_categorias(filtros)
        elif tipo_reporte == 'clientes':
            data = self._reporte_clientes(filtros)
        elif tipo_reporte == 'finanzas':
            data = self._reporte_finanzas(filtros)
        else:
            return Response({'error': 'Tipo de reporte no válido'}, status=400)
        
        # Agregar metadatos
        data['metadatos'] = {
            'tipo_reporte': tipo_reporte,
            'periodo': periodo,
            'fecha_inicio': fecha_inicio,
            'fecha_fin': fecha_fin,
            'mes': mes,
            'año': año,
            'fecha_consulta': datetime.now().isoformat()
        }
        
        return Response(data)
    
    def _construir_filtros(self, periodo, fecha_inicio, fecha_fin, mes, año):
        """Construye los filtros de fecha según el período seleccionado"""
        hoy = datetime.now().date()
        filtros = Q()
        
        if periodo == 'dia':
            # Hoy
            fecha_filtro = hoy
            filtros &= Q(fecha__date=fecha_filtro)
            
        elif periodo == 'semana':
            # Esta semana (lunes a domingo)
            start_of_week = hoy - timedelta(days=hoy.weekday())
            end_of_week = start_of_week + timedelta(days=6)
            filtros &= Q(fecha__date__range=[start_of_week, end_of_week])
            
        elif periodo == 'mes':
            # Mes específico o mes actual
            if mes and año:
                year = int(año)
                month = int(mes)
                start_date = datetime(year, month, 1).date()
                end_date = datetime(year, month, calendar.monthrange(year, month)[1]).date()
            else:
                # Mes actual
                start_date = hoy.replace(day=1)
                end_date = hoy.replace(day=calendar.monthrange(hoy.year, hoy.month)[1])
            
            filtros &= Q(fecha__date__range=[start_date, end_date])
            
        elif periodo == 'año':
            # Año específico o año actual
            if año:
                year = int(año)
            else:
                year = hoy.year
                
            start_date = datetime(year, 1, 1).date()
            end_date = datetime(year, 12, 31).date()
            filtros &= Q(fecha__date__range=[start_date, end_date])
            
        elif periodo == 'rango' and fecha_inicio and fecha_fin:
            # Rango personalizado
            try:
                start_date = datetime.strptime(fecha_inicio, '%Y-%m-%d').date()
                end_date = datetime.strptime(fecha_fin, '%Y-%m-%d').date()
                filtros &= Q(fecha__date__range=[start_date, end_date])
            except ValueError:
                pass
        
        return filtros
    
    def _reporte_ventas(self, filtros):
        """Reporte completo de ventas"""
        ventas = Venta.objects.filter(filtros)
        
        # Métricas principales
        total_ventas = ventas.count()
        total_ingresos = VentaDetalle.objects.filter(venta__in=ventas).aggregate(
            total=Sum('subtotal')
        )['total'] or 0
        
        total_productos_vendidos = VentaDetalle.objects.filter(venta__in=ventas).aggregate(
            total=Sum('cantidad')
        )['total'] or 0
        
        # Ventas por día (para gráfico)
        ventas_por_dia = ventas.annotate(
            fecha_dia=TruncDate('fecha')
        ).values('fecha_dia').annotate(
            cantidad_ventas=Count('id'),
            total_ingresos=Sum('detalles__subtotal')
        ).order_by('fecha_dia')
        
        # Ventas por método de pago
        ventas_por_metodo = ventas.values(
            'tipo_pago__nombre'
        ).annotate(
            cantidad=Count('id'),
            total=Sum('detalles__subtotal')
        ).order_by('-total')
        
        # Ticket promedio
        ticket_promedio = total_ingresos / total_ventas if total_ventas > 0 else 0
        
        return {
            'metricas_principales': {
                'total_ventas': total_ventas,
                'total_ingresos': float(total_ingresos),
                'total_productos_vendidos': total_productos_vendidos,
                'ticket_promedio': round(float(ticket_promedio), 2),
                'ventas_promedio_dia': round(total_ventas / max(len(ventas_por_dia), 1), 1)
            },
            'ventas_por_dia': list(ventas_por_dia),
            'ventas_por_metodo_pago': list(ventas_por_metodo),
            'tendencia_semanal': self._calcular_tendencia_semanal()
        }
    
    def _reporte_productos(self, filtros, categoria_id=None, producto_id=None):
        """Reporte de productos"""
        ventas = Venta.objects.filter(filtros)
        detalles = VentaDetalle.objects.filter(venta__in=ventas)
        
        # Aplicar filtros adicionales
        if categoria_id:
            detalles = detalles.filter(producto__categoria_id=categoria_id)
        if producto_id:
            detalles = detalles.filter(producto_id=producto_id)
        
        # Productos más vendidos
        productos_top = detalles.values(
            'producto__id',
            'producto__nombre',
            'producto__categoria__nombre',
            'producto__precio'
        ).annotate(
            cantidad_vendida=Sum('cantidad'),
            ingresos_totales=Sum('subtotal'),
            veces_vendido=Count('id')
        ).order_by('-cantidad_vendida')[:15]
        
        # Productos por categoría
        productos_por_categoria = detalles.values(
            'producto__categoria__nombre'
        ).annotate(
            cantidad_vendida=Sum('cantidad'),
            ingresos_totales=Sum('subtotal'),
            productos_distintos=Count('producto', distinct=True)
        ).order_by('-ingresos_totales')
        
        # Stock bajo
        stock_bajo = Producto.objects.filter(cantidad__lte=10).values(
            'id', 'nombre', 'cantidad', 'precio'
        ).order_by('cantidad')[:10]
        
        return {
            'productos_mas_vendidos': list(productos_top),
            'productos_por_categoria': list(productos_por_categoria),
            'stock_bajo': list(stock_bajo),
            'total_productos_analizados': len(productos_top)
        }
    
    def _reporte_categorias(self, filtros):
        """Reporte por categorías"""
        ventas = Venta.objects.filter(filtros)
        detalles = VentaDetalle.objects.filter(venta__in=ventas)
        
        # Rendimiento por categoría
        categorias_rendimiento = detalles.values(
            'producto__categoria__id',
            'producto__categoria__nombre'
        ).annotate(
            ventas_totales=Count('id'),
            productos_vendidos=Sum('cantidad'),
            ingresos_totales=Sum('subtotal'),
            productos_distintos=Count('producto', distinct=True)
        ).order_by('-ingresos_totales')
        
        # Categorías con mejor margen (simulado)
        categorias_margen = []
        for cat in categorias_rendimiento:
            # Margen simulado: 40% del ingreso como ganancia
            ingresos = cat['ingresos_totales'] or 0
            margen_estimado = ingresos * 0.4
            categorias_margen.append({
                **cat,
                'margen_estimado': round(float(margen_estimado), 2),
                'porcentaje_margen': 40.0
            })
        
        return {
            'categorias_rendimiento': list(categorias_rendimiento),
            'categorias_margen': categorias_margen,
            'categoria_top': categorias_rendimiento[0] if categorias_rendimiento else None
        }
    
    def _reporte_clientes(self, filtros):
        """Reporte de clientes"""
        ventas = Venta.objects.filter(filtros & Q(persona__isnull=False))
        
        # Clientes más frecuentes
        clientes_top = ventas.values(
            'persona__id',
            'persona__nombre',
            'persona__apellidop',
            'persona__correo'
        ).annotate(
            compras_totales=Count('id'),
            gasto_total=Sum('detalles__subtotal'),
            productos_comprados=Sum('detalles__cantidad'),
            ultima_compra=Max('fecha')
        ).order_by('-gasto_total')[:20]
        
        # Frecuencia de compra
        frecuencia_clientes = ventas.values(
            'persona__id'
        ).annotate(
            compras_count=Count('id')
        ).aggregate(
            clientes_1_compra=Count('id', filter=Q(compras_count=1)),
            clientes_2_5_compras=Count('id', filter=Q(compras_count__gte=2, compras_count__lte=5)),
            clientes_mas_5_compras=Count('id', filter=Q(compras_count__gt=5))
        )
        
        return {
            'clientes_top': list(clientes_top),
            'frecuencia_compras': frecuencia_clientes,
            'total_clientes_activos': len(clientes_top),
            'cliente_top': clientes_top[0] if clientes_top else None
        }
    
    def _reporte_finanzas(self, filtros):
        """Reporte financiero"""
        ventas = Venta.objects.filter(filtros)
        
        # Ingresos
        ingresos_totales = VentaDetalle.objects.filter(venta__in=ventas).aggregate(
            total=Sum('subtotal')
        )['total'] or 0
        
        # Costos laborales
        costos_laborales = CostoLaboral.objects.filter(filtros).aggregate(
            total=Sum(F('horas_trabajadas') * F('pago_por_hora'))
        )['total'] or 0
        
        # Costos indirectos
        costos_indirectos = CostoIndirecto.objects.filter(filtros).aggregate(
            total=Sum('monto')
        )['total'] or 0
        
        # Ganancia estimada (simplificado)
        costos_totales = costos_laborales + costos_indirectos
        ganancia_neta = ingresos_totales - costos_totales
        margen_ganancia = (ganancia_neta / ingresos_totales * 100) if ingresos_totales > 0 else 0
        
        # Eficiencia
        ingresos_por_empleado = ingresos_totales / max(CostoLaboral.objects.filter(filtros).count(), 1)
        
        return {
            'resumen_financiero': {
                'ingresos_totales': float(ingresos_totales),
                'costos_laborales': float(costos_laborales),
                'costos_indirectos': float(costos_indirectos),
                'costos_totales': float(costos_totales),
                'ganancia_neta': float(ganancia_neta),
                'margen_ganancia': round(float(margen_ganancia), 2),
                'ingresos_por_empleado': round(float(ingresos_por_empleado), 2)
            },
            'distribucion_costos': {
                'laboral': float(costos_laborales),
                'indirectos': float(costos_indirectos),
                'porcentaje_laboral': round((costos_laborales / costos_totales * 100) if costos_totales > 0 else 0, 2),
                'porcentaje_indirectos': round((costos_indirectos / costos_totales * 100) if costos_totales > 0 else 0, 2)
            }
        }
    
    def _calcular_tendencia_semanal(self):
        """Calcula la tendencia semanal comparando con la semana anterior"""
        hoy = datetime.now().date()
        
        # Semana actual
        inicio_semana_actual = hoy - timedelta(days=hoy.weekday())
        fin_semana_actual = inicio_semana_actual + timedelta(days=6)
        
        # Semana anterior
        inicio_semana_anterior = inicio_semana_actual - timedelta(days=7)
        fin_semana_anterior = inicio_semana_anterior + timedelta(days=6)
        
        # Ventas semana actual
        ventas_actual = Venta.objects.filter(
            fecha__date__range=[inicio_semana_actual, fin_semana_actual]
        ).count()
        
        # Ventas semana anterior
        ventas_anterior = Venta.objects.filter(
            fecha__date__range=[inicio_semana_anterior, fin_semana_anterior]
        ).count()
        
        # Calcular tendencia
        if ventas_anterior > 0:
            tendencia = ((ventas_actual - ventas_anterior) / ventas_anterior) * 100
        else:
            tendencia = 100 if ventas_actual > 0 else 0
        
        return {
            'tendencia_porcentaje': round(tendencia, 2),
            'ventas_actual': ventas_actual,
            'ventas_anterior': ventas_anterior,
            'es_positiva': tendencia > 0
        }