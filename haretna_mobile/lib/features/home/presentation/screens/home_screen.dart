import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../core/constants/app_colors.dart';
import '../../../auth/presentation/controllers/auth_controller.dart';
import '../../../posts/presentation/controllers/posts_controller.dart';
import '../../../posts/presentation/controllers/posts_state.dart';
import '../../../posts/presentation/widgets/category_selector.dart';
import '../../../posts/presentation/widgets/create_post_bottom_sheet.dart';
import '../../../posts/presentation/widgets/post_card.dart';
import '../../../posts/presentation/widgets/post_type_selector.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  final _searchController = TextEditingController();
  final _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
  }

  void _onScroll() {
    if (_scrollController.position.pixels >= _scrollController.position.maxScrollExtent - 200) {
      ref.read(postsControllerProvider.notifier).loadMorePosts();
    }
  }

  @override
  void dispose() {
    _scrollController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  void _showHelpModal(BuildContext context, String postTitle, String authorName) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) {
        return Container(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                'التواصل والمساعدة',
                style: GoogleFonts.cairo(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'أنت على وشك التواصل مع $authorName بخصوص: "$postTitle"',
                style: GoogleFonts.tajawal(
                  fontSize: 14,
                  color: AppColors.textSecondary,
                ),
              ),
              const SizedBox(height: 20),
              ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: AppColors.success.withValues(alpha: 0.1),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.phone_rounded, color: AppColors.success),
                ),
                title: const Text('اتصال هاتفي مباشر'),
                subtitle: const Text('التواصل الآمن عبر الهاتف'),
                onTap: () {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('جاري بدء الاتصال بالجار...')),
                  );
                },
              ),
              ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withValues(alpha: 0.1),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.chat_bubble_outline_rounded, color: AppColors.primary),
                ),
                title: const Text('رسالة عبر حارتنا'),
                subtitle: const Text('إرسال عرض مساعدة فوري'),
                onTap: () {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('تم إرسال إشعار للجار برغبتك في المساعدة!')),
                  );
                },
              ),
              const SizedBox(height: 12),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authControllerProvider);
    final user = authState.user;
    final postsState = ref.watch(postsControllerProvider);
    final posts = postsState.filteredPosts;

    return Scaffold(
      appBar: AppBar(
        leadingWidth: 48,
        leading: Padding(
          padding: const EdgeInsets.only(right: 16),
          child: Container(
            decoration: const BoxDecoration(
              shape: BoxShape.circle,
              color: AppColors.primarySurface,
            ),
            child: const Icon(Icons.holiday_village_rounded, color: AppColors.primary, size: 24),
          ),
        ),
        titleSpacing: 8,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'حارتنا',
              style: GoogleFonts.cairo(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: AppColors.textPrimary,
              ),
            ),
            Row(
              children: [
                const Icon(Icons.location_on_rounded, size: 12, color: AppColors.primary),
                const SizedBox(width: 4),
                Text(
                  '${user?.neighborhood ?? "الحي"}، ${user?.city ?? "سوريا"}',
                  style: GoogleFonts.tajawal(
                    fontSize: 12,
                    color: AppColors.textMuted,
                  ),
                ),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_none_rounded),
            tooltip: 'الإشعارات',
            onPressed: () {
              context.go('/notifications');
            },
          ),
          IconButton(
            icon: const Icon(Icons.logout_rounded, color: AppColors.error),
            tooltip: 'تسجيل الخروج',
            onPressed: () {
              ref.read(authControllerProvider.notifier).logout();
            },
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Search Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: TextField(
                controller: _searchController,
                textDirection: TextDirection.rtl,
                decoration: InputDecoration(
                  hintText: 'ابحث عن عون، دواء، أو أداة في حارتك...',
                  prefixIcon: const Icon(Icons.search_rounded, color: AppColors.primary),
                  suffixIcon: _searchController.text.isNotEmpty
                      ? IconButton(
                          icon: const Icon(Icons.clear_rounded, size: 18),
                          onPressed: () {
                            _searchController.clear();
                            ref.read(postsControllerProvider.notifier).search('');
                          },
                        )
                      : null,
                  filled: true,
                  fillColor: Colors.white,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: const BorderSide(color: AppColors.border),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: const BorderSide(color: AppColors.border),
                  ),
                ),
                onChanged: (query) {
                  ref.read(postsControllerProvider.notifier).search(query);
                },
              ),
            ),

            // Post Type Segment (الكل | طلبات مساعدة | عروض وتبرع)
            PostTypeSelector(
              selectedType: postsState.selectedType,
              onSelected: (type) {
                ref.read(postsControllerProvider.notifier).setType(type);
              },
            ),
            const SizedBox(height: 10),

            // Horizontal Category Filter Chips
            CategorySelector(
              selectedCategory: postsState.selectedCategory,
              onSelected: (category) {
                ref.read(postsControllerProvider.notifier).setCategory(category);
              },
            ),
            const SizedBox(height: 8),

            // Main Feed Area with Pull-to-Refresh
            Expanded(
              child: RefreshIndicator(
                color: AppColors.primary,
                onRefresh: () => ref.read(postsControllerProvider.notifier).refreshPosts(),
                child: _buildFeedBody(postsState, posts),
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => CreatePostBottomSheet.show(context),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        elevation: 4,
        icon: const Icon(Icons.add_circle_outline_rounded),
        label: Text(
          'أضف طلباً أو عرضاً',
          style: GoogleFonts.cairo(fontWeight: FontWeight.bold),
        ),
      ),
    );
  }

  Widget _buildFeedBody(PostsState state, List dynamicPosts) {
    if (state.isLoading) {
      return const Center(
        child: CircularProgressIndicator(color: AppColors.primary),
      );
    }

    if (state.status == PostsStatus.error && dynamicPosts.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.wifi_off_rounded, size: 48, color: AppColors.textMuted),
              const SizedBox(height: 12),
              Text(
                state.errorMessage ?? 'تعذر تحميل المنشورات',
                textAlign: TextAlign.center,
                style: GoogleFonts.cairo(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: () => ref.read(postsControllerProvider.notifier).loadPosts(),
                icon: const Icon(Icons.refresh_rounded),
                label: const Text('إعادة المحاولة'),
                style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
              ),
            ],
          ),
        ),
      );
    }

    if (dynamicPosts.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(20),
                decoration: const BoxDecoration(
                  color: AppColors.primarySurface,
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.inbox_rounded, size: 48, color: AppColors.primary),
              ),
              const SizedBox(height: 16),
              Text(
                'لا توجد منشورات في هذا التصنيف حالياً',
                style: GoogleFonts.cairo(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                'كن أول من يبادر بنشر طلب مساعدة أو تقديم عون لأهل حارتك!',
                textAlign: TextAlign.center,
                style: GoogleFonts.tajawal(
                  fontSize: 13,
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ),
        ),
      );
    }

    return ListView.builder(
      controller: _scrollController,
      physics: const AlwaysScrollableScrollPhysics(),
      padding: const EdgeInsets.only(top: 8, bottom: 80),
      itemCount: dynamicPosts.length + (state.hasReachedMax ? 0 : 1),
      itemBuilder: (context, index) {
        if (index >= dynamicPosts.length) {
          return const Padding(
            padding: EdgeInsets.symmetric(vertical: 16.0),
            child: Center(child: CircularProgressIndicator(color: AppColors.primary)),
          );
        }
        final post = dynamicPosts[index];
        return PostCard(
          post: post,
          onTap: () {
            _showHelpModal(context, post.title, post.user?.name ?? 'الجار');
          },
          onHelpPressed: () {
            _showHelpModal(context, post.title, post.user?.name ?? 'الجار');
          },
        );
      },
    );
  }
}
