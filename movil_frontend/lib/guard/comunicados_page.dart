//si 
import 'package:flutter/material.dart';
import '../models/comunicado.dart';
import '../repositories/comunicado_repository.dart';

class ComunicadosPage extends StatefulWidget {
  const ComunicadosPage({super.key});

  @override
  State<ComunicadosPage> createState() => _ComunicadosPageState();
}

class _ComunicadosPageState extends State<ComunicadosPage> {
  final ComunicadoRepository _repo = ComunicadoRepository();
  late Future<List<Comunicado>> _futureComunicados;

  @override
  void initState() {
    super.initState();
    _futureComunicados = _repo.getComunicados();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Comunicados")),
      body: FutureBuilder<List<Comunicado>>(
        future: _futureComunicados,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text("Error: ${snapshot.error}"));
          }
          final comunicados = snapshot.data ?? [];
          if (comunicados.isEmpty) {
            return const Center(child: Text("No hay comunicados"));
          }
          return ListView.builder(
            itemCount: comunicados.length,
            itemBuilder: (context, i) {
              final c = comunicados[i];
              return Card(
                margin: const EdgeInsets.all(8),
                child: ListTile(
                  title: Text(c.titulo),
                  subtitle: Text(
                    "${c.cuerpo.substring(0, c.cuerpo.length > 60 ? 60 : c.cuerpo.length)}...",
                  ),
                  trailing: Text(
                    "${c.publicadoAt.toLocal().toString().split(" ")[0]}",
                    style: const TextStyle(fontSize: 12, color: Colors.grey),
                  ),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => ComunicadoDetailPage(comunicado: c),
                      ),
                    );
                  },
                ),
              );
            },
          );
        },
      ),
    );
  }
}

class ComunicadoDetailPage extends StatelessWidget {
  final Comunicado comunicado;
  const ComunicadoDetailPage({super.key, required this.comunicado});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(comunicado.titulo)),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              comunicado.titulo,
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              "Publicado: ${comunicado.publicadoAt.toLocal().toString().split(" ")[0]}",
              style: const TextStyle(color: Colors.grey),
            ),
            const Divider(),
            Expanded(
              child: SingleChildScrollView(
                child: Text(
                  comunicado.cuerpo,
                  style: const TextStyle(fontSize: 16),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
