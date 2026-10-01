import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/errors/exceptions.dart';
import '../../../../core/errors/failures.dart';
import '../../domain/entities/user_profile.dart';
import '../../domain/repositories/profile_repository.dart';
import '../datasources/profile_remote_data_source.dart';

final profileRepositoryProvider = Provider<ProfileRepository>((ref) {
  final remoteDataSource = ref.watch(profileRemoteDataSourceProvider);
  return ProfileRepositoryImpl(remoteDataSource);
});

class ProfileRepositoryImpl implements ProfileRepository {
  final ProfileRemoteDataSource _remoteDataSource;

  ProfileRepositoryImpl(this._remoteDataSource);

  @override
  Future<UserProfile> getProfile() async {
    try {
      return await _remoteDataSource.getProfile();
    } on UnauthorizedException catch (e) {
      throw AuthFailure(e.message);
    } on NetworkException catch (e) {
      throw NetworkFailure(e.message);
    } on ServerException catch (e) {
      throw ServerFailure(e.message, statusCode: e.statusCode);
    } catch (e) {
      throw ServerFailure(e.toString());
    }
  }

  @override
  Future<UserProfile> updateProfile({
    String? name,
    String? city,
    String? neighborhood,
    String? phone,
  }) async {
    try {
      final data = <String, dynamic>{};
      if (name != null) data['name'] = name.trim();
      if (city != null) data['city'] = city.trim();
      if (neighborhood != null) data['neighborhood'] = neighborhood.trim();
      if (phone != null) data['phone'] = phone.trim();

      return await _remoteDataSource.updateProfile(data);
    } on NetworkException catch (e) {
      throw NetworkFailure(e.message);
    } on ServerException catch (e) {
      throw ServerFailure(e.message, statusCode: e.statusCode);
    } catch (e) {
      throw ServerFailure(e.toString());
    }
  }

  @override
  Future<String> uploadAvatar(String filePath) async {
    try {
      return await _remoteDataSource.uploadAvatar(filePath);
    } on NetworkException catch (e) {
      throw NetworkFailure(e.message);
    } on ServerException catch (e) {
      throw ServerFailure(e.message, statusCode: e.statusCode);
    } catch (e) {
      throw ServerFailure(e.toString());
    }
  }
}
