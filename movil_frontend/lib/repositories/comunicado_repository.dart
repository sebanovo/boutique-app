import '../api_client.dart';
import '../api_endpoints.dart';
import '../models/comunicado.dart';

class ComunicadoRepository {
  final ApiClient _api = ApiClient();

  Future<List<Comunicado>> getComunicados() async {
    // Ajusta la ruta al endpoint real de tu backend
    final response = await _api.get("${ApiConfig.baseUrl}/comunicados/");
    final data = response.data as List;
    return data.map((json) => Comunicado.fromJson(json)).toList();
  }
}
