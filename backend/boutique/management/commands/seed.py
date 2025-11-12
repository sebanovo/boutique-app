from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from ...models import Rol, Permiso, MetodoPago, PermisoRol  # Ajusta 'core' por el nombre de tu app

User = get_user_model()

class Command(BaseCommand):
    help = 'Seed initial data including roles, permisos, pagos y usuarios'

    def handle(self, *args, **kwargs):
        # 1️⃣ Métodos de Pago
        metodos_pago = [
            'Efectivo',
            'Stripe',
            'Tarjeta Credito',
            'Tarjeta Debito',
            'QR',
            'Cripto',
        ]
        for mp in metodos_pago:
            obj, created = MetodoPago.objects.get_or_create(nombre=mp)
            if created:
                self.stdout.write(f'MetodoPago creado: {obj.nombre}')

        # 2️⃣ Roles
        roles = [
            'Administrador',
            'Vendedor', 
            'Usuario',
            'Finanzas',
            'Comprador',
            ]
        for r in roles:
            obj, created = Rol.objects.get_or_create(nombre=r)
            if created:
                self.stdout.write(f'Rol creado: {obj.nombre}')

        # 3️⃣ Permisos
        permisos = [
            'Informes',
            'Gestion-Trabajadores',
            'Gestion-Productos',
            'Gestion-Categoria',
            'Gestion-Anuncios',
            'Gestion-Ventas',
        ]
        for p in permisos:
            obj, created = Permiso.objects.get_or_create(nombre=p)
            if created:
                self.stdout.write(f'Permiso creado: {obj.nombre}')
