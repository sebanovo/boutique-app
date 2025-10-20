import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

// Auth
import 'auth/login_page.dart';

// User (Residente)
import 'user/home_user.dart';
import 'user/areas_comunes/consultar_disponibilidad_page.dart';
import 'user/areas_comunes/reservar_area_page.dart';
import 'user/areas_comunes/cancelar_reserva_page.dart';
import 'user/ia/reconocimiento_facial_page.dart';
import 'user/ia/reconocimiento_placa_page.dart';
import 'user/ia/historial_accesos_page.dart';
import 'user/comunicados_page.dart';
import 'user/deudas_page.dart';

// Guard (Personal)
import 'guard/home_guard.dart';
import 'guard/ingreso_externo/nuevo_ingreso_page.dart';
import 'guard/ingreso_externo/historial_ingresos_page.dart';

final GoRouter appRouter = GoRouter(
  routes: [
    // Login
    GoRoute(
      path: '/',
      builder: (context, state) => const LoginPage(),
    ),

    // Perfil Residente
    GoRoute(
      path: '/user',
      builder: (context, state) => const HomeUser(),
      routes: [
        GoRoute(
          path: 'areas/consultar',
          builder: (context, state) => const ConsultarDisponibilidadPage(),
        ),
        GoRoute(
          path: 'areas/reservar',
          builder: (context, state) => const ReservarAreaPage(),
        ),
        GoRoute(
          path: 'areas/cancelar',
          builder: (context, state) => const CancelarReservaPage(),
        ),
        GoRoute(
          path: 'ia/facial',
          builder: (context, state) => const ReconocimientoFacialPage(),
        ),
        GoRoute(
          path: 'ia/placa',
          builder: (context, state) => const ReconocimientoPlacaPage(),
        ),
        GoRoute(
          path: 'ia/historial',
          builder: (context, state) => const HistorialAccesosPage(),
        ),
        GoRoute(
          path: 'comunicados',
          builder: (context, state) => const ComunicadosPage(),
        ),
        GoRoute(
          path: 'deudas',
          builder: (context, state) => const DeudasPage(),
        ),
      ],
    ),

    // Perfil Guardia (Personal)
    GoRoute(
      path: '/guard',
      builder: (context, state) => const HomeGuard(),
      routes: [
        GoRoute(
          path: 'ia/facial',
          builder: (context, state) => const ReconocimientoFacialPage(),
        ),
        GoRoute(
          path: 'ia/placa',
          builder: (context, state) => const ReconocimientoPlacaPage(),
        ),
        GoRoute(
          path: 'ia/historial',
          builder: (context, state) => const HistorialAccesosPage(),
        ),
        GoRoute(
          path: 'comunicados',
          builder: (context, state) => const ComunicadosPage(),
        ),
        GoRoute(
          path: 'ingreso/nuevo',
          builder: (context, state) => const NuevoIngresoPage(),
        ),
        GoRoute(
          path: 'ingreso/historial',
          builder: (context, state) => const HistorialIngresosPage(),
        ),
      ],
    ),
  ],
);
