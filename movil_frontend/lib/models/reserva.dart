class Reserva {
  final String id;
  final String idUsuario;
  final String idArea;
  final DateTime fecha;
  final String estadoPago;
  final String metodoPago;

  Reserva({
    required this.id,
    required this.idUsuario,
    required this.idArea,
    required this.fecha,
    required this.estadoPago,
    required this.metodoPago,
  });

  factory Reserva.fromJson(Map<String, dynamic> json) {
    return Reserva(
      id: json['id'].toString(),
      idUsuario: json['id_usuario'].toString(),
      idArea: json['id_area'].toString(),
      fecha: DateTime.parse(json['fecha']),
      estadoPago: json['estado_pago'] ?? '',
      metodoPago: json['metodo_pago'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      "id_usuario": idUsuario,
      "id_area": idArea,
      "fecha": fecha.toIso8601String(),
      "estado_pago": estadoPago,
      "metodo_pago": metodoPago,
    };
  }
}
