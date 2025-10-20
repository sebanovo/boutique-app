import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class HomeGuard extends StatelessWidget {
  const HomeGuard({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Bienvenido Personal"),
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
              "Menú Personal",
              style: TextStyle(color: Colors.white, fontSize: 20),
            ),
          ),

          // Comunicados
          ExpansionTile(
            leading: const Icon(Icons.campaign),
            title: const Text("Comunicados"),
            children: [
              ListTile(
                title: const Text("Ver comunicados"),
                onTap: () => context.go('/guard/comunicados'),
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
                onTap: () => context.go('/guard/ia/facial'),
              ),
              ListTile(
                title: const Text("Reconocimiento de placa"),
                onTap: () => context.go('/guard/ia/placa'),
              ),
              ListTile(
                title: const Text("Historial de accesos"),
                onTap: () => context.go('/guard/ia/historial'),
              ),
            ],
          ),

          // Ingreso externo
          ExpansionTile(
            leading: const Icon(Icons.login),
            title: const Text("Ingreso externo"),
            children: [
              ListTile(
                title: const Text("Nuevo ingreso"),
                onTap: () => context.go('/guard/ingreso/nuevo'),
              ),
              ListTile(
                title: const Text("Historial de ingresos"),
                onTap: () => context.go('/guard/ingreso/historial'),
              ),
            ],
          ),

          // Cerrar sesión
          ListTile(
            leading: const Icon(Icons.logout),
            title: const Text("Cerrar sesión"),
            onTap: () {
              // Aquí podrías limpiar sesión en shared_preferences si corresponde
              context.go('/');
            },
          ),
        ],
      ),
    );
  }
}
