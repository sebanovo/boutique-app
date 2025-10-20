import 'package:flutter/material.dart';
import '../../repositories/ingreso_repository.dart';

class NuevoIngresoPage extends StatefulWidget {
  const NuevoIngresoPage({super.key});

  @override
  State<NuevoIngresoPage> createState() => _NuevoIngresoPageState();
}

class _NuevoIngresoPageState extends State<NuevoIngresoPage> {
  final _formKey = GlobalKey<FormState>();
  final _nombreController = TextEditingController();
  final _docController = TextEditingController();
  final _motivoController = TextEditingController();
  final _casaController = TextEditingController();

  String _tipoDocumento = "CI";
  bool _loading = false;

  final IngresoRepository _repo = IngresoRepository();

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    final data = {
      "nombre": _nombreController.text,
      "tipo_doc": _tipoDocumento,
      "documento": _docController.text,
      "motivo": _motivoController.text,
      "casa_destino": _casaController.text,
    };

    setState(() => _loading = true);

    try {
      await _repo.registrarIngreso(data);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Ingreso registrado correctamente")),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Error: $e")),
        );
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Nuevo Ingreso")),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              TextFormField(
                controller: _nombreController,
                decoration: const InputDecoration(labelText: "Nombre completo"),
                validator: (v) => v == null || v.isEmpty ? "Campo obligatorio" : null,
              ),
              const SizedBox(height: 12),
              DropdownButtonFormField<String>(
                value: _tipoDocumento,
                items: const [
                  DropdownMenuItem(value: "CI", child: Text("CI")),
                  DropdownMenuItem(value: "Pasaporte", child: Text("Pasaporte")),
                ],
                onChanged: (v) => setState(() => _tipoDocumento = v ?? "CI"),
                decoration: const InputDecoration(labelText: "Tipo de documento"),
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _docController,
                decoration: InputDecoration(labelText: "Número de $_tipoDocumento"),
                validator: (v) => v == null || v.isEmpty ? "Campo obligatorio" : null,
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _motivoController,
                decoration: const InputDecoration(labelText: "Motivo de entrada"),
                validator: (v) => v == null || v.isEmpty ? "Campo obligatorio" : null,
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _casaController,
                decoration: const InputDecoration(labelText: "Casa de destino"),
                validator: (v) => v == null || v.isEmpty ? "Campo obligatorio" : null,
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _loading ? null : _submit,
                child: _loading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text("Registrar ingreso"),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
