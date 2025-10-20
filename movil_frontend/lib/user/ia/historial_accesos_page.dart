import 'package:flutter/material.dart';
import '../../api_client.dart';
import '../../api_endpoints.dart';

class HistorialAccesosPage extends StatefulWidget {
  const HistorialAccesosPage({super.key});

  @override
  State<HistorialAccesosPage> createState() => _HistorialAccesosPageState();
}

class _HistorialAccesosPageState extends State<HistorialAccesosPage> {
  final _api = ApiClient();
  late Future<List<dynamic>> _futureAccesos;

  @override
  void initState() {
    super.initState();
    _futureAccesos = _loadAccesos();
  }

  Future<List<dynamic>> _loadAccesos() async {
    final response = await _api.get(ApiConfig.ingresoSalida);
    return response.data as List;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Historial de Accesos")),
      body: FutureBuilder<List<dynamic>>(
        future: _futureAccesos,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text("Error: ${snapshot.error}"));
          }
          final accesos = snapshot.data ?? [];
          if (accesos.isEmpty) {
            return const Center(child: Text("No hay accesos registrados"));
          }
          return ListView.builder(
            itemCount: accesos.length,
            itemBuilder: (context, i) {
              final a = accesos[i];
              final estado = a['autorizado'] == true ? "Autorizado" : "Rechazado";
              return Card(
                child: ListTile(
                  title: Text("Método: ${a['metodo']}"),
                  subtitle: Text("Fecha: ${a['fecha']}"),
                  trailing: Text(
                    estado,
                    style: TextStyle(
                      color: a['autorizado'] == true ? Colors.green : Colors.red,
                    ),
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
