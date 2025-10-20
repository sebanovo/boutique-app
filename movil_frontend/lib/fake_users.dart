class FakeUsers {
  static const Map<String, String> users = {
    "usuario@gmail.com": "user",   // perfil residente
    "personal@gmail.com": "guard", // perfil personal/guardia
  };

  static const String defaultPassword = "123456";

  static String? getRole(String email, String password) {
    if (password != defaultPassword) return null;
    return users[email];
  }
}
