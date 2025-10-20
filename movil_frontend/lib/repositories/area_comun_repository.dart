import '../api_client.dart';
import '../api_endpoints.dart';
import '../models/area_comun.dart';

class AreaComunRepository {
  final ApiClient _api = ApiClient();

  Future<List<AreaComun>> getAreas() async {
    final response = await _api.get(ApiConfig.areasComunes);
    final data = response.data as List;
    return data.map((json) => AreaComun.fromJson(json)).toList();
  }
}
