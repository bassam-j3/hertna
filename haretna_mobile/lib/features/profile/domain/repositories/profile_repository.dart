import '../entities/user_profile.dart';

abstract class ProfileRepository {
  Future<UserProfile> getProfile();

  Future<UserProfile> updateProfile({
    String? name,
    String? city,
    String? neighborhood,
    String? phone,
  });

  Future<String> uploadAvatar(String filePath);
}
