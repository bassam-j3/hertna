import '../entities/user.dart';

abstract class AuthRepository {
  Future<User> login({
    required String phone,
    required String password,
  });

  Future<User> register({
    required String name,
    required String phone,
    required String password,
    required String city,
    required String neighborhood,
    String? userType,
  });

  Future<User?> getCurrentUser();

  Future<void> logout();
}
