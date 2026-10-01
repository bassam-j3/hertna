import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/errors/exceptions.dart';
import '../../../../core/errors/failures.dart';
import '../../../../core/storage/secure_storage_service.dart';
import '../../domain/entities/user.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/auth_remote_data_source.dart';
import '../models/login_request.dart';
import '../models/register_request.dart';
import '../models/user_model.dart';

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  final remoteDataSource = ref.watch(authRemoteDataSourceProvider);
  final storageService = ref.watch(secureStorageServiceProvider);
  return AuthRepositoryImpl(remoteDataSource, storageService);
});

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource _remoteDataSource;
  final SecureStorageService _storageService;

  AuthRepositoryImpl(this._remoteDataSource, this._storageService);

  @override
  Future<User> login({
    required String phone,
    required String password,
  }) async {
    try {
      final result = await _remoteDataSource.login(
        LoginRequest(phone: phone, password: password),
      );

      // Persist token and user in secure storage
      await _storageService.saveToken(result.token);
      await _storageService.saveUserRaw(jsonEncode(result.user.toJson()));

      return result.user;
    } on UnauthorizedException catch (e) {
      throw AuthFailure(e.message);
    } on NetworkException catch (e) {
      throw NetworkFailure(e.message);
    } on ServerException catch (e) {
      throw ServerFailure(e.message, statusCode: e.statusCode);
    } catch (e) {
      throw ServerFailure(e.toString());
    }
  }

  @override
  Future<User> register({
    required String name,
    required String phone,
    required String password,
    required String city,
    required String neighborhood,
    String? userType,
  }) async {
    try {
      final result = await _remoteDataSource.register(
        RegisterRequest(
          name: name,
          phone: phone,
          password: password,
          city: city,
          neighborhood: neighborhood,
          userType: userType,
        ),
      );

      await _storageService.saveToken(result.token);
      await _storageService.saveUserRaw(jsonEncode(result.user.toJson()));

      return result.user;
    } on NetworkException catch (e) {
      throw NetworkFailure(e.message);
    } on ServerException catch (e) {
      throw ServerFailure(e.message, statusCode: e.statusCode);
    } catch (e) {
      throw ServerFailure(e.toString());
    }
  }

  @override
  Future<User?> getCurrentUser() async {
    try {
      final token = await _storageService.getToken();
      if (token == null || token.isEmpty) {
        return null;
      }

      // Check remote session and refresh user profile
      final user = await _remoteDataSource.getProfile();
      await _storageService.saveUserRaw(jsonEncode(user.toJson()));
      return user;
    } on UnauthorizedException {
      await _storageService.clearAuthData();
      return null;
    } catch (_) {
      // Fallback: try reading locally cached user if offline
      final cachedRaw = await _storageService.getUserRaw();
      if (cachedRaw != null) {
        try {
          return UserModel.fromJson(jsonDecode(cachedRaw) as Map<String, dynamic>);
        } catch (_) {}
      }
      return null;
    }
  }

  @override
  Future<void> logout() async {
    await _storageService.clearAuthData();
  }
}
