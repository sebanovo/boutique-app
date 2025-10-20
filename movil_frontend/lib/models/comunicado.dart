class Comunicado {
  final String id;
  final String titulo;
  final String cuerpo;
  final DateTime publicadoAt;

  Comunicado({
    required this.id,
    required this.titulo,
    required this.cuerpo,
    required this.publicadoAt,
  });

  factory Comunicado.fromJson(Map<String, dynamic> json) {
    return Comunicado(
      id: json['id'].toString(),
      titulo: json['titulo'] ?? '',
      cuerpo: json['cuerpo'] ?? '',
      publicadoAt: DateTime.parse(json['publicado_at']),
    );
  }
}
