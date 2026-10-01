import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../core/constants/app_colors.dart';
import '../../../../shared/widgets/app_button.dart';
import '../../../auth/presentation/controllers/auth_controller.dart';
import '../controllers/posts_controller.dart';

class CreatePostBottomSheet extends ConsumerStatefulWidget {
  const CreatePostBottomSheet({super.key});

  static Future<void> show(BuildContext context) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => const CreatePostBottomSheet(),
    );
  }

  @override
  ConsumerState<CreatePostBottomSheet> createState() => _CreatePostBottomSheetState();
}

class _CreatePostBottomSheetState extends ConsumerState<CreatePostBottomSheet> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();

  String _type = 'REQUEST'; // 'REQUEST' or 'OFFER'
  String _category = 'صحي';
  bool _urgent = false;
  bool _isSubmitting = false;

  final List<String> _categories = [
    'صحي',
    'غذائي',
    'أدوات',
    'تعليمي',
    'ملابس',
    'أخرى',
  ];

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  Future<void> _handleSubmit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSubmitting = true);

    final user = ref.read(authControllerProvider).user;
    final location = '${user?.city ?? "دمشق"} - ${user?.neighborhood ?? "حي الميدان"}';

    final success = await ref.read(postsControllerProvider.notifier).createPost(
      title: _titleController.text.trim(),
      description: _descriptionController.text.trim(),
      category: _category,
      type: _type,
      urgent: _urgent,
      location: location,
    );

    if (mounted) {
      setState(() => _isSubmitting = false);
      if (success) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              _type == 'REQUEST' ? 'تم نشر طلب المساعدة بنجاح' : 'تم نشر عرض المساعدة بنجاح',
              style: GoogleFonts.cairo(fontWeight: FontWeight.bold),
            ),
            backgroundColor: AppColors.success,
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'تعذر نشر المنشور، يرجى المحاولة لاحقاً',
              style: GoogleFonts.cairo(fontWeight: FontWeight.bold),
            ),
            backgroundColor: AppColors.error,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: EdgeInsets.only(
        left: 20,
        right: 20,
        top: 20,
        bottom: MediaQuery.of(context).viewInsets.bottom + 20,
      ),
      child: Form(
        key: _formKey,
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Sheet Header
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  margin: const EdgeInsets.only(bottom: 16),
                  decoration: BoxDecoration(
                    color: AppColors.border,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'إضافة منشور مجتمعي جديد',
                    style: GoogleFonts.cairo(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close_rounded, color: AppColors.textMuted),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Type Selector: REQUEST or OFFER
              Row(
                children: [
                  Expanded(
                    child: ChoiceChip(
                      label: const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.volunteer_activism_rounded, size: 16),
                          SizedBox(width: 6),
                          Text('أحتاج مساعدة (طلب)'),
                        ],
                      ),
                      selected: _type == 'REQUEST',
                      selectedColor: AppColors.accent.withValues(alpha: 0.15),
                      labelStyle: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: _type == 'REQUEST' ? AppColors.accent : AppColors.textSecondary,
                      ),
                      onSelected: (val) {
                        if (val) setState(() => _type = 'REQUEST');
                      },
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: ChoiceChip(
                      label: const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.card_giftcard_rounded, size: 16),
                          SizedBox(width: 6),
                          Text('أود المساعدة (عرض)'),
                        ],
                      ),
                      selected: _type == 'OFFER',
                      selectedColor: AppColors.primary.withValues(alpha: 0.15),
                      labelStyle: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: _type == 'OFFER' ? AppColors.primary : AppColors.textSecondary,
                      ),
                      onSelected: (val) {
                        if (val) setState(() => _type = 'OFFER');
                      },
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Title Field
              TextFormField(
                controller: _titleController,
                textDirection: TextDirection.rtl,
                decoration: const InputDecoration(
                  labelText: 'عنوان المنشور',
                  hintText: 'مثال: حاجة عاجلة لدواء ضغط أو سلة غذائية',
                  prefixIcon: Icon(Icons.title_rounded, color: AppColors.primary),
                ),
                validator: (val) {
                  if (val == null || val.trim().isEmpty) {
                    return 'يرجى كتابة العنوان';
                  }
                  if (val.trim().length < 5) {
                    return 'العنوان يجب أن يكون 5 أحرف على الأقل';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 14),

              // Description Field
              TextFormField(
                controller: _descriptionController,
                textDirection: TextDirection.rtl,
                maxLines: 3,
                decoration: const InputDecoration(
                  labelText: 'التفاصيل والمعلومات الإضافية',
                  hintText: 'اشرح التفاصيل لمساعدة الجيران في فهم الحالة...',
                  prefixIcon: Icon(Icons.description_outlined, color: AppColors.primary),
                ),
              ),
              const SizedBox(height: 14),

              // Category Picker
              DropdownButtonFormField<String>(
                initialValue: _category,
                decoration: const InputDecoration(
                  labelText: 'تصنيف الخدمة أو العون',
                  prefixIcon: Icon(Icons.category_rounded, color: AppColors.primary),
                ),
                items: _categories.map((c) {
                  return DropdownMenuItem(
                    value: c,
                    child: Text(c),
                  );
                }).toList(),
                onChanged: (val) {
                  if (val != null) setState(() => _category = val);
                },
              ),
              const SizedBox(height: 12),

              // Urgent Switch
              if (_type == 'REQUEST') ...[
                SwitchListTile(
                  contentPadding: EdgeInsets.zero,
                  activeThumbColor: AppColors.error,
                  title: Row(
                    children: [
                      const Icon(Icons.bolt_rounded, color: AppColors.error, size: 20),
                      const SizedBox(width: 6),
                      Text(
                        'حالة طارئة وعاجلة',
                        style: GoogleFonts.cairo(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: AppColors.error,
                        ),
                      ),
                    ],
                  ),
                  subtitle: const Text('تظهر شارة حمراء واضحة في صدارة القائمة للفت انتباه الجيران'),
                  value: _urgent,
                  onChanged: (val) => setState(() => _urgent = val),
                ),
                const SizedBox(height: 12),
              ],

              // Submit Button
              AppButton(
                text: _type == 'REQUEST' ? 'نشر طلب المساعدة' : 'نشر عرض التبرع',
                isLoading: _isSubmitting,
                icon: Icons.send_rounded,
                onPressed: _handleSubmit,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
