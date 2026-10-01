import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/constants/api_endpoints.dart';
import '../../../../core/errors/exceptions.dart';
import '../../../../core/network/api_client.dart';
import '../../../auth/data/models/user_model.dart';

final profileRemoteDataSourceProvider = Provider<ProfileRemoteDataSource>((ref) {
  final dio = ref.watch(apiClientProvider);
  return ProfileRemoteDataSourceImpl(dio);
});

abstract class ProfileRemoteDataSource {
  Future<UserModel> getProfile();
  Future<UserModel> updateProfile(Map<String, dynamic> data);
  Future<String> uploadAvatar(List<int> bytes, String filename);
}

class ProfileRemoteDataSourceImpl implements ProfileRemoteDataSource {
  final Dio _dio;

  ProfileRemoteDataSourceImpl(this._dio);

  @override
  Future<UserModel> getProfile() async {
    try {
      final response = await _dio.get(ApiEndpoints.profile);
      final data = response.data as Map<String, dynamic>;
      return UserModel.fromJson(data);
    } on DioException catch (e) {
      _handleDioError(e);
    } catch (e) {
      throw ServerException(message: 'تعذر جلب الملف الشخصي: $e');
    }
  }

  @override
  Future<UserModel> updateProfile(Map<String, dynamic> data) async {
    try {
      final response = await _dio.patch(
        ApiEndpoints.updateProfile,
        data: data,
      );
      final responseData = response.data as Map<String, dynamic>;
      return UserModel.fromJson(responseData);
    } on DioException catch (e) {
      _handleDioError(e);
    } catch (e) {
      throw ServerException(message: 'تعذر تحديث الملف الشخصي: $e');
    }
  }

  @override
  Future<String> uploadAvatar(List<int> bytes, String filename) async {
    try {
      final formData = FormData.fromMap({
        'avatar': MultipartFile.fromBytes(
          bytes,
          filename: filename,
        ),
      });

      final response = await _dio.post(
        ApiEndpoints.uploadAvatar,
        data: formData,
      );

      final data = response.data as Map<String, dynamic>;
      return data['avatarUrl'] as String? ?? '';
    } on DioException catch (e) {
      _handleDioError(e);
    } catch (e) {
      throw ServerException(message: 'تعذر رفع الصورة الشخصية: $e');
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

    String errorMessage = 'حدث خطأ في الاتصال ($statusCode)';

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
