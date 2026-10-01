import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../core/constants/app_colors.dart';
import '../controllers/swaps_controller.dart';
import '../controllers/swaps_state.dart';
import '../widgets/swap_card.dart';

class MySwapsScreen extends ConsumerWidget {
  const MySwapsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final swapsState = ref.watch(swapsControllerProvider);
    final activeList = swapsState.currentList;

    ref.listen<SwapsState>(swapsControllerProvider, (_, next) {
      if (next.successMessage != null) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(next.successMessage!),
            backgroundColor: AppColors.success,
          ),
        );
        ref.read(swapsControllerProvider.notifier).clearMessages();
      }
      if (next.errorMessage != null) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(next.errorMessage!),
            backgroundColor: AppColors.error,
          ),
        );
        ref.read(swapsControllerProvider.notifier).clearMessages();
      }
    });

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'طلباتي ومبادلاتي',
          style: GoogleFonts.cairo(fontWeight: FontWeight.bold),
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Tabs Segment
            Container(
              margin: const EdgeInsets.all(16),
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: AppColors.border.withValues(alpha: 0.5),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: _buildTabButton(
                      ref: ref,
                      index: 0,
                      label: 'طلبات المساعدة',
                      badgeCount: swapsState.swaps.asBorrower.length,
                      isSelected: swapsState.selectedTabIndex == 0,
                    ),
                  ),
                  Expanded(
                    child: _buildTabButton(
                      ref: ref,
                      index: 1,
                      label: 'عروضي ومساهماتي',
                      badgeCount: swapsState.swaps.asLender.length,
                      isSelected: swapsState.selectedTabIndex == 1,
                    ),
                  ),
                ],
              ),
            ),

            // Content List
            Expanded(
              child: RefreshIndicator(
                color: AppColors.primary,
                onRefresh: () => ref.read(swapsControllerProvider.notifier).refreshMySwaps(),
                child: _buildContent(ref, swapsState, activeList),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTabButton({
    required WidgetRef ref,
    required int index,
    required String label,
    required int badgeCount,
    required bool isSelected,
  }) {
    return GestureDetector(
      onTap: () => ref.read(swapsControllerProvider.notifier).setTab(index),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(vertical: 10),
        decoration: BoxDecoration(
          color: isSelected ? Colors.white : Colors.transparent,
          borderRadius: BorderRadius.circular(9),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.05),
                    blurRadius: 4,
                    offset: const Offset(0, 2),
                  ),
                ]
              : null,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              label,
              style: GoogleFonts.cairo(
                fontSize: 13,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
                color: isSelected ? AppColors.primary : AppColors.textSecondary,
              ),
            ),
            if (badgeCount > 0) ...[
              const SizedBox(width: 6),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: isSelected ? AppColors.primary : AppColors.textMuted.withValues(alpha: 0.3),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  '$badgeCount',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    color: isSelected ? Colors.white : AppColors.textPrimary,
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildContent(WidgetRef ref, SwapsState state, List activeList) {
    if (state.isLoading) {
      return const Center(child: CircularProgressIndicator(color: AppColors.primary));
    }

    if (activeList.isEmpty) {
      return Center(
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
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
                child: const Icon(Icons.handshake_outlined, size: 48, color: AppColors.primary),
              ),
              const SizedBox(height: 16),
              Text(
                state.selectedTabIndex == 0
                    ? 'ليس لديك طلبات مساعدة نشطة حالياً'
                    : 'لم تقم بتقديم عروض مساعدة بعد',
                style: GoogleFonts.cairo(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                state.selectedTabIndex == 0
                    ? 'يمكنك إنشاء طلب مساعدة من الصفحة الرئيسية ليتعاون معك أهل حارتك'
                    : 'تصفح طلبات الجيران في الصفحة الرئيسية وقدم يد العون لتكسب نقاط ثقة مجتمعية',
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
      physics: const AlwaysScrollableScrollPhysics(),
      padding: const EdgeInsets.only(top: 8, bottom: 20),
      itemCount: activeList.length,
      itemBuilder: (context, index) {
        final swap = activeList[index];
        return SwapCard(
          swap: swap,
          onStatusUpdate: (newStatus) {
            ref.read(swapsControllerProvider.notifier).updateStatus(swap.id, newStatus);
          },
        );
      },
    );
  }
}
