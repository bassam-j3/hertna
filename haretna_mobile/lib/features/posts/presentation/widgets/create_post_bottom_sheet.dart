import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_picker/image_picker.dart';

import '../../../../core/constants/app_colors.dart';
import '../../../auth/presentation/controllers/auth_controller.dart';
import '../controllers/posts_controller.dart';

/// Create-post bottom sheet matching the Stitch "Add Item / Request v2"
/// design: segmented type toggle, title, category, condition + loan-duration
/// stepper, image upload box and a full-width publish CTA.
class CreatePostBottomSheet extends ConsumerStatefulWidget {
  const CreatePostBottomSheet({super.key});

  static Future<void> show(BuildContext context) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      barrierColor: Colors.black.withValues(alpha: 0.4),
      builder: (_) => const CreatePostBottomSheet(),
    );
  }

  @override
  ConsumerState<CreatePostBottomSheet> createState() =>
      _CreatePostBottomSheetState();
}

class _CreatePostBottomSheetState extends ConsumerState<CreatePostBottomSheet> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();

  // 'loan' | 'gift' | 'request'
  String _postKind = 'loan';
  String _category = 'أدوات';
  String _condition = 'ممتاز';
  int _durationDays = 3;
  bool _urgent = false;
  bool _isSubmitting = false;
  String? _imagePath;

  // Backend category keys (same set the home CategorySelector filters by),
  // with Stitch-style display labels.
  final List<({String key, String label})> _categories = [
    (key: 'أدوات', label: 'أدوات ومعدات'),
    (key: 'تعليمي', label: 'كتب وتعليم'),
    (key: 'غذائي', label: 'طعام ومؤن'),
    (key: 'صحي', label: 'رعاية صحية'),
    (key: 'ملابس', label: 'ألبسة وكسوة'),
    (key: 'أخرى', label: 'أخرى'),
  ];

  final List<String> _conditions = ['ممتاز', 'جيد جداً', 'جيد', 'مقبول'];

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  bool get _isRequest => _postKind == 'request';

  String get _type => 'REQUEST'; // All posts are REQUEST (demand-driven)

  Future<void> _pickImage() async {
    final picker = ImagePicker();
    final picked = await picker.pickImage(
      source: ImageSource.gallery,
      maxWidth: 1280,
    );
    if (picked != null && mounted) {
      setState(() => _imagePath = picked.path);
    }
  }

  Future<void> _handleSubmit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSubmitting = true);

    final user = ref.read(authControllerProvider).user;
    final location =
        '${user?.city ?? "دمشق"} - ${user?.neighborhood ?? "حي الميدان"}';

    final success =
        await ref.read(postsControllerProvider.notifier).createPost(
              title: _titleController.text.trim(),
              description: _descriptionController.text.trim(),
              category: _category,
              type: _type,
              urgent: _isRequest && _urgent,
              location: location,
              image: _imagePath,
            );

    if (mounted) {
      setState(() => _isSubmitting = false);
      final messenger = ScaffoldMessenger.of(context);
      if (success) {
        Navigator.pop(context);
        messenger.showSnackBar(
          SnackBar(
            content: Text(
              _isRequest ? 'تم نشر طلب المساعدة بنجاح' : 'تم نشر المشاركة بنجاح',
              style: GoogleFonts.cairo(fontWeight: FontWeight.bold),
            ),
            backgroundColor: AppColors.success,
          ),
        );
      } else {
        messenger.showSnackBar(
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
    final bottomInset = MediaQuery.of(context).viewInsets.bottom;

    return Container(
      constraints: BoxConstraints(
        maxHeight: MediaQuery.of(context).size.height * 0.85,
      ),
      decoration: const BoxDecoration(
        color: AppColors.surfaceLow,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Drag handle
          Container(
            width: 48,
            height: 6,
            margin: const EdgeInsets.only(top: 12, bottom: 8),
            decoration: BoxDecoration(
              color: AppColors.border,
              borderRadius: BorderRadius.circular(999),
            ),
          ),
          // Header
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 4, 12, 12),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'إضافة مشاركة',
                  style: GoogleFonts.cairo(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primary,
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close_rounded, color: AppColors.textSecondary),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
          ),
          const Divider(height: 1),
          // Scrollable content
          Flexible(
            child: SingleChildScrollView(
              padding: EdgeInsets.only(
                left: 20,
                right: 20,
                top: 16,
                bottom: 16 + bottomInset,
              ),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    _buildKindToggle(),
                    const SizedBox(height: 20),
                    _buildLabeledField(
                      label: 'عنوان المشاركة',
                      child: TextFormField(
                        controller: _titleController,
                        textDirection: TextDirection.rtl,
                        decoration: const InputDecoration(
                          hintText: 'مثال: مثقاب كهربائي بحالة جيدة',
                        ),
                        validator: (val) {
                          if (val == null || val.trim().isEmpty) {
                            return 'يرجى كتابة العنوان';
                          }
                          if (val.trim().length < 3) {
                            return 'العنوان قصير جداً';
                          }
                          return null;
                        },
                      ),
                    ),
                    const SizedBox(height: 14),
                    _buildLabeledField(
                      label: 'التفاصيل',
                      child: TextFormField(
                        controller: _descriptionController,
                        textDirection: TextDirection.rtl,
                        maxLines: 3,
                        decoration: const InputDecoration(
                          hintText: 'اشرح التفاصيل لمساعدة الجيران في فهم الحالة...',
                        ),
                      ),
                    ),
                    const SizedBox(height: 14),
                    _buildLabeledField(
                      label: 'التصنيف',
                      child: DropdownButtonFormField<String>(
                        initialValue: _category,
                        decoration: const InputDecoration(),
                        items: _categories
                            .map((c) => DropdownMenuItem(
                                  value: c.key,
                                  child: Text(c.label),
                                ))
                            .toList(),
                        onChanged: (val) {
                          if (val != null) setState(() => _category = val);
                        },
                      ),
                    ),
                    const SizedBox(height: 14),
                    // Condition + loan duration
                    Row(
                      children: [
                        Expanded(
                          child: _buildLabeledField(
                            label: 'الحالة',
                            child: DropdownButtonFormField<String>(
                              initialValue: _condition,
                              decoration: const InputDecoration(),
                              items: _conditions
                                  .map((c) =>
                                      DropdownMenuItem(value: c, child: Text(c)))
                                  .toList(),
                              onChanged: (val) {
                                if (val != null) {
                                  setState(() => _condition = val);
                                }
                              },
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _buildLabeledField(
                            label: 'مدة الإعارة (أيام)',
                            child: Container(
                              height: 50,
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(color: AppColors.border),
                              ),
                              child: Row(
                                children: [
                                  _stepperButton(Icons.add_rounded, () {
                                    setState(() => _durationDays++);
                                  }),
                                  Expanded(
                                    child: Text(
                                      '$_durationDays',
                                      textAlign: TextAlign.center,
                                      style: GoogleFonts.cairo(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w500,
                                        color: AppColors.textPrimary,
                                      ),
                                    ),
                                  ),
                                  _stepperButton(Icons.remove_rounded, () {
                                    if (_durationDays > 1) {
                                      setState(() => _durationDays--);
                                    }
                                  }),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),
                    // Image upload box
                    _buildLabeledField(
                      label: 'الصور',
                      child: GestureDetector(
                        onTap: _pickImage,
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 20),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: AppColors.border,
                              width: 1.5,
                            ),
                          ),
                          child: Column(
                            children: [
                              const Icon(
                                Icons.add_photo_alternate_outlined,
                                size: 36,
                                color: AppColors.primary,
                              ),
                              const SizedBox(height: 8),
                              Text(
                                _imagePath == null
                                    ? 'اضغط هنا لإضافة صور'
                                    : 'تم اختيار صورة ✓ اضغط للتغيير',
                                style: GoogleFonts.cairo(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w500,
                                  color: AppColors.textPrimary,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'الحد الأقصى 3 صور (JPG, PNG)',
                                style: GoogleFonts.cairo(
                                  fontSize: 12,
                                  color: AppColors.textSecondary,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    // Urgent switch (requests only)
                    if (_isRequest) ...[
                      const SizedBox(height: 8),
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
                        value: _urgent,
                        onChanged: (val) => setState(() => _urgent = val),
                      ),
                    ],
                  ],
                ),
              ),
            ),
          ),
          // Footer CTA
          Container(
            padding: EdgeInsets.fromLTRB(20, 16, 20, 16 + bottomInset),
            decoration: const BoxDecoration(
              color: AppColors.surfaceLowest,
              borderRadius: BorderRadius.vertical(bottom: Radius.circular(24)),
            ),
            child: ElevatedButton.icon(
              onPressed: _isSubmitting ? null : _handleSubmit,
              icon: _isSubmitting
                  ? const SizedBox(
                      width: 18,
                      height: 18,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: Colors.white,
                      ),
                    )
                  : const Icon(Icons.my_location_rounded),
              label: Text(
                _isSubmitting ? 'جارٍ النشر...' : 'نشر في نطاق 4 كم',
                style: GoogleFonts.cairo(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                minimumSize: const Size.fromHeight(56),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildKindToggle() {
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: AppColors.surfaceVariant,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          _buildKindButton('loan', 'إعارة مجانية'),
          _buildKindButton('gift', 'تبرع نهائي'),
          _buildKindButton('request', 'طلب مساعدة'),
        ],
      ),
    );
  }

  Widget _buildKindButton(String kind, String label) {
    final isSelected = _postKind == kind;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _postKind = kind),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 180),
          padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 4),
          decoration: BoxDecoration(
            color: isSelected ? Colors.white : Colors.transparent,
            borderRadius: BorderRadius.circular(8),
            boxShadow: isSelected
                ? [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.08),
                      blurRadius: 4,
                    ),
                  ]
                : null,
          ),
          child: Text(
            label,
            textAlign: TextAlign.center,
            style: GoogleFonts.cairo(
              fontSize: 13,
              fontWeight: FontWeight.w500,
              color: isSelected ? AppColors.primary : AppColors.textSecondary,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildLabeledField({required String label, required Widget child}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: GoogleFonts.cairo(
            fontSize: 13,
            fontWeight: FontWeight.w500,
            color: AppColors.textSecondary,
          ),
        ),
        const SizedBox(height: 6),
        child,
      ],
    );
  }

  Widget _stepperButton(IconData icon, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Icon(icon, size: 20, color: AppColors.primary),
      ),
    );
  }
}
