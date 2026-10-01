import '../entities/swap.dart';

abstract class SwapsRepository {
  Future<({List<SwapItemEntity> requests, List<SwapItemEntity> offers})> getMySwaps();

  Future<void> updateSwapStatus({
    required String id,
    required String status,
  });

  Future<void> createSwap({
    required String postId,
    required String title,
    required DateTime startDate,
    required DateTime dueDate,
  });
}
