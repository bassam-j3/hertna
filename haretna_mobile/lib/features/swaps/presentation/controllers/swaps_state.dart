import '../../domain/entities/swap.dart';

enum SwapsStatus {
  initial,
  loading,
  loaded,
  error,
}

class SwapsState {
  final SwapsStatus status;
  final MySwapsGroup swaps;
  final int selectedTabIndex; // 0: طلباتي (كمستفيد), 1: عروضي ومساعداتي (كمعير)
  final String? errorMessage;
  final String? successMessage;
  final bool isRefreshing;

  const SwapsState({
    this.status = SwapsStatus.initial,
    this.swaps = const MySwapsGroup(),
    this.selectedTabIndex = 0,
    this.errorMessage,
    this.successMessage,
    this.isRefreshing = false,
  });

  bool get isLoading => status == SwapsStatus.loading && !isRefreshing;

  List<SwapItem> get currentList =>
      selectedTabIndex == 0 ? swaps.asBorrower : swaps.asLender;

  SwapsState copyWith({
    SwapsStatus? status,
    MySwapsGroup? swaps,
    int? selectedTabIndex,
    String? errorMessage,
    String? successMessage,
    bool? isRefreshing,
  }) {
    return SwapsState(
      status: status ?? this.status,
      swaps: swaps ?? this.swaps,
      selectedTabIndex: selectedTabIndex ?? this.selectedTabIndex,
      errorMessage: errorMessage,
      successMessage: successMessage,
      isRefreshing: isRefreshing ?? this.isRefreshing,
    );
  }
}
