import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/constants/api_endpoints.dart';
import '../../../../core/errors/exceptions.dart';
import '../../../../core/network/api_client.dart';
import '../models/user_profile_model.dart';

final profileRemoteDataSourceProvider = Provider<ProfileRemoteDataSource>((ref) {
  final dio = ref.watch(apiClientProvider);
  return ProfileRemoteDataSourceImpl(dio);
});

abstract class ProfileRemoteDataSource {
  Future<UserProfileModel> getProfile();
  Future<UserProfileModel> updateProfile(Map<String, dynamic> data);
  Future<String> uploadAvatar(String filePath);
}

class ProfileRemoteDataSourceImpl implements ProfileRemoteDataSource {
  final Dio _dio;

  ProfileRemoteDataSourceImpl(this._dio);

  @override
  Future<UserProfileModel> getProfile() async {
    try {
      final response = await _dio.get(ApiEndpoints.profile);
      final data = response.data as Map<String, dynamic>;
      return UserProfileModel.fromJson(data);
    } on DioException catch (e) {
      _handleDioError(e);
    } catch (e) {
      throw ServerException(message: 'تعذر جلب الملف الشخصي: $e');
    }
  }

  @override
  Future<UserProfileModel> updateProfile(Map<String, dynamic> data) async {
    try {
      final response = await _dio.patch(
        ApiEndpoints.updateProfile,
        data: data,
      );
      final responseData = response.data as Map<String, dynamic>;
      return UserProfileModel.fromJson(responseData);
    } on DioException catch (e) {
      _handleDioError(e);
    } catch (e) {
      throw ServerException(message: 'تعذر تحديث البيانات: $e');
    }
  }

  @override
  Future<String> uploadAvatar(String filePath) async {
    try {
      final fileName = filePath.split(RegExp(r'[/\\]')).last;
      final formData = FormData.fromMap({
        'avatar': await MultipartFile.fromFile(filePath, filename: fileName),
      });

      final response = await _dio.post(
        ApiEndpoints.updateAvatar,
        data: formData,
      );

      final data = response.data as Map<String, dynamic>;
      return (data['avatarUrl'] ?? '') as String;
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
