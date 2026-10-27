import 'package:haretna_mobile/features/auth/domain/entities/user.dart';
import 'package:haretna_mobile/features/auth/domain/repositories/auth_repository.dart';
import 'package:haretna_mobile/features/auth/presentation/controllers/auth_controller.dart';
import 'package:haretna_mobile/features/auth/presentation/controllers/auth_state.dart';
import 'package:haretna_mobile/features/posts/domain/entities/post.dart';
import 'package:haretna_mobile/features/posts/domain/repositories/posts_repository.dart';
import 'package:haretna_mobile/features/profile/domain/entities/user_profile.dart';
import 'package:haretna_mobile/features/profile/domain/repositories/profile_repository.dart';
import 'package:haretna_mobile/features/swaps/domain/entities/swap.dart';
import 'package:haretna_mobile/features/swaps/domain/repositories/swaps_repository.dart';

// ── Sample data matching the Stitch design content ──────────────────────

const sampleUser = User(
  id: 'u1',
  name: 'أبو محمد',
  phone: '0999999999',
  city: 'دمشق',
  neighborhood: 'المهاجرين',
  role: 'user',
);

/// Auth controller pre-seeded with an authenticated session, for widget
/// tests that render screens depending on the current user.
class FakeAuthController extends AuthController {
  FakeAuthController({User? user})
      : super(FakeAuthRepository(currentUser: user ?? sampleUser)) {
    state = AuthState(status: AuthStatus.authenticated, user: user ?? sampleUser);
  }
}

class FakeAuthRepository implements AuthRepository {
  final User? currentUser;

  FakeAuthRepository({this.currentUser});

  @override
  Future<User> login({
    required String phone,
    required String password,
  }) async {
    return currentUser ?? sampleUser;
  }

  @override
  Future<User> register({
    required String name,
    required String phone,
    required String password,
    required String city,
    required String neighborhood,
    String? userType,
  }) async {
    return User(
      id: 'u1',
      name: name,
      phone: phone,
      city: city,
      neighborhood: neighborhood,
    );
  }

  @override
  Future<User?> getCurrentUser() async => currentUser;

  @override
  Future<void> logout() async {}
}

class FakePostsRepository implements PostsRepository {
  final List<Post> posts;

  FakePostsRepository({List<Post>? posts})
      : posts = posts ?? _defaultPosts();

  static List<Post> _defaultPosts() {
    return [
      Post(
        id: 'p1',
        title: 'مثقب كهربائي (شنيور)',
        description: 'متوفر للإعارة لمدة يومين. بحالة ممتازة مع مجموعة ريش كاملة.',
        category: 'أدوات',
        type: 'OFFER',
        location: 'يبعد 1.2 كم',
        image: 'https://example.com/drill.png',
        createdAt: DateTime(2026, 10, 20),
        userId: 'u1',
        user: const PostUser(id: 'u1', name: 'أبو محمد', trustPoints: 49),
      ),
      Post(
        id: 'p2',
        title: 'ملابس شتوية أطفال',
        description: 'ثلاث جاكيتات شتوية لعمر 5-7 سنوات بحالة جيدة جداً.',
        category: 'ملابس',
        type: 'OFFER',
        location: 'تبعد 0.8 كم',
        createdAt: DateTime(2026, 10, 19),
        userId: 'u2',
        user: const PostUser(id: 'u2', name: 'أم سعيد', trustPoints: 32),
      ),
      Post(
        id: 'p3',
        title: 'مساعدة في نقل أثاث',
        description: 'نحتاج لشابين للمساعدة في نقل بعض الأثاث الخفيف لجارنا المسن.',
        category: 'تطوع',
        type: 'REQUEST',
        urgent: true,
        location: 'يبعد 2.5 كم',
        createdAt: DateTime(2026, 10, 18),
        userId: 'u3',
        user: const PostUser(id: 'u3', name: 'سامر', trustPoints: 12),
      ),
    ];
  }

  @override
  Future<List<Post>> getPosts({
    int? page,
    int? limit,
    String? type,
    String? category,
    String? search,
    String? neighborhood,
  }) async {
    return posts;
  }

  @override
  Future<Post> getPostById(String id) async => posts.first;

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
    return Post(
      id: 'new',
      title: title,
      description: description ?? '',
      category: category,
      type: type,
      urgent: urgent,
      location: location ?? '',
      image: image,
      createdAt: DateTime(2026, 10, 21),
      userId: 'u1',
    );
  }

  @override
  Future<void> deletePost(String id) async {}
}

class FakeSwapsRepository implements SwapsRepository {
  final List<SwapItemEntity> requests;
  final List<SwapItemEntity> offers;

  FakeSwapsRepository({List<SwapItemEntity>? requests, List<SwapItemEntity>? offers})
      : requests = requests ?? const [],
        offers = offers ?? _defaultOffers();

  static List<SwapItemEntity> _defaultOffers() {
    return [
      SwapItemEntity(
        id: 's1',
        title: 'مثقاب كهربائي (دريل)',
        status: 'in_use',
        startDate: DateTime(2026, 10, 18),
        dueDate: DateTime(2026, 10, 24),
        otherParty: const SwapParty(id: 'b1', name: 'رامي خ.'),
        isLender: true,
      ),
      const SwapItemEntity(
        id: 's2',
        title: 'كراسي رحلات (عدد ٤)',
        status: 'pending',
        otherParty: SwapParty(id: 'b2', name: 'عائلة محمد'),
        isLender: true,
      ),
      const SwapItemEntity(
        id: 's3',
        title: 'سلم خشبي (٣ متر)',
        status: 'completed',
        otherParty: SwapParty(id: 'b3', name: 'جابر م.'),
        isLender: true,
      ),
    ];
  }

  @override
  Future<({List<SwapItemEntity> requests, List<SwapItemEntity> offers})>
      getMySwaps() async {
    return (requests: requests, offers: offers);
  }

  @override
  Future<void> updateSwapStatus({
    required String id,
    required String status,
  }) async {}

  @override
  Future<void> createSwap({
    required String postId,
    required String title,
    required DateTime startDate,
    required DateTime dueDate,
  }) async {}
}

class FakeProfileRepository implements ProfileRepository {
  final UserProfile profile;

  FakeProfileRepository({UserProfile? profile})
      : profile = profile ?? _defaultProfile();

  static UserProfile _defaultProfile() {
    return const UserProfile(
      id: 'u1',
      name: 'أحمد السوري',
      phone: '0999999999',
      city: 'دمشق',
      neighborhood: 'حي الميدان',
      role: 'user',
      trustPoints: 24,
      postsCount: 15,
      receivedRatingsCount: 49,
    );
  }

  @override
  Future<UserProfile> getProfile() async => profile;

  @override
  Future<UserProfile> updateProfile({
    String? name,
    String? city,
    String? neighborhood,
    String? phone,
  }) async {
    return profile;
  }

  @override
  Future<String> uploadAvatar(String filePath) async => 'avatar-url';
}
