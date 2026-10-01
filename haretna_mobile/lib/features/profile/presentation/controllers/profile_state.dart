import '../../../auth/domain/entities/user.dart';

enum ProfileStatus {
  initial,
  loading,
  loaded,
  updating,
  uploadingAvatar,
  error,
}

class ProfileState {
  final ProfileStatus status;
  final User? user;
  final String? errorMessage;
  final String? successMessage;

  const ProfileState({
    this.status = ProfileStatus.initial,
    this.user,
    this.errorMessage,
    this.successMessage,
  });

  bool get isLoading => status == ProfileStatus.loading;
  bool get isUpdating => status == ProfileStatus.updating || status == ProfileStatus.uploadingAvatar;

  ProfileState copyWith({
    ProfileStatus? status,
    User? user,
    String? errorMessage,
    String? successMessage,
  }) {
    return ProfileState(
      status: status ?? this.status,
      user: user ?? this.user,
      errorMessage: errorMessage,
      successMessage: successMessage,
    );
  }
}
