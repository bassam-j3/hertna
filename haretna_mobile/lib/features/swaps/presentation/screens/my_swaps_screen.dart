import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../core/constants/app_colors.dart';
import '../../../auth/presentation/controllers/auth_controller.dart';
import '../../domain/entities/swap.dart';
import '../controllers/swaps_controller.dart';
import '../widgets/swap_card.dart';

/// Exchanges dashboard matching the Stitch "Exchanges Dashboard v2" design:
/// user header card with impact metrics, horizontal filter tabs and a bento
/// grid of swap cards.
class MySwapsScreen extends ConsumerStatefulWidget {
  const MySwapsScreen({super.key});

  @override
  ConsumerState<MySwapsScreen> createState() => _MySwapsScreenState();
}

class _MySwapsScreenState extends ConsumerState<MySwapsScreen> {
  static const List<String> _tabLabels = [
    'المعارات النشطة',
    'الطلبات المستلمة',
    'الطلبات المرسلة',
    'سجل التقييمات',
  ];

  int _tabIndex = 0;

  void _handleStatusChange(String swapId, String status) async {
    final success = await ref
        .read(swapsControllerProvider.notifier)
        .updateStatus(swapId, status);

    if (mounted) {
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('تم تحديث حالة الطلب بنجاح'),
            backgroundColor: AppColors.success,
          ),
        );
      } else {
        final error = ref.read(swapsControllerProvider).errorMessage ??
            'حدث خطأ أثناء التحديث';
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(error),
            backgroundColor: AppColors.error,
          ),
        );
      }
    }
  }

  List<SwapItemEntity> _filterForTab(List<SwapItemEntity> offers,
      List<SwapItemEntity> requests) {
    switch (_tabIndex) {
      case 0: // Active loans (my items currently lent)
        return offers
            .where((s) => s.isAccepted || s.isInUse)
            .toList();
      case 1: // Received requests (pending on my items)
        return offers.where((s) => s.isPending).toList();
      case 2: // Sent requests (as borrower)
        return requests;
      case 3: // Rating history (completed on both sides)
        return [
          ...offers.where((s) => s.isCompleted),
          ...requests.where((s) => s.isCompleted),
        ];
      default:
        return const [];
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(swapsControllerProvider);
    final authState = ref.watch(authControllerProvider);
    final user = authState.user;

    final swaps = _filterForTab(state.offers, state.requests);

    return Scaffold(
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(64),
        child: Container(
          decoration: BoxDecoration(
            color: AppColors.surface,
            border: Border(
              bottom: BorderSide(
                color: AppColors.border.withValues(alpha: 0.3),
              ),
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.05),
                blurRadius: 4,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: SafeArea(
            bottom: false,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
              child: Row(
                children: [
                  IconButton(
                    onPressed: () {},
                    icon: const Icon(Icons.spa, color: AppColors.primary),
                  ),
                  Expanded(
                    child: Text(
                      'حارتنا',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.cairo(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: AppColors.primary,
                      ),
                    ),
                  ),
                  IconButton(
                    onPressed: () {},
                    icon: const Icon(
                      Icons.notifications_none_rounded,
                      color: AppColors.primary,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
      body: state.isLoading
          ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
          : state.errorMessage != null &&
                  state.requests.isEmpty &&
                  state.offers.isEmpty
              ? _buildErrorView(state.errorMessage!)
              : RefreshIndicator(
                  color: AppColors.primary,
                  backgroundColor: AppColors.surfaceLowest,
                  onRefresh: () =>
                      ref.read(swapsControllerProvider.notifier).loadSwaps(),
                  child: ListView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    padding: const EdgeInsets.only(top: 20, bottom: 32),
                    children: [
                      // User header section
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: _buildUserHeader(user?.name ?? 'جار حارتنا'),
                      ),
                      const SizedBox(height: 20),
                      // Navigation tabs
                      _buildTabs(),
                      const SizedBox(height: 16),
                      // Swap cards
                      if (swaps.isEmpty)
                        _buildEmptyState()
                      else
                        ...swaps.map((swap) => Padding(
                              padding:
                                  const EdgeInsets.symmetric(horizontal: 16),
                              child: SwapCard(
                                swap: swap,
                                isLender: swap.isLender,
                                isUpdating: state.isUpdating,
                                onStatusChange: (status) =>
                                    _handleStatusChange(swap.id, status),
                              ),
                            )),
                    ],
                  ),
                ),
    );
  }

  Widget _buildUserHeader(String name) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.surfaceLowest,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: AppColors.border.withValues(alpha: 0.2),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 6,
          ),
        ],
      ),
      child: Stack(
        children: [
          // Decorative top strip
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            height: 90,
            child: Container(
              decoration: BoxDecoration(
                color: AppColors.primary.withValues(alpha: 0.05),
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(16),
                ),
              ),
            ),
          ),
          Column(
            children: [
              const SizedBox(height: 12),
              // Avatar & verified badge
              Stack(
                clipBehavior: Clip.none,
                children: [
                  Container(
                    width: 96,
                    height: 96,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: AppColors.primary.withValues(alpha: 0.1),
                      border: Border.all(color: AppColors.surface, width: 4),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.12),
                          blurRadius: 8,
                        ),
                      ],
                    ),
                    child: const Icon(
                      Icons.person_rounded,
                      size: 44,
                      color: AppColors.primary,
                    ),
                  ),
                  Positioned(
                    bottom: -4,
                    left: -4,
                    child: Container(
                      padding: const EdgeInsets.all(4),
                      decoration: BoxDecoration(
                        color: AppColors.primary,
                        shape: BoxShape.circle,
                        border: Border.all(color: AppColors.surface, width: 2),
                      ),
                      child: const Icon(
                        Icons.verified_rounded,
                        size: 16,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Text(
                name,
                style: GoogleFonts.cairo(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'عضو في حارتنا • دمشق',
                style: GoogleFonts.cairo(
                  fontSize: 14,
                  color: AppColors.textSecondary,
                ),
              ),
              const SizedBox(height: 16),
              // Impact metrics
              Row(
                children: [
                  Expanded(
                    child: _buildMetricTile(
                      value: '٢٤',
                      label: 'أغراض تمت إعارتها',
                      color: AppColors.primary,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildMetricTile(
                      value: '١٥',
                      label: 'مرات المساعدة',
                      color: AppColors.secondary,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildMetricTile(
                      value: '٤.٩',
                      label: 'نقاط الثقة',
                      color: AppColors.primary,
                      showStar: true,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMetricTile({
    required String value,
    required String label,
    required Color color,
    bool showStar = false,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 8),
      decoration: BoxDecoration(
        color: AppColors.surfaceLow,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border.withValues(alpha: 0.3)),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                value,
                style: GoogleFonts.cairo(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: color,
                ),
              ),
              if (showStar) ...[
                const SizedBox(width: 2),
                Icon(Icons.star_rounded, size: 16, color: color),
              ],
            ],
          ),
          const SizedBox(height: 4),
          Text(
            label,
            textAlign: TextAlign.center,
            style: GoogleFonts.cairo(
              fontSize: 11,
              color: AppColors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTabs() {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: _tabLabels.asMap().entries.map((entry) {
          final isSelected = entry.key == _tabIndex;
          return GestureDetector(
            onTap: () => setState(() => _tabIndex = entry.key),
            child: Column(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 20,
                    vertical: 10,
                  ),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? AppColors.primaryContainer
                        : Colors.transparent,
                    borderRadius: const BorderRadius.vertical(
                      top: Radius.circular(12),
                    ),
                  ),
                  child: Text(
                    entry.value,
                    style: GoogleFonts.cairo(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      color: isSelected
                          ? AppColors.onPrimaryContainer
                          : AppColors.textSecondary,
                    ),
                  ),
                ),
                Container(
                  height: 2,
                  width: 60,
                  color: isSelected ? AppColors.primary : Colors.transparent,
                ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 48),
      child: Column(
        children: [
          Icon(
            Icons.handshake_outlined,
            size: 64,
            color: AppColors.textMuted.withValues(alpha: 0.5),
          ),
          const SizedBox(height: 16),
          Text(
            'لا توجد عناصر في هذا التبويب حالياً',
            style: GoogleFonts.cairo(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            'عندما تبدأ معاملة إعارة أو تبرع مع الجيران ستظهر هنا',
            style: GoogleFonts.cairo(
              fontSize: 13,
              color: AppColors.textSecondary,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildErrorView(String message) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.error_outline,
              size: 48,
              color: AppColors.error,
            ),
            const SizedBox(height: 16),
            Text(
              message,
              style: const TextStyle(
                color: AppColors.textSecondary,
                fontSize: 14,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () =>
                  ref.read(swapsControllerProvider.notifier).loadSwaps(),
              child: const Text('إعادة المحاولة'),
            ),
          ],
        ),
      ),
    );
  }
}
