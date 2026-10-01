import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/constants/api_endpoints.dart';
import '../../../../core/errors/exceptions.dart';
import '../../../../core/network/api_client.dart';
import '../models/swap_model.dart';

final swapsRemoteDataSourceProvider = Provider<SwapsRemoteDataSource>((ref) {
  final dio = ref.watch(apiClientProvider);
  return SwapsRemoteDataSourceImpl(dio);
});

abstract class SwapsRemoteDataSource {
  Future<({List<SwapModel> requests, List<SwapModel> offers})> getMySwaps();
  Future<void> updateSwapStatus(String id, String status);
  Future<void> createSwap(Map<String, dynamic> data);
}

class SwapsRemoteDataSourceImpl implements SwapsRemoteDataSource {
  final Dio _dio;

  SwapsRemoteDataSourceImpl(this._dio);

  @override
  Future<({List<SwapModel> requests, List<SwapModel> offers})> getMySwaps() async {
    try {
      final response = await _dio.get(ApiEndpoints.mySwaps);
      final data = response.data as Map<String, dynamic>;

      final rawBorrower = data['asBorrower'] as List? ?? [];
      final rawLender = data['asLender'] as List? ?? [];

      final requests = rawBorrower
          .map((item) => SwapModel.fromJson(item as Map<String, dynamic>, isLender: false))
          .toList();

      final offers = rawLender
          .map((item) => SwapModel.fromJson(item as Map<String, dynamic>, isLender: true))
          .toList();

      return (requests: requests, offers: offers);
    } on DioException catch (e) {
      _handleDioError(e);
    } catch (e) {
      throw ServerException(message: 'تعذر جلب طلبات المبادلة: $e');
    }
  }

  @override
  Future<void> updateSwapStatus(String id, String status) async {
    try {
      await _dio.patch(
        ApiEndpoints.swapStatus(id),
        data: {'status': status},
      );
    } on DioException catch (e) {
      _handleDioError(e);
    } catch (e) {
      throw ServerException(message: 'تعذر تحديث حالة المبادلة: $e');
    }
  }

  @override
  Future<void> createSwap(Map<String, dynamic> data) async {
    try {
      await _dio.post(
        ApiEndpoints.swaps,
        data: data,
      );
    } on DioException catch (e) {
      _handleDioError(e);
    } catch (e) {
      throw ServerException(message: 'تعذر إنشاء طلب المبادلة: $e');
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
