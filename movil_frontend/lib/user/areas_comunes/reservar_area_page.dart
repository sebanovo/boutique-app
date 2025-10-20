import 'package:flutter/material.dart';
import '../../models/reserva.dart';
import '../../repositories/reserva_repository.dart';

class ReservarAreaPage extends StatefulWidget {
  const ReservarAreaPage({super.key});

  @override
  State<ReservarAreaPage> createState() => _ReservarAreaPageState();
}

class _ReservarAreaPageState extends State<ReservarAreaPage> {
  final ReservaRepository _repo = ReservaRepository();
  String? _selectedArea;
  DateTime? _selectedDate;

  final _formKey = GlobalKey<FormState>();

  void _submit() async {
    if (_formKey.currentState?.validate() != true || _selectedDate == null) return;

    final reserva = Reserva(
      id: "",
      idUsuario: "1", // TODO: reemplazar por usuario autenticado
      idArea: _selectedArea!,
      fecha: _selectedDate!,
      estadoPago: "pendiente",
      metodoPago: "efectivo",
    );

    try {
      await _repo.crearReserva(reserva);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Reserva creada")),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Error: $e")),
        );
      }
    }
  }

  Future<void> _pickDate() async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      firstDate: now,
      lastDate: now.add(const Duration(days: 365)),
      initialDate: now,
    );
    if (picked != null) {
      setState(() {
        _selectedDate = picked;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Reservar Área")),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              DropdownButtonFormField<String>(
                items: const [
                  DropdownMenuItem(value: "1", child: Text("Piscina")),
                  DropdownMenuItem(value: "2", child: Text("Salón de eventos")),
                ],
                onChanged: (value) => setState(() => _selectedArea = value),
                validator: (value) => value == null ? "Selecciona un área" : null,
                decoration: const InputDecoration(labelText: "Área común"),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: _pickDate,
                child: Text(_selectedDate == null
                    ? "Selecciona fecha"
                    : _selectedDate.toString().split(" ")[0]),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _submit,
                child: const Text("Crear reserva"),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
