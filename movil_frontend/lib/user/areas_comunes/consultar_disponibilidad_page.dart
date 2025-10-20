import 'package:flutter/material.dart';
import '../../models/area_comun.dart';
import '../../repositories/area_comun_repository.dart';

class ConsultarDisponibilidadPage extends StatefulWidget {
  const ConsultarDisponibilidadPage({super.key});

  @override
  State<ConsultarDisponibilidadPage> createState() => _ConsultarDisponibilidadPageState();
}

class _ConsultarDisponibilidadPageState extends State<ConsultarDisponibilidadPage> {
  final AreaComunRepository _repo = AreaComunRepository();

  late Future<List<AreaComun>> _futureAreas;

  @override
  void initState() {
    super.initState();
    _futureAreas = _repo.getAreas();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Áreas Comunes Disponibles")),
      body: FutureBuilder<List<AreaComun>>(
        future: _futureAreas,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text("Error: ${snapshot.error}"));
          }
          final areas = snapshot.data ?? [];
          if (areas.isEmpty) {
            return const Center(child: Text("No hay áreas registradas"));
          }
          return ListView.builder(
            padding: const EdgeInsets.all(8),
            itemCount: areas.length,
            itemBuilder: (context, i) {
              final area = areas[i];
              return Card(
                child: ListTile(
                  title: Text(area.nombre),
                  subtitle: Text("${area.descripcion}\nHorario: ${area.horario}\nCosto: Bs ${area.costo}"),
                  trailing: const Icon(Icons.check_circle, color: Colors.green),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
