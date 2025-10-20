import 'package:flutter/material.dart';
import '../../models/reserva.dart';
import '../../repositories/reserva_repository.dart';

class CancelarReservaPage extends StatefulWidget {
  const CancelarReservaPage({super.key});

  @override
  State<CancelarReservaPage> createState() => _CancelarReservaPageState();
}

class _CancelarReservaPageState extends State<CancelarReservaPage> {
  final ReservaRepository _repo = ReservaRepository();
  late Future<List<Reserva>> _futureReservas;

  @override
  void initState() {
    super.initState();
    _futureReservas = _repo.getReservas();
  }

  void _cancelar(String id) async {
    try {
      await _repo.cancelarReserva(id);
      setState(() {
        _futureReservas = _repo.getReservas();
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Reserva cancelada")),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Error: $e")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Cancelar Reserva")),
      body: FutureBuilder<List<Reserva>>(
        future: _futureReservas,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text("Error: ${snapshot.error}"));
          }
          final reservas = snapshot.data ?? [];
          if (reservas.isEmpty) {
            return const Center(child: Text("No tienes reservas"));
          }
          return ListView.builder(
            itemCount: reservas.length,
            itemBuilder: (context, i) {
              final r = reservas[i];
              return Card(
                child: ListTile(
                  title: Text("Área ${r.idArea}"),
                  subtitle: Text("Fecha: ${r.fecha.toString()}"),
                  trailing: IconButton(
                    icon: const Icon(Icons.cancel, color: Colors.red),
                    onPressed: () => _cancelar(r.id),
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
