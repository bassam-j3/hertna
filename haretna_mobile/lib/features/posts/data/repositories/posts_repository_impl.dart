import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/errors/exceptions.dart';
import '../../../../core/errors/failures.dart';
import '../../domain/entities/post.dart';
import '../../domain/repositories/posts_repository.dart';
import '../datasources/posts_remote_data_source.dart';

final postsRepositoryProvider = Provider<PostsRepository>((ref) {
  final remoteDataSource = ref.watch(postsRemoteDataSourceProvider);
  return PostsRepositoryImpl(remoteDataSource);
});

class PostsRepositoryImpl implements PostsRepository {
  final PostsRemoteDataSource _remoteDataSource;

  PostsRepositoryImpl(this._remoteDataSource);

  @override
  Future<List<Post>> getPosts({
    int? page,
    int? limit,
    String? type,
    String? category,
    String? search,
    String? neighborhood,
  }) async {
    try {
      return await _remoteDataSource.getPosts(
        page: page,
        limit: limit,
        type: type,
        category: category,
        search: search,
        neighborhood: neighborhood,
      );
    } on NetworkException catch (e) {
      throw NetworkFailure(e.message);
    } on UnauthorizedException catch (e) {
      throw AuthFailure(e.message);
    } on ServerException catch (e) {
      throw ServerFailure(e.message, statusCode: e.statusCode);
    } catch (e) {
      throw ServerFailure(e.toString());
    }
  }

  @override
  Future<Post> getPostById(String id) async {
    try {
      return await _remoteDataSource.getPostById(id);
    } on NetworkException catch (e) {
      throw NetworkFailure(e.message);
    } on ServerException catch (e) {
      throw ServerFailure(e.message, statusCode: e.statusCode);
    } catch (e) {
      throw ServerFailure(e.toString());
    }
  }

  @override
  Future<Post> createPost({
    required String title,
    String? description,
    required String category,
    required String type,
    bool urgent = false,
    String? location,
    String? image,
    bool isAnonymous = false,
    List<String>? tags,
  }) async {
    try {
      final data = {
        'title': title,
        if (description != null) 'description': description,
        'category': category,
        'type': type,
        'urgent': urgent,
        if (location != null) 'location': location,
        if (image != null) 'image': image,
        'isAnonymous': isAnonymous,
        if (tags != null) 'tags': tags,
      };

      return await _remoteDataSource.createPost(data);
    } on NetworkException catch (e) {
      throw NetworkFailure(e.message);
    } on ServerException catch (e) {
      throw ServerFailure(e.message, statusCode: e.statusCode);
    } catch (e) {
      throw ServerFailure(e.toString());
    }
  }

  @override
  Future<void> deletePost(String id) async {
    try {
      await _remoteDataSource.deletePost(id);
    } on NetworkException catch (e) {
      throw NetworkFailure(e.message);
    } on ServerException catch (e) {
      throw ServerFailure(e.message, statusCode: e.statusCode);
    } catch (e) {
      throw ServerFailure(e.toString());
    }
  }
}
