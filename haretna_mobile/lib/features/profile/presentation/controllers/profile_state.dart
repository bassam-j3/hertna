import '../../domain/entities/user_profile.dart';

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
  final UserProfile? profile;
  final String? errorMessage;
  final String? successMessage;

  const ProfileState({
    this.status = ProfileStatus.initial,
    this.profile,
    this.errorMessage,
    this.successMessage,
  });

  bool get isLoading => status == ProfileStatus.loading;
  bool get isUpdating => status == ProfileStatus.updating || status == ProfileStatus.uploadingAvatar;

  ProfileState copyWith({
    ProfileStatus? status,
    UserProfile? profile,
    String? errorMessage,
    String? successMessage,
  }) {
    return ProfileState(
      status: status ?? this.status,
      profile: profile ?? this.profile,
      errorMessage: errorMessage,
      successMessage: successMessage,
    );
  }
}
