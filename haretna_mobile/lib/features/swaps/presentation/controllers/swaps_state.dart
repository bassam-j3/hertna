import '../../domain/entities/swap.dart';

class SwapsState {
  final bool isLoading;
  final bool isUpdating;
  final String? errorMessage;
  final List<SwapItemEntity> requests;
  final List<SwapItemEntity> offers;

  const SwapsState({
    this.isLoading = false,
    this.isUpdating = false,
    this.errorMessage,
    this.requests = const [],
    this.offers = const [],
  });

  SwapsState copyWith({
    bool? isLoading,
    bool? isUpdating,
    String? errorMessage,
    List<SwapItemEntity>? requests,
    List<SwapItemEntity>? offers,
    bool clearError = false,
  }) {
    return SwapsState(
      isLoading: isLoading ?? this.isLoading,
      isUpdating: isUpdating ?? this.isUpdating,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
      requests: requests ?? this.requests,
      offers: offers ?? this.offers,
    );
  }
}
