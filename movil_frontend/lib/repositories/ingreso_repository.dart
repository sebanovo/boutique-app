import '../api_client.dart';
import '../api_endpoints.dart';

class IngresoRepository {
  final ApiClient _api = ApiClient();

  Future<void> registrarIngreso(Map<String, dynamic> data) async {
    await _api.post("${ApiConfig.baseUrl}/extranjero/", data: data);
  }

  Future<List<dynamic>> listarIngresos() async {
    final response = await _api.get("${ApiConfig.baseUrl}/extranjero/");
    return response.data as List;
  }
}
