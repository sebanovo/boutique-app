//si 
import 'package:flutter/material.dart';
import '../models/multa.dart';
import '../repositories/multa_repository.dart';

class DeudasPage extends StatefulWidget {
  const DeudasPage({super.key});

  @override
  State<DeudasPage> createState() => _DeudasPageState();
}

class _DeudasPageState extends State<DeudasPage> {
  final MultaRepository _repo = MultaRepository();
  late Future<List<Multa>> _futureMultas;

  @override
  void initState() {
    super.initState();
    _futureMultas = _repo.getMultas();
  }

  void _pagarMulta(Multa multa) async {
    try {
      await _repo.pagarMulta(multa.id, "QR"); // dejamos fijo por ahora
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Pago realizado para multa: ${multa.descripcion}")),
        );
        setState(() {
          _futureMultas = _repo.getMultas();
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Error: $e")),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Mis Deudas")),
      body: FutureBuilder<List<Multa>>(
        future: _futureMultas,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text("Error: ${snapshot.error}"));
          }
          final multas = snapshot.data ?? [];
          if (multas.isEmpty) {
            return const Center(child: Text("No tienes multas registradas"));
          }
          return ListView.builder(
            itemCount: multas.length,
            itemBuilder: (context, i) {
              final m = multas[i];
              final isPendiente = m.estadoPago == "pendiente";
              return Card(
                margin: const EdgeInsets.all(8),
                child: ListTile(
                  title: Text(m.descripcion),
                  subtitle: Text(
                      "Monto: Bs ${m.monto}\nFecha: ${m.fecha.toLocal().toString().split(" ")[0]}\nEstado: ${m.estadoPago}"),
                  trailing: isPendiente
                      ? ElevatedButton(
                          onPressed: () => _pagarMulta(m),
                          child: const Text("Pagar"),
                        )
                      : const Icon(Icons.check_circle, color: Colors.green),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
