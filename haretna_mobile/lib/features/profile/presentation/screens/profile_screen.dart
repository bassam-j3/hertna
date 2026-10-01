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

class ProfileScreen extends ConsumerStatefulWidget {
  const ProfileScreen({super.key});

  @override
  ConsumerState<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends ConsumerState<ProfileScreen> {
  void _showImagePickerSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
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
          'الملف الشخصي',
          style: GoogleFonts.cairo(fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            tooltip: 'تحديث',
            onPressed: () => ref.read(profileControllerProvider.notifier).loadProfile(),
          ),
        ],
      ),
      body: profileState.isLoading
          ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  // Avatar Section
                  Center(
                    child: Stack(
                      children: [
                        CircleAvatar(
                          radius: 54,
                          backgroundColor: AppColors.primarySurface,
                          backgroundImage: (profile?.avatarUrl != null && profile!.avatarUrl!.isNotEmpty)
                              ? NetworkImage(profile.avatarUrl!)
                              : null,
                          child: (profile?.avatarUrl == null || profile!.avatarUrl!.isEmpty)
                              ? Text(
                                  (profile?.name.isNotEmpty ?? false) ? profile!.name.substring(0, 1) : 'ح',
                                  style: GoogleFonts.cairo(
                                    fontSize: 38,
                                    fontWeight: FontWeight.bold,
                                    color: AppColors.primary,
                                  ),
                                )
                              : null,
                        ),
                        if (profileState.status == ProfileStatus.uploadingAvatar)
                          Positioned.fill(
                            child: Container(
                              decoration: BoxDecoration(
                                color: Colors.black.withValues(alpha: 0.4),
                                shape: BoxShape.circle,
                              ),
                              child: const Center(
                                child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
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
                  const SizedBox(height: 12),

                  // Name & Trust Badge
                  Text(
                    profile?.name ?? 'أحد الجيران',
                    style: GoogleFonts.cairo(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.accent.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      profile?.trustBadge ?? 'عضو في الحارة',
                      style: GoogleFonts.cairo(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: AppColors.accent,
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Trust Points Highlight Card
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [AppColors.primary, AppColors.primaryDark],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.primary.withValues(alpha: 0.25),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _buildStatColumn('نقاط الثقة', '${profile?.trustPoints ?? 0}', Icons.star_rounded),
                        Container(width: 1, height: 40, color: Colors.white24),
                        _buildStatColumn('المنشورات', '${profile?.postsCount ?? 0}', Icons.post_add_rounded),
                        Container(width: 1, height: 40, color: Colors.white24),
                        _buildStatColumn('التقييمات', '${profile?.receivedRatingsCount ?? 0}', Icons.favorite_rounded),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Info Tiles
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.border),
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
                          subtitle: Text('${profile?.neighborhood ?? "-"}، ${profile?.city ?? "-"}'),
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

                  // Edit Profile Button
                  AppButton(
                    text: 'تعديل البيانات الشخصية',
                    icon: Icons.edit_note_rounded,
                    isOutlined: true,
                    onPressed: () => _showEditProfileSheet(context, profile),
                  ),
                  const SizedBox(height: 12),

                  // Logout Button
                  AppButton(
                    text: 'تسجيل الخروج',
                    icon: Icons.logout_rounded,
                    onPressed: () => ref.read(authControllerProvider.notifier).logout(),
                  ),
                  const SizedBox(height: 32),
                ],
              ),
            ),
    );
  }

  Widget _buildStatColumn(String label, String value, IconData icon) {
    return Column(
      children: [
        Icon(icon, color: Colors.white, size: 20),
        const SizedBox(height: 4),
        Text(
          value,
          style: GoogleFonts.cairo(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        Text(
          label,
          style: GoogleFonts.tajawal(
            fontSize: 12,
            color: Colors.white.withValues(alpha: 0.9),
          ),
        ),
      ],
    );
  }
}
