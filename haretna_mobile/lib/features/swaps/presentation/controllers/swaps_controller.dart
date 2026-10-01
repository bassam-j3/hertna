import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/repositories/swaps_repository_impl.dart';
import '../../domain/entities/swap.dart';
import '../../domain/repositories/swaps_repository.dart';
import 'swaps_state.dart';

final swapsControllerProvider =
    StateNotifierProvider<SwapsController, SwapsState>((ref) {
  final repository = ref.watch(swapsRepositoryProvider);
  return SwapsController(repository: repository);
});

class SwapsController extends StateNotifier<SwapsState> {
  final SwapsRepository repository;

  SwapsController({required this.repository}) : super(const SwapsState()) {
    loadSwaps();
  }

  Future<void> loadSwaps() async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final result = await repository.getMySwaps();
      state = state.copyWith(
        isLoading: false,
        requests: result.requests,
        offers: result.offers,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: e.toString().replaceFirst('Exception: ', ''),
      );
    }
  }

  Future<bool> updateStatus(String swapId, String status) async {
    state = state.copyWith(isUpdating: true, clearError: true);
    try {
      await repository.updateSwapStatus(id: swapId, status: status);

      // Re-map the lists with the updated status
      final updatedRequests = state.requests.map((s) {
        if (s.id == swapId) {
          return SwapItemEntity(
            id: s.id,
            title: s.title,
            status: status,
            startDate: s.startDate,
            dueDate: s.dueDate,
            postId: s.postId,
            postImage: s.postImage,
            otherParty: s.otherParty,
            isLender: s.isLender,
          );
        }
        return s;
      }).toList();

      final updatedOffers = state.offers.map((s) {
        if (s.id == swapId) {
          return SwapItemEntity(
            id: s.id,
            title: s.title,
            status: status,
            startDate: s.startDate,
            dueDate: s.dueDate,
            postId: s.postId,
            postImage: s.postImage,
            otherParty: s.otherParty,
            isLender: s.isLender,
          );
        }
        return s;
      }).toList();

      state = state.copyWith(
        isUpdating: false,
        requests: updatedRequests,
        offers: updatedOffers,
      );
      return true;
    } catch (e) {
      state = state.copyWith(
        isUpdating: false,
        errorMessage: e.toString().replaceFirst('Exception: ', ''),
      );
      return false;
    }
  }
}
