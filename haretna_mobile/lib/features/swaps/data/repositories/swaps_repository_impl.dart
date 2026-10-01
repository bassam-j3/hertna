import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/errors/exceptions.dart';
import '../../../../core/errors/failures.dart';
import '../../domain/entities/swap.dart';
import '../../domain/repositories/swaps_repository.dart';
import '../datasources/swaps_remote_data_source.dart';

final swapsRepositoryProvider = Provider<SwapsRepository>((ref) {
  final remoteDataSource = ref.watch(swapsRemoteDataSourceProvider);
  return SwapsRepositoryImpl(remoteDataSource);
});

class SwapsRepositoryImpl implements SwapsRepository {
  final SwapsRemoteDataSource _remoteDataSource;

  SwapsRepositoryImpl(this._remoteDataSource);

  @override
  Future<MySwapsGroup> getMySwaps() async {
    try {
      final result = await _remoteDataSource.findMySwaps();
      return MySwapsGroup(
        asBorrower: result.asBorrower,
        asLender: result.asLender,
      );
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
  Future<SwapItem> createSwap({
    required String postId,
    required String title,
    required DateTime startDate,
    required DateTime dueDate,
  }) async {
    try {
      final data = {
        'postId': postId,
        'title': title,
        'startDate': startDate.toIso8601String(),
        'dueDate': dueDate.toIso8601String(),
      };
      return await _remoteDataSource.createSwap(data);
    } on NetworkException catch (e) {
      throw NetworkFailure(e.message);
    } on ServerException catch (e) {
      throw ServerFailure(e.message, statusCode: e.statusCode);
    } catch (e) {
      throw ServerFailure(e.toString());
    }
  }

  @override
  Future<SwapItem> updateStatus({
    required String swapId,
    required String status,
  }) async {
    try {
      return await _remoteDataSource.updateStatus(swapId, status);
    } on NetworkException catch (e) {
      throw NetworkFailure(e.message);
    } on ServerException catch (e) {
      throw ServerFailure(e.message, statusCode: e.statusCode);
    } catch (e) {
      throw ServerFailure(e.toString());
    }
  }
}
