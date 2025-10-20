class AreaComun {
  final String id;
  final String nombre;
  final String descripcion;
  final String horario;
  final double costo;

  AreaComun({
    required this.id,
    required this.nombre,
    required this.descripcion,
    required this.horario,
    required this.costo,
  });

  factory AreaComun.fromJson(Map<String, dynamic> json) {
    return AreaComun(
      id: json['id'].toString(),
      nombre: json['nombre'] ?? '',
      descripcion: json['descripcion'] ?? '',
      horario: json['horario'] ?? '',
      costo: (json['costo'] as num?)?.toDouble() ?? 0.0,
    );
  }
}
