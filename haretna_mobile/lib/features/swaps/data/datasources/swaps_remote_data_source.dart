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
  Future<({List<SwapModel> asBorrower, List<SwapModel> asLender})> findMySwaps();
  Future<SwapModel> createSwap(Map<String, dynamic> data);
  Future<SwapModel> updateStatus(String swapId, String status);
}

class SwapsRemoteDataSourceImpl implements SwapsRemoteDataSource {
  final Dio _dio;

  SwapsRemoteDataSourceImpl(this._dio);

  @override
  Future<({List<SwapModel> asBorrower, List<SwapModel> asLender})> findMySwaps() async {
    try {
      final response = await _dio.get(ApiEndpoints.mySwaps);
      final data = response.data as Map<String, dynamic>;

      final rawBorrower = data['asBorrower'] as List? ?? [];
      final rawLender = data['asLender'] as List? ?? [];

      final asBorrower = rawBorrower
          .map((item) => SwapModel.fromJson(item as Map<String, dynamic>, isBorrower: true))
          .toList();

      final asLender = rawLender
          .map((item) => SwapModel.fromJson(item as Map<String, dynamic>, isBorrower: false))
          .toList();

      return (asBorrower: asBorrower, asLender: asLender);
    } on DioException catch (e) {
      _handleDioError(e);
    } catch (e) {
      throw ServerException(message: 'تعذر جلب طلبات المبادلة والمساعدة: $e');
    }
  }

  @override
  Future<SwapModel> createSwap(Map<String, dynamic> data) async {
    try {
      final response = await _dio.post(
        ApiEndpoints.swaps,
        data: data,
      );
      final responseData = response.data as Map<String, dynamic>;
      return SwapModel.fromJson(responseData, isBorrower: false);
    } on DioException catch (e) {
      _handleDioError(e);
    } catch (e) {
      throw ServerException(message: 'تعذر إنشاء طلب المساعدة: $e');
    }
  }

  @override
  Future<SwapModel> updateStatus(String swapId, String status) async {
    try {
      final response = await _dio.patch(
        ApiEndpoints.updateSwapStatus(swapId),
        data: {'status': status},
      );
      final responseData = response.data as Map<String, dynamic>;
      return SwapModel.fromJson(responseData, isBorrower: true);
    } on DioException catch (e) {
      _handleDioError(e);
    } catch (e) {
      throw ServerException(message: 'تعذر تحديث حالة الطلب: $e');
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
