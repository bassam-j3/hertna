import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../core/constants/app_colors.dart';
import '../controllers/profile_controller.dart';

class AvatarSelectorModal extends ConsumerWidget {
  const AvatarSelectorModal({super.key});

  static Future<void> show(BuildContext context) {
    return showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) => const AvatarSelectorModal(),
    );
  }

  // 1x1 transparent PNG fallback bytes for web/mobile upload demonstration
  static const List<int> _dummyPngBytes = [
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
    0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41,
    0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
    0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00,
    0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
    0x42, 0x60, 0x82,
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Container(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Center(
            child: Container(
              width: 36,
              height: 4,
              margin: const EdgeInsets.only(bottom: 16),
              decoration: BoxDecoration(
                color: AppColors.border,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          Text(
            'تغيير الصورة الشخصية',
            textAlign: TextAlign.center,
            style: GoogleFonts.cairo(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            'اختر رمزاً من رموز حارتنا أو قم برفع صورة جديدة',
            textAlign: TextAlign.center,
            style: GoogleFonts.tajawal(
              fontSize: 13,
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: 24),

          // Avatars Grid
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildAvatarOption(
                icon: Icons.holiday_village_rounded,
                label: 'بيت الشام',
                color: AppColors.primary,
                onTap: () async {
                  Navigator.pop(context);
                  await ref.read(profileControllerProvider.notifier).uploadAvatar(
                    _dummyPngBytes,
                    'avatar_house.png',
                  );
                },
              ),
              _buildAvatarOption(
                icon: Icons.spa_rounded,
                label: 'ياسمين',
                color: AppColors.primaryLight,
                onTap: () async {
                  Navigator.pop(context);
                  await ref.read(profileControllerProvider.notifier).uploadAvatar(
                    _dummyPngBytes,
                    'avatar_jasmine.png',
                  );
                },
              ),
              _buildAvatarOption(
                icon: Icons.volunteer_activism_rounded,
                label: 'معوان',
                color: AppColors.accent,
                onTap: () async {
                  Navigator.pop(context);
                  await ref.read(profileControllerProvider.notifier).uploadAvatar(
                    _dummyPngBytes,
                    'avatar_helper.png',
                  );
                },
              ),
              _buildAvatarOption(
                icon: Icons.security_rounded,
                label: 'عضو لجنة',
                color: AppColors.secondary,
                onTap: () async {
                  Navigator.pop(context);
                  await ref.read(profileControllerProvider.notifier).uploadAvatar(
                    _dummyPngBytes,
                    'avatar_committee.png',
                  );
                },
              ),
            ],
          ),
          const SizedBox(height: 20),
        ],
      ),
    );
  }

  Widget _buildAvatarOption({
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.12),
              shape: BoxShape.circle,
              border: Border.all(color: color.withValues(alpha: 0.4)),
            ),
            child: Icon(icon, color: color, size: 28),
          ),
          const SizedBox(height: 8),
          Text(
            label,
            style: GoogleFonts.cairo(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
        ],
      ),
    );
  }
}
