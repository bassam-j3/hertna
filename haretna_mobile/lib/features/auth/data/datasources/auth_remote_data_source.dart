import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/constants/api_endpoints.dart';
import '../../../../core/errors/exceptions.dart';
import '../../../../core/network/api_client.dart';
import '../models/login_request.dart';
import '../models/register_request.dart';
import '../models/user_model.dart';

final authRemoteDataSourceProvider = Provider<AuthRemoteDataSource>((ref) {
  final dio = ref.watch(apiClientProvider);
  return AuthRemoteDataSourceImpl(dio);
});

abstract class AuthRemoteDataSource {
  Future<({String token, UserModel user})> login(LoginRequest request);
  Future<({String token, UserModel user})> register(RegisterRequest request);
  Future<UserModel> getProfile();
}

class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final Dio _dio;

  AuthRemoteDataSourceImpl(this._dio);

  @override
  Future<({String token, UserModel user})> login(LoginRequest request) async {
    try {
      final response = await _dio.post(
        ApiEndpoints.login,
        data: request.toJson(),
      );

      final data = response.data as Map<String, dynamic>;
      final token = data['token'] as String;
      final user = UserModel.fromJson(data['user'] as Map<String, dynamic>);

      return (token: token, user: user);
    } on DioException catch (e) {
      _handleDioError(e);
    } catch (e) {
      throw ServerException(message: 'حدث خطأ غير متوقع: $e');
    }
  }

  @override
  Future<({String token, UserModel user})> register(RegisterRequest request) async {
    try {
      final response = await _dio.post(
        ApiEndpoints.register,
        data: request.toJson(),
      );

      final data = response.data as Map<String, dynamic>;
      final token = data['token'] as String;
      final user = UserModel.fromJson(data['user'] as Map<String, dynamic>);

      return (token: token, user: user);
    } on DioException catch (e) {
      _handleDioError(e);
    } catch (e) {
      throw ServerException(message: 'حدث خطأ أثناء إنشاء الحساب: $e');
    }
  }

  @override
  Future<UserModel> getProfile() async {
    try {
      final response = await _dio.get(ApiEndpoints.profile);
      final data = response.data as Map<String, dynamic>;
      return UserModel.fromJson(data);
    } on DioException catch (e) {
      _handleDioError(e);
    } catch (e) {
      throw ServerException(message: 'تعذر جلب بيانات الحساب: $e');
    }
  }

  Never _handleDioError(DioException e) {
    if (e.type == DioExceptionType.connectionTimeout ||
        e.type == DioExceptionType.receiveTimeout ||
        e.type == DioExceptionType.connectionError) {
      throw const NetworkException();
    }

    final statusCode = e.response?.statusCode;
    final responseData = e.response?.data;

    String errorMessage = 'حدث خطأ في الاتصال بالخادم ($statusCode)';

    if (responseData is Map<String, dynamic>) {
      final message = responseData['message'];
      if (message is String) {
        errorMessage = message;
      } else if (message is List && message.isNotEmpty) {
        errorMessage = message.join(', ');
      }
    }

    if (statusCode == 401) {
      throw UnauthorizedException(message: errorMessage);
    }

    throw ServerException(message: errorMessage, statusCode: statusCode);
  }
}
