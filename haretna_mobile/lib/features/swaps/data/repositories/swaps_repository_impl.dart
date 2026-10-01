import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../domain/entities/swap.dart';
import '../../domain/repositories/swaps_repository.dart';
import '../datasources/swaps_remote_data_source.dart';

final swapsRepositoryProvider = Provider<SwapsRepository>((ref) {
  final remoteDataSource = ref.watch(swapsRemoteDataSourceProvider);
  return SwapsRepositoryImpl(remoteDataSource: remoteDataSource);
});

class SwapsRepositoryImpl implements SwapsRepository {
  final SwapsRemoteDataSource remoteDataSource;

  SwapsRepositoryImpl({required this.remoteDataSource});

  @override
  Future<({List<SwapItemEntity> requests, List<SwapItemEntity> offers})>
      getMySwaps() async {
    return await remoteDataSource.getMySwaps();
  }

  @override
  Future<void> updateSwapStatus({
    required String id,
    required String status,
  }) async {
    await remoteDataSource.updateSwapStatus(id, status);
  }

  @override
  Future<void> createSwap({
    required String postId,
    required String title,
    required DateTime startDate,
    required DateTime dueDate,
  }) async {
    await remoteDataSource.createSwap({
      'postId': postId,
      'title': title,
      'startDate': startDate.toIso8601String(),
      'dueDate': dueDate.toIso8601String(),
    });
  }
}
