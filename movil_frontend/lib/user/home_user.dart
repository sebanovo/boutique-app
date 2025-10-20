import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import '../../api_client.dart';

class HomeUser extends StatelessWidget {
  const HomeUser({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Bienvenido Residente"),
        leading: Builder(
          builder: (context) => IconButton(
            icon: const Icon(Icons.menu),
            onPressed: () => Scaffold.of(context).openDrawer(),
          ),
        ),
      ),
      drawer: const _AppDrawer(),
      body: const Center(
        child: Text(
          "Selecciona una opción en el menú",
          style: TextStyle(fontSize: 18),
        ),
      ),
    );
  }
}

class _AppDrawer extends StatelessWidget {
  const _AppDrawer();

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        children: [
          const DrawerHeader(
            decoration: BoxDecoration(color: Colors.blue),
            child: Text(
              "Menú Principal",
              style: TextStyle(color: Colors.white, fontSize: 20),
            ),
          ),

          // Áreas comunes
          ExpansionTile(
            leading: const Icon(Icons.meeting_room),
            title: const Text("Áreas comunes"),
            children: [
              ListTile(
                title: const Text("Consultar disponibilidad"),
                onTap: () => context.go('/user/areas/consultar'),
              ),
              ListTile(
                title: const Text("Reservar área"),
                onTap: () => context.go('/user/areas/reservar'),
              ),
              ListTile(
                title: const Text("Cancelar reserva"),
                onTap: () => context.go('/user/areas/cancelar'),
              ),
            ],
          ),

          // IA
          ExpansionTile(
            leading: const Icon(Icons.smart_toy),
            title: const Text("IA"),
            children: [
              ListTile(
                title: const Text("Reconocimiento facial"),
                onTap: () => context.go('/user/ia/facial'),
              ),
              ListTile(
                title: const Text("Reconocimiento de placa"),
                onTap: () => context.go('/user/ia/placa'),
              ),
              ListTile(
                title: const Text("Historial de accesos"),
                onTap: () => context.go('/user/ia/historial'),
              ),
            ],
          ),

          // Comunicados
          ExpansionTile(
            leading: const Icon(Icons.campaign),
            title: const Text("Comunicados"),
            children: [
              ListTile(
                title: const Text("Ver comunicados"),
                onTap: () => context.go('/user/comunicados'),
              ),
            ],
          ),

          // Deudas / multas
          ExpansionTile(
            leading: const Icon(Icons.attach_money),
            title: const Text("Deudas"),
            children: [
              ListTile(
                title: const Text("Ver deudas"),
                onTap: () => context.go('/user/deudas'),
              ),
            ],
          ),

          // Cerrar sesión
          ListTile(
            leading: const Icon(Icons.logout),
            title: const Text("Cerrar sesión"),
            onTap: () {
              context.go('/'); // vuelve al login
            },
          ),
        ],
      ),
    );
  }
}
