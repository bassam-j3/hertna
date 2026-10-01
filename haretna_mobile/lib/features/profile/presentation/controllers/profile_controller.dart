import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/errors/failures.dart';
import '../../../auth/presentation/controllers/auth_controller.dart';
import '../../domain/repositories/profile_repository.dart';
import '../../data/repositories/profile_repository_impl.dart';
import 'profile_state.dart';

final profileControllerProvider = StateNotifierProvider<ProfileController, ProfileState>((ref) {
  final repository = ref.watch(profileRepositoryProvider);
  return ProfileController(repository, ref);
});

class ProfileController extends StateNotifier<ProfileState> {
  final ProfileRepository _repository;
  final Ref _ref;

  ProfileController(this._repository, this._ref) : super(const ProfileState()) {
    loadProfile();
  }

  Future<void> loadProfile() async {
    state = state.copyWith(status: ProfileStatus.loading, errorMessage: null);
    try {
      final user = await _repository.getProfile();
      state = state.copyWith(
        status: ProfileStatus.loaded,
        user: user,
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
        errorMessage: 'تعذر جلب بيانات الحساب: $e',
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
      final updatedUser = await _repository.updateProfile(
        name: name,
        city: city,
        neighborhood: neighborhood,
        phone: phone,
      );

      state = state.copyWith(
        status: ProfileStatus.loaded,
        user: updatedUser,
        successMessage: 'تم تحديث بيانات الملف الشخصي بنجاح',
      );

      // Sync with global authController
      _ref.read(authControllerProvider.notifier).checkSession();
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
        errorMessage: 'حدث خطأ أثناء التحديث: $e',
      );
      return false;
    }
  }

  Future<bool> uploadAvatar(List<int> bytes, String filename) async {
    state = state.copyWith(status: ProfileStatus.uploadingAvatar, errorMessage: null, successMessage: null);
    try {
      final avatarUrl = await _repository.uploadAvatar(
        imageBytes: bytes,
        filename: filename,
      );

      if (state.user != null) {
        state = state.copyWith(
          status: ProfileStatus.loaded,
          user: state.user!.copyWith(avatarUrl: avatarUrl),
          successMessage: 'تم تحديث الصورة الشخصية بنجاح',
        );
      } else {
        await loadProfile();
      }

      // Sync with global authController
      _ref.read(authControllerProvider.notifier).checkSession();
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
        errorMessage: 'تعذر رفع الصورة: $e',
      );
      return false;
    }
  }

  void clearMessages() {
    state = state.copyWith(errorMessage: null, successMessage: null);
  }
}
