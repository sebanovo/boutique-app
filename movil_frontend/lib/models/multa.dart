class Multa {
  final String id;
  final String idUsuario;
  final String descripcion;
  final double monto;
  final DateTime fecha;
  final String estadoPago;
  final String metodoPago;

  Multa({
    required this.id,
    required this.idUsuario,
    required this.descripcion,
    required this.monto,
    required this.fecha,
    required this.estadoPago,
    required this.metodoPago,
  });

  factory Multa.fromJson(Map<String, dynamic> json) {
    return Multa(
      id: json['id'].toString(),
      idUsuario: json['id_usuario'].toString(),
      descripcion: json['descripcion'] ?? '',
      monto: (json['monto'] as num?)?.toDouble() ?? 0.0,
      fecha: DateTime.parse(json['fecha']),
      estadoPago: json['estado_pago'] ?? '',
      metodoPago: json['metodo_pago'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      "id_usuario": idUsuario,
      "descripcion": descripcion,
      "monto": monto,
      "fecha": fecha.toIso8601String(),
      "estado_pago": estadoPago,
      "metodo_pago": metodoPago,
    };
  }
}
