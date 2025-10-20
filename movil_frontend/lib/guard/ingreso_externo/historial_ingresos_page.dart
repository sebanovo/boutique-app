import 'package:flutter/material.dart';
import '../../repositories/ingreso_repository.dart';

class HistorialIngresosPage extends StatefulWidget {
  const HistorialIngresosPage({super.key});

  @override
  State<HistorialIngresosPage> createState() => _HistorialIngresosPageState();
}

class _HistorialIngresosPageState extends State<HistorialIngresosPage> {
  final IngresoRepository _repo = IngresoRepository();
  late Future<List<dynamic>> _futureIngresos;

  @override
  void initState() {
    super.initState();
    _futureIngresos = _repo.listarIngresos();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Historial de Ingresos")),
      body: FutureBuilder<List<dynamic>>(
        future: _futureIngresos,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text("Error: ${snapshot.error}"));
          }
          final ingresos = snapshot.data ?? [];
          if (ingresos.isEmpty) {
            return const Center(child: Text("No hay ingresos registrados"));
          }
          return ListView.builder(
            itemCount: ingresos.length,
            itemBuilder: (context, i) {
              final ing = ingresos[i];
              return Card(
                margin: const EdgeInsets.all(8),
                child: ListTile(
                  title: Text(ing['nombre'] ?? "Desconocido"),
                  subtitle: Text(
                    "Motivo: ${ing['motivo'] ?? '---'}\nCasa: ${ing['casa_destino'] ?? '---'}",
                  ),
                  trailing: Text(ing['tipo_doc'] ?? "CI"),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
