import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/constants/api_endpoints.dart';
import '../../../../core/errors/exceptions.dart';
import '../../../../core/network/api_client.dart';
import '../models/post_model.dart';

final postsRemoteDataSourceProvider = Provider<PostsRemoteDataSource>((ref) {
  final dio = ref.watch(apiClientProvider);
  return PostsRemoteDataSourceImpl(dio);
});

abstract class PostsRemoteDataSource {
  Future<List<PostModel>> getPosts({
    int? page,
    int? limit,
    String? type,
    String? category,
    String? search,
    String? neighborhood,
  });

  Future<PostModel> getPostById(String id);

  Future<PostModel> createPost(Map<String, dynamic> data);

  Future<void> deletePost(String id);
}

class PostsRemoteDataSourceImpl implements PostsRemoteDataSource {
  final Dio _dio;

  PostsRemoteDataSourceImpl(this._dio);

  @override
  Future<List<PostModel>> getPosts({
    int? page,
    int? limit,
    String? type,
    String? category,
    String? search,
    String? neighborhood,
  }) async {
    try {
      final queryParams = <String, dynamic>{};
      if (page != null) queryParams['page'] = page;
      if (limit != null) queryParams['limit'] = limit;
      if (type != null && type.isNotEmpty && type != 'ALL') {
        queryParams['type'] = type;
      }
      if (category != null && category.isNotEmpty && category != 'ALL') {
        queryParams['category'] = category;
      }
      if (search != null && search.trim().isNotEmpty) {
        queryParams['search'] = search.trim();
      }
      if (neighborhood != null && neighborhood.isNotEmpty) {
        queryParams['neighborhood'] = neighborhood;
      }

      final response = await _dio.get(
        ApiEndpoints.posts,
        queryParameters: queryParams.isNotEmpty ? queryParams : null,
      );

      final data = response.data;
      if (data is List) {
        return data
            .map((item) => PostModel.fromJson(item as Map<String, dynamic>))
            .toList();
      }
      return [];
    } on DioException catch (e) {
      _handleDioError(e);
    } catch (e) {
      throw ServerException(message: 'تعذر جلب المنشورات: $e');
    }
  }

  @override
  Future<PostModel> getPostById(String id) async {
    try {
      final response = await _dio.get(ApiEndpoints.postDetail(id));
      final data = response.data as Map<String, dynamic>;
      return PostModel.fromJson(data);
    } on DioException catch (e) {
      _handleDioError(e);
    } catch (e) {
      throw ServerException(message: 'تعذر جلب تفاصيل المنشور: $e');
    }
  }

  @override
  Future<PostModel> createPost(Map<String, dynamic> data) async {
    try {
      final response = await _dio.post(
        ApiEndpoints.posts,
        data: data,
      );
      final responseData = response.data as Map<String, dynamic>;
      return PostModel.fromJson(responseData);
    } on DioException catch (e) {
      _handleDioError(e);
    } catch (e) {
      throw ServerException(message: 'تعذر نشر الطلب: $e');
    }
  }

  @override
  Future<void> deletePost(String id) async {
    try {
      await _dio.delete(ApiEndpoints.postDetail(id));
    } on DioException catch (e) {
      _handleDioError(e);
    } catch (e) {
      throw ServerException(message: 'تعذر حذف المنشور: $e');
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
