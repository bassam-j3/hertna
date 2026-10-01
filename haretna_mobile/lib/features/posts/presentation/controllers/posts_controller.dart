import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/errors/failures.dart';
import '../../domain/repositories/posts_repository.dart';
import '../../data/repositories/posts_repository_impl.dart';
import 'posts_state.dart';

final postsControllerProvider = StateNotifierProvider<PostsController, PostsState>((ref) {
  final repository = ref.watch(postsRepositoryProvider);
  return PostsController(repository);
});

class PostsController extends StateNotifier<PostsState> {
  final PostsRepository _repository;

  PostsController(this._repository) : super(const PostsState()) {
    loadPosts();
  }

  Future<void> loadPosts() async {
    state = state.copyWith(status: PostsStatus.loading, errorMessage: null, page: 1, hasReachedMax: false);
    try {
      final posts = await _repository.getPosts(
        page: 1,
        limit: 10,
        type: state.selectedType == 'ALL' ? null : state.selectedType,
        category: state.selectedCategory == 'ALL' ? null : state.selectedCategory,
        search: state.searchQuery.isEmpty ? null : state.searchQuery,
        neighborhood: state.neighborhood,
      );
      state = state.copyWith(
        status: PostsStatus.loaded,
        posts: posts,
        hasReachedMax: posts.length < 10,
        errorMessage: null,
      );
    } on Failure catch (f) {
      state = state.copyWith(
        status: PostsStatus.error,
        errorMessage: f.message,
      );
    } catch (e) {
      state = state.copyWith(
        status: PostsStatus.error,
        errorMessage: 'تعذر جلب المنشورات: $e',
      );
    }
  }

  Future<void> loadMorePosts() async {
    if (state.isLoading || state.hasReachedMax) return;
    try {
      final nextPage = state.page + 1;
      final newPosts = await _repository.getPosts(
        page: nextPage,
        limit: 10,
        type: state.selectedType == 'ALL' ? null : state.selectedType,
        category: state.selectedCategory == 'ALL' ? null : state.selectedCategory,
        search: state.searchQuery.isEmpty ? null : state.searchQuery,
        neighborhood: state.neighborhood,
      );
      state = state.copyWith(
        posts: [...state.posts, ...newPosts],
        page: nextPage,
        hasReachedMax: newPosts.length < 10,
      );
    } catch (e) {
      // Handle pagination error without replacing existing posts
    }
  }

  Future<void> refreshPosts() async {
    state = state.copyWith(isRefreshing: true, errorMessage: null, page: 1, hasReachedMax: false);
    try {
      final posts = await _repository.getPosts(
        page: 1,
        limit: 10,
        type: state.selectedType == 'ALL' ? null : state.selectedType,
        category: state.selectedCategory == 'ALL' ? null : state.selectedCategory,
        search: state.searchQuery.isEmpty ? null : state.searchQuery,
        neighborhood: state.neighborhood,
      );
      state = state.copyWith(
        status: PostsStatus.loaded,
        posts: posts,
        isRefreshing: false,
        hasReachedMax: posts.length < 10,
        errorMessage: null,
      );
    } catch (_) {
      state = state.copyWith(isRefreshing: false);
    }
  }

  void setNeighborhood(String? neighborhood) {
    if (state.neighborhood == neighborhood) return;
    state = state.copyWith(neighborhood: neighborhood);
    loadPosts();
  }

  void setCategory(String category) {
    if (state.selectedCategory == category) return;
    state = state.copyWith(selectedCategory: category);
    loadPosts();
  }

  void setType(String type) {
    if (state.selectedType == type) return;
    state = state.copyWith(selectedType: type);
    loadPosts();
  }

  void search(String query) {
    if (state.searchQuery == query) return;
    state = state.copyWith(searchQuery: query);
    loadPosts();
  }

  Future<bool> createPost({
    required String title,
    String? description,
    required String category,
    required String type,
    bool urgent = false,
    String? location,
  }) async {
    try {
      final newPost = await _repository.createPost(
        title: title,
        description: description,
        category: category,
        type: type,
        urgent: urgent,
        location: location,
      );
      // Prepend to current posts list
      state = state.copyWith(
        posts: [newPost, ...state.posts],
      );
      return true;
    } catch (e) {
      return false;
    }
  }

  Future<bool> deletePost(String id) async {
    try {
      await _repository.deletePost(id);
      state = state.copyWith(
        posts: state.posts.where((p) => p.id != id).toList(),
      );
      return true;
    } catch (e) {
      return false;
    }
  }

  void clearError() {
    state = state.copyWith(errorMessage: null);
  }
}
