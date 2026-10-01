import '../entities/swap.dart';

abstract class SwapsRepository {
  Future<MySwapsGroup> getMySwaps();

  Future<SwapItem> createSwap({
    required String postId,
    required String title,
    required DateTime startDate,
    required DateTime dueDate,
  });

  Future<SwapItem> updateStatus({
    required String swapId,
    required String status,
  });
}
