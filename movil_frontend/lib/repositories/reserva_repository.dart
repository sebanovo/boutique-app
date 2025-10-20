import '../api_client.dart';
import '../api_endpoints.dart';
import '../models/reserva.dart';

class ReservaRepository {
  final ApiClient _api = ApiClient();

  Future<List<Reserva>> getReservas() async {
    final response = await _api.get(ApiConfig.reservas);
    final data = response.data as List;
    return data.map((json) => Reserva.fromJson(json)).toList();
  }

  Future<void> crearReserva(Reserva reserva) async {
    await _api.post(ApiConfig.reserva, data: reserva.toJson());
  }

  Future<void> cancelarReserva(String idReserva) async {
    // Dependiendo del back, puede ser DELETE o POST update estado
    await _api.delete("${ApiConfig.reserva}$idReserva/");
  }
}
