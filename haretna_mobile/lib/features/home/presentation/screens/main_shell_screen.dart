import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/constants/app_colors.dart';
import '../../../posts/presentation/widgets/create_post_bottom_sheet.dart';

/// Bottom navigation shell matching the Stitch "Haretna App" design:
/// surface/90 blurred bar with rounded top corners, green active tabs and a
/// raised circular green FAB for "إضافة".
class MainShellScreen extends ConsumerWidget {
  final StatefulNavigationShell navigationShell;

  const MainShellScreen({
    super.key,
    required this.navigationShell,
  });

  void _onTap(BuildContext context, int index) {
    if (index == 2) {
      // Add button
      CreatePostBottomSheet.show(context);
      return;
    }

    // Map index 3 to branch 2, index 4 to branch 3
    final branchIndex = index > 2 ? index - 1 : index;
    navigationShell.goBranch(
      branchIndex,
      initialLocation: branchIndex == navigationShell.currentIndex,
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Current branch index
    final currentIndex = navigationShell.currentIndex;
    // Map branch index to bottom bar index
    final activeIndex = currentIndex >= 2 ? currentIndex + 1 : currentIndex;

    return Scaffold(
      body: navigationShell,
      bottomNavigationBar: Container(
        height: 84,
        decoration: BoxDecoration(
          color: AppColors.surface.withValues(alpha: 0.9),
          borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
          border: Border(
            top: BorderSide(
              color: AppColors.border.withValues(alpha: 0.3),
            ),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 12,
              offset: const Offset(0, -4),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
            child: SafeArea(
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildNavItem(
                    icon: Icons.home_rounded,
                    outlineIcon: Icons.home_outlined,
                    label: 'الرئيسية',
                    isActive: activeIndex == 0,
                    onTap: () => _onTap(context, 0),
                  ),
                  _buildNavItem(
                    icon: Icons.search_rounded,
                    outlineIcon: Icons.search,
                    label: 'بحث',
                    isActive: activeIndex == 1,
                    onTap: () => _onTap(context, 1),
                  ),
                  _buildAddButton(onTap: () => _onTap(context, 2)),
                  _buildNavItem(
                    icon: Icons.swap_horiz_rounded,
                    outlineIcon: Icons.swap_horiz,
                    label: 'مبادلاتي',
                    isActive: activeIndex == 3,
                    onTap: () => _onTap(context, 3),
                  ),
                  _buildNavItem(
                    icon: Icons.person_rounded,
                    outlineIcon: Icons.person_outline,
                    label: 'حسابي',
                    isActive: activeIndex == 4,
                    onTap: () => _onTap(context, 4),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem({
    required IconData icon,
    required IconData outlineIcon,
    required String label,
    required bool isActive,
    required VoidCallback onTap,
  }) {
    final color = isActive ? AppColors.primary : AppColors.textSecondary;

    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Container(
        padding: const EdgeInsets.only(top: 10),
        width: 64,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              isActive ? icon : outlineIcon,
              color: color,
              size: 24,
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                fontWeight: isActive ? FontWeight.w700 : FontWeight.w500,
                color: color,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAddButton({required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Container(
        width: 64,
        transform: Matrix4.translationValues(0, -14, 0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: AppColors.primary,
                shape: BoxShape.circle,
                border: Border.all(color: AppColors.surface, width: 4),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.2),
                    blurRadius: 6,
                    offset: const Offset(0, 3),
                  ),
                ],
              ),
              child: const Icon(
                Icons.add_rounded,
                size: 28,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 4),
            const Text(
              'إضافة',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w500,
                color: AppColors.textSecondary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
