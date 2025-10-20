// lib/api_client.dart

import 'package:dio/dio.dart';
import 'api_endpoints.dart';

class ApiClient {
  final Dio _dio = Dio(
    BaseOptions(
      baseUrl: ApiConfig.baseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      headers: {
        "Content-Type": "application/json",
      },
    ),
  );

  // Método GET genérico
  Future<Response> get(String url, {Map<String, dynamic>? queryParameters}) async {
    try {
      return await _dio.get(url, queryParameters: queryParameters);
    } on DioException catch (e) {
      throw Exception(_handleError(e));
    }
  }

  // Método POST genérico
  Future<Response> post(String url, {Map<String, dynamic>? data}) async {
    try {
      return await _dio.post(url, data: data);
    } on DioException catch (e) {
      throw Exception(_handleError(e));
    }
  }

  // Método PUT genérico
  Future<Response> put(String url, {Map<String, dynamic>? data}) async {
    try {
      return await _dio.put(url, data: data);
    } on DioException catch (e) {
      throw Exception(_handleError(e));
    }
  }

  // Método DELETE genérico
  Future<Response> delete(String url) async {
    try {
      return await _dio.delete(url);
    } on DioException catch (e) {
      throw Exception(_handleError(e));
    }
  }

  // Manejo básico de errores
  String _handleError(DioException error) {
    if (error.response != null) {
      return "Error ${error.response?.statusCode}: ${error.response?.data}";
    } else {
      return "Error de conexión: ${error.message}";
    }
  }
}
