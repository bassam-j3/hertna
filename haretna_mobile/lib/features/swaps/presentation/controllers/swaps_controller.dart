import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/errors/failures.dart';
import '../../domain/repositories/swaps_repository.dart';
import '../../data/repositories/swaps_repository_impl.dart';
import 'swaps_state.dart';

final swapsControllerProvider = StateNotifierProvider<SwapsController, SwapsState>((ref) {
  final repository = ref.watch(swapsRepositoryProvider);
  return SwapsController(repository);
});

class SwapsController extends StateNotifier<SwapsState> {
  final SwapsRepository _repository;

  SwapsController(this._repository) : super(const SwapsState()) {
    loadMySwaps();
  }

  Future<void> loadMySwaps() async {
    state = state.copyWith(status: SwapsStatus.loading, errorMessage: null);
    try {
      final swapsGroup = await _repository.getMySwaps();
      state = state.copyWith(
        status: SwapsStatus.loaded,
        swaps: swapsGroup,
        errorMessage: null,
      );
    } on Failure catch (f) {
      state = state.copyWith(
        status: SwapsStatus.error,
        errorMessage: f.message,
      );
    } catch (e) {
      state = state.copyWith(
        status: SwapsStatus.error,
        errorMessage: 'تعذر جلب طلبات المبادلة: $e',
      );
    }
  }

  Future<void> refreshMySwaps() async {
    state = state.copyWith(isRefreshing: true, errorMessage: null);
    try {
      final swapsGroup = await _repository.getMySwaps();
      state = state.copyWith(
        status: SwapsStatus.loaded,
        swaps: swapsGroup,
        isRefreshing: false,
        errorMessage: null,
      );
    } catch (_) {
      state = state.copyWith(isRefreshing: false);
    }
  }

  void setTab(int index) {
    if (state.selectedTabIndex == index) return;
    state = state.copyWith(selectedTabIndex: index);
  }

  Future<bool> updateStatus(String swapId, String status) async {
    try {
      await _repository.updateStatus(swapId: swapId, status: status);
      await loadMySwaps();
      state = state.copyWith(
        successMessage: 'تم تحديث حالة الطلب بنجاح',
      );
      return true;
    } on Failure catch (f) {
      state = state.copyWith(
        errorMessage: f.message,
      );
      return false;
    } catch (e) {
      state = state.copyWith(
        errorMessage: 'تعذر تحديث الحالة: $e',
      );
      return false;
    }
  }

  void clearMessages() {
    state = state.copyWith(errorMessage: null, successMessage: null);
  }
}
