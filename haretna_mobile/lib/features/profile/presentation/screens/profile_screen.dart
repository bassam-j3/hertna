import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_picker/image_picker.dart';

import '../../../../core/constants/app_colors.dart';
import '../../../../shared/widgets/app_button.dart';
import '../../../auth/presentation/controllers/auth_controller.dart';
import '../../../auth/presentation/widgets/auth_text_field.dart';
import '../../../auth/presentation/widgets/city_neighborhood_picker.dart';
import '../controllers/profile_controller.dart';
import '../controllers/profile_state.dart';

/// Profile screen matching the Stitch "Haretna App" profile design:
/// white header card with bordered avatar, trusted-neighbor badge and
/// impact metric tiles, followed by info tiles and actions.
class ProfileScreen extends ConsumerStatefulWidget {
  const ProfileScreen({super.key});

  @override
  ConsumerState<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends ConsumerState<ProfileScreen> {
  void _showImagePickerSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.surfaceLowest,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (_) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 16),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'اختيار صورة للملف الشخصي',
                  style: GoogleFonts.cairo(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 12),
                ListTile(
                  leading: const Icon(Icons.photo_library_rounded, color: AppColors.primary),
                  title: const Text('المعرض (الصور)'),
                  onTap: () {
                    Navigator.pop(context);
                    ref.read(profileControllerProvider.notifier).pickAndUploadAvatar(ImageSource.gallery);
                  },
                ),
                ListTile(
                  leading: const Icon(Icons.camera_alt_rounded, color: AppColors.primary),
                  title: const Text('الكاميرا'),
                  onTap: () {
                    Navigator.pop(context);
                    ref.read(profileControllerProvider.notifier).pickAndUploadAvatar(ImageSource.camera);
                  },
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  void _showEditProfileSheet(BuildContext context, dynamic currentProfile) {
    final nameController = TextEditingController(text: currentProfile?.name ?? '');
    final phoneController = TextEditingController(text: currentProfile?.phone ?? '');
    String selectedCity = currentProfile?.city ?? 'دمشق';
    String selectedNeighborhood = currentProfile?.neighborhood ?? 'حي الميدان';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.surfaceLowest,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return Padding(
          padding: EdgeInsets.only(
            left: 20,
            right: 20,
            top: 20,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 20,
          ),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text(
                  'تعديل البيانات الشخصية',
                  style: GoogleFonts.cairo(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 16),
                AuthTextField(
                  controller: nameController,
                  label: 'الاسم الكامل',
                  hint: 'اسمك كما يظهر للجيران',
                  prefixIcon: Icons.person_outline,
                ),
                const SizedBox(height: 14),
                AuthTextField(
                  controller: phoneController,
                  label: 'رقم الهاتف',
                  hint: 'رقم هاتفك للتواصل',
                  prefixIcon: Icons.phone_outlined,
                  keyboardType: TextInputType.phone,
                ),
                const SizedBox(height: 16),
                CityNeighborhoodPicker(
                  initialCity: selectedCity,
                  initialNeighborhood: selectedNeighborhood,
                  onChanged: (city, neighborhood) {
                    selectedCity = city;
                    selectedNeighborhood = neighborhood;
                  },
                ),
                const SizedBox(height: 24),
                AppButton(
                  text: 'حفظ التعديلات',
                  icon: Icons.check_circle_outline_rounded,
                  onPressed: () async {
                    final messenger = ScaffoldMessenger.of(context);
                    Navigator.pop(ctx);
                    final success = await ref.read(profileControllerProvider.notifier).updateProfile(
                      name: nameController.text.trim(),
                      phone: phoneController.text.trim(),
                      city: selectedCity,
                      neighborhood: selectedNeighborhood,
                    );
                    if (success) {
                      messenger.showSnackBar(
                        const SnackBar(
                          content: Text('تم تحديث البيانات بنجاح!'),
                          backgroundColor: AppColors.success,
                        ),
                      );
                    }
                  },
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final profileState = ref.watch(profileControllerProvider);
    final profile = profileState.profile;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'حسابي',
          style: GoogleFonts.cairo(
            fontWeight: FontWeight.bold,
            color: AppColors.primary,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            tooltip: 'تحديث',
            onPressed: () =>
                ref.read(profileControllerProvider.notifier).loadProfile(),
          ),
        ],
      ),
      body: profileState.isLoading
          ? const Center(
              child: CircularProgressIndicator(color: AppColors.primary))
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  // ── Header card ─────────────────────────────────────
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(24),
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
                    child: Column(
                      children: [
                        // Avatar
                        Center(
                          child: Stack(
                            children: [
                              Container(
                                width: 96,
                                height: 96,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: AppColors.primary.withValues(alpha: 0.1),
                                  border: Border.all(
                                    color: AppColors.surface,
                                    width: 4,
                                  ),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black.withValues(alpha: 0.12),
                                      blurRadius: 8,
                                    ),
                                  ],
                                  image: (profile?.avatarUrl != null &&
                                          profile!.avatarUrl!.isNotEmpty)
                                      ? DecorationImage(
                                          image: NetworkImage(profile.avatarUrl!),
                                          fit: BoxFit.cover,
                                        )
                                      : null,
                                ),
                                child: (profile?.avatarUrl == null ||
                                        profile!.avatarUrl!.isEmpty)
                                    ? Text(
                                        (profile?.name.isNotEmpty ?? false)
                                            ? profile!.name.substring(0, 1)
                                            : 'ح',
                                        style: GoogleFonts.cairo(
                                          fontSize: 38,
                                          fontWeight: FontWeight.bold,
                                          color: AppColors.primary,
                                        ),
                                      )
                                    : null,
                              ),
                              if (profileState.status ==
                                  ProfileStatus.uploadingAvatar)
                                const Positioned.fill(
                                  child: Center(
                                    child: CircularProgressIndicator(
                                      color: Colors.white,
                                      strokeWidth: 2,
                                    ),
                                  ),
                                ),
                              Positioned(
                                bottom: 0,
                                right: 0,
                                child: GestureDetector(
                                  onTap: () => _showImagePickerSheet(context),
                                  child: Container(
                                    padding: const EdgeInsets.all(8),
                                    decoration: const BoxDecoration(
                                      color: AppColors.primary,
                                      shape: BoxShape.circle,
                                      boxShadow: [
                                        BoxShadow(
                                          color: Colors.black26,
                                          blurRadius: 4,
                                          offset: Offset(0, 2),
                                        ),
                                      ],
                                    ),
                                    child: const Icon(
                                      Icons.camera_alt_rounded,
                                      size: 18,
                                      color: Colors.white,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          profile?.name ?? 'أحد الجيران',
                          style: GoogleFonts.cairo(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(
                              Icons.verified_rounded,
                              size: 16,
                              color: AppColors.primary,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              profile?.trustBadge ?? 'جار موثوق',
                              style: GoogleFonts.cairo(
                                fontSize: 13,
                                fontWeight: FontWeight.w500,
                                color: AppColors.primary,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 20),
                        // Impact metric tiles
                        Row(
                          children: [
                            Expanded(
                              child: _buildStatTile(
                                'نقاط الثقة',
                                '${profile?.trustPoints ?? 0}',
                                color: AppColors.primary,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: _buildStatTile(
                                'المنشورات',
                                '${profile?.postsCount ?? 0}',
                                color: AppColors.primary,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: _buildStatTile(
                                'التقييمات',
                                '${profile?.receivedRatingsCount ?? 0}',
                                color: AppColors.secondary,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  // ── Info tiles ──────────────────────────────────────
                  Container(
                    decoration: BoxDecoration(
                      color: AppColors.surfaceLowest,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: AppColors.border.withValues(alpha: 0.3),
                      ),
                    ),
                    child: Column(
                      children: [
                        ListTile(
                          leading: const Icon(Icons.phone_outlined, color: AppColors.primary),
                          title: const Text('رقم الهاتف'),
                          subtitle: Text(profile?.phone ?? '-'),
                        ),
                        const Divider(height: 1),
                        ListTile(
                          leading: const Icon(Icons.location_on_outlined, color: AppColors.primary),
                          title: const Text('الحي والمدينة'),
                          subtitle: Text(
                              '${profile?.neighborhood ?? "-"}، ${profile?.city ?? "-"}'),
                        ),
                        const Divider(height: 1),
                        ListTile(
                          leading: const Icon(Icons.badge_outlined, color: AppColors.primary),
                          title: const Text('نوع العضوية'),
                          subtitle: Text(profile?.role ?? 'مقيم في الحي'),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  // ── Actions ─────────────────────────────────────────
                  AppButton(
                    text: 'تعديل البيانات الشخصية',
                    icon: Icons.edit_note_rounded,
                    isOutlined: true,
                    onPressed: () => _showEditProfileSheet(context, profile),
                  ),
                  const SizedBox(height: 12),
                  AppButton(
                    text: 'تسجيل الخروج',
                    icon: Icons.logout_rounded,
                    onPressed: () =>
                        ref.read(authControllerProvider.notifier).logout(),
                  ),
                  const SizedBox(height: 32),
                ],
              ),
            ),
    );
  }

  Widget _buildStatTile(String label, String value, {required Color color}) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 8),
      decoration: BoxDecoration(
        color: AppColors.surfaceLow,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border.withValues(alpha: 0.3)),
      ),
      child: Column(
        children: [
          Text(
            value,
            style: GoogleFonts.cairo(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: color,
            ),
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
}
