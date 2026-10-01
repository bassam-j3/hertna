import '../../../auth/domain/entities/user.dart';

abstract class ProfileRepository {
  Future<User> getProfile();

  Future<User> updateProfile({
    String? name,
    String? city,
    String? neighborhood,
    String? phone,
  });

  Future<String> uploadAvatar({
    required List<int> imageBytes,
    required String filename,
  });
}
