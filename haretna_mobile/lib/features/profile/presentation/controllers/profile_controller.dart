import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';

import '../../../../core/errors/failures.dart';
import '../../domain/entities/user_profile.dart';
import '../../domain/repositories/profile_repository.dart';
import '../../data/repositories/profile_repository_impl.dart';
import 'profile_state.dart';

final profileControllerProvider = StateNotifierProvider<ProfileController, ProfileState>((ref) {
  final repository = ref.watch(profileRepositoryProvider);
  return ProfileController(repository);
});

class ProfileController extends StateNotifier<ProfileState> {
  final ProfileRepository _repository;
  final ImagePicker _picker = ImagePicker();

  ProfileController(this._repository) : super(const ProfileState()) {
    loadProfile();
  }

  Future<void> loadProfile() async {
    state = state.copyWith(status: ProfileStatus.loading, errorMessage: null);
    try {
      final profile = await _repository.getProfile();
      state = state.copyWith(
        status: ProfileStatus.loaded,
        profile: profile,
        errorMessage: null,
      );
    } on Failure catch (f) {
      state = state.copyWith(
        status: ProfileStatus.error,
        errorMessage: f.message,
      );
    } catch (e) {
      state = state.copyWith(
        status: ProfileStatus.error,
        errorMessage: 'تعذر جلب بيانات الملف الشخصي: $e',
      );
    }
  }

  Future<bool> updateProfile({
    String? name,
    String? city,
    String? neighborhood,
    String? phone,
  }) async {
    state = state.copyWith(status: ProfileStatus.updating, errorMessage: null, successMessage: null);
    try {
      final updated = await _repository.updateProfile(
        name: name,
        city: city,
        neighborhood: neighborhood,
        phone: phone,
      );
      state = state.copyWith(
        status: ProfileStatus.loaded,
        profile: updated,
        successMessage: 'تم تحديث الملف الشخصي بنجاح',
      );
      return true;
    } on Failure catch (f) {
      state = state.copyWith(
        status: ProfileStatus.error,
        errorMessage: f.message,
      );
      return false;
    } catch (e) {
      state = state.copyWith(
        status: ProfileStatus.error,
        errorMessage: 'تعذر تحديث البيانات: $e',
      );
      return false;
    }
  }

  Future<bool> pickAndUploadAvatar(ImageSource source) async {
    try {
      final picked = await _picker.pickImage(
        source: source,
        maxWidth: 600,
        maxHeight: 600,
        imageQuality: 85,
      );
      if (picked == null) return false;

      state = state.copyWith(
        status: ProfileStatus.uploadingAvatar,
        errorMessage: null,
        successMessage: null,
      );

      final avatarUrl = await _repository.uploadAvatar(picked.path);

      if (state.profile != null) {
        final updated = UserProfile(
          id: state.profile!.id,
          name: state.profile!.name,
          phone: state.profile!.phone,
          email: state.profile!.email,
          city: state.profile!.city,
          neighborhood: state.profile!.neighborhood,
          role: state.profile!.role,
          avatarUrl: avatarUrl.isNotEmpty ? avatarUrl : state.profile!.avatarUrl,
          trustPoints: state.profile!.trustPoints,
          postsCount: state.profile!.postsCount,
          givenRatingsCount: state.profile!.givenRatingsCount,
          receivedRatingsCount: state.profile!.receivedRatingsCount,
          createdAt: state.profile!.createdAt,
        );
        state = state.copyWith(
          status: ProfileStatus.loaded,
          profile: updated,
          successMessage: 'تم تحديث الصورة الشخصية بنجاح',
        );
      } else {
        await loadProfile();
      }
      return true;
    } catch (e) {
      state = state.copyWith(
        status: ProfileStatus.error,
        errorMessage: 'فشل رفع الصورة: $e',
      );
      return false;
    }
  }

  void clearMessages() {
    state = state.copyWith(errorMessage: null, successMessage: null);
  }
}
