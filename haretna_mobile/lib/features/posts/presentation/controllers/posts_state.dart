import '../../domain/entities/post.dart';

enum PostsStatus {
  initial,
  loading,
  loaded,
  error,
}

class PostsState {
  final PostsStatus status;
  final List<Post> posts;
  final String selectedCategory; // 'ALL' or specific category
  final String selectedType;     // 'ALL', 'OFFER', 'REQUEST'
  final String searchQuery;
  final String? neighborhood;
  final String? errorMessage;
  final bool isRefreshing;
  final int page;
  final bool hasReachedMax;

  const PostsState({
    this.status = PostsStatus.initial,
    this.posts = const [],
    this.selectedCategory = 'ALL',
    this.selectedType = 'ALL',
    this.searchQuery = '',
    this.neighborhood,
    this.errorMessage,
    this.isRefreshing = false,
    this.page = 1,
    this.hasReachedMax = false,
  });

  bool get isLoading => status == PostsStatus.loading && !isRefreshing;

  List<Post> get filteredPosts {
    return posts.where((p) {
      if (selectedType != 'ALL' && p.type.toUpperCase() != selectedType.toUpperCase()) {
        return false;
      }
      if (selectedCategory != 'ALL' && p.category != selectedCategory) {
        return false;
      }
      if (searchQuery.isNotEmpty) {
        final query = searchQuery.toLowerCase();
        final matchesTitle = p.title.toLowerCase().contains(query);
        final matchesDesc = p.description.toLowerCase().contains(query);
        final matchesLoc = p.location.toLowerCase().contains(query);
        if (!matchesTitle && !matchesDesc && !matchesLoc) {
          return false;
        }
      }
      return true;
    }).toList();
  }

  PostsState copyWith({
    PostsStatus? status,
    List<Post>? posts,
    String? selectedCategory,
    String? selectedType,
    String? searchQuery,
    String? neighborhood,
    String? errorMessage,
    bool? isRefreshing,
    int? page,
    bool? hasReachedMax,
  }) {
    return PostsState(
      status: status ?? this.status,
      posts: posts ?? this.posts,
      selectedCategory: selectedCategory ?? this.selectedCategory,
      selectedType: selectedType ?? this.selectedType,
      searchQuery: searchQuery ?? this.searchQuery,
      neighborhood: neighborhood ?? this.neighborhood,
      errorMessage: errorMessage,
      isRefreshing: isRefreshing ?? this.isRefreshing,
      page: page ?? this.page,
      hasReachedMax: hasReachedMax ?? this.hasReachedMax,
    );
  }
}
