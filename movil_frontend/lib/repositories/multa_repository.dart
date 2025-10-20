import '../api_client.dart';
import '../api_endpoints.dart';
import '../models/multa.dart';

class MultaRepository {
  final ApiClient _api = ApiClient();

  Future<List<Multa>> getMultas() async {
    final response = await _api.get(ApiConfig.multas);
    final data = response.data as List;
    return data.map((json) => Multa.fromJson(json)).toList();
  }

  // Simular pago hasta que tengamos API real
  Future<void> pagarMulta(String idMulta, String metodoPago) async {
    // cuando haya API real, aquí llamaremos un POST o PUT
    await Future.delayed(const Duration(seconds: 1));
    return;
  }
}
