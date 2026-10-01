import '../entities/post.dart';

abstract class PostsRepository {
  Future<List<Post>> getPosts({
    int? page,
    int? limit,
    String? type,
    String? category,
    String? search,
    String? neighborhood,
  });

  Future<Post> getPostById(String id);

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
  });

  Future<void> deletePost(String id);
}
