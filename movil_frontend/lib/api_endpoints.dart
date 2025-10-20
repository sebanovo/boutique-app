// lib/api_endpoints.dart

class ApiConfig {
  // URL base del backend
  static const String baseUrl = "http://localhost:8000";

  // --- Autenticación ---
  static const String signup = "$baseUrl/signup/";
  static const String login = "$baseUrl/login/";
  static const String logout = "$baseUrl/logout/";
  static const String user = "$baseUrl/user/";
  static const String validateSession = "$baseUrl/validate-session/";

  // --- Admin / Personal ---
  static const String casa = "$baseUrl/casa/";
  static const String asignarCasa = "$baseUrl/asignar-casa/";
  static const String multa = "$baseUrl/multa/";
  static const String ingresoSalida = "$baseUrl/ingreso-salida/";
  static const String vehiculo = "$baseUrl/vehiculo/";
  static const String reserva = "$baseUrl/reserva/";
  static const String areaComun = "$baseUrl/area-comun/";
  static const String extranjero = "$baseUrl/extranjero/";

  // --- Residente ---
  static const String casas = "$baseUrl/casas/";
  static const String multas = "$baseUrl/multas/";
  static const String vehiculos = "$baseUrl/vehiculos/";
  static const String reservas = "$baseUrl/reservas/";
  static const String areasComunes = "$baseUrl/areas-comunes/";

  // --- Listados generales ---
  static const String usuarios = "$baseUrl/usuarios/";
  static const String residentes = "$baseUrl/residentes/";
}
