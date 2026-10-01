import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../core/constants/app_colors.dart';
import '../../../../shared/widgets/app_button.dart';
import '../controllers/auth_controller.dart';
import '../controllers/auth_state.dart';
import '../widgets/auth_text_field.dart';
import '../widgets/city_neighborhood_picker.dart';

class RegisterScreen extends ConsumerStatefulWidget {
  const RegisterScreen({super.key});

  @override
  ConsumerState<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends ConsumerState<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();

  String _selectedCity = 'دمشق';
  String _selectedNeighborhood = 'الميدان';
  String _userType = 'resident';
  bool _obscurePassword = true;

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _handleRegister() async {
    if (!_formKey.currentState!.validate()) return;

    final success = await ref.read(authControllerProvider.notifier).register(
      name: _nameController.text.trim(),
      phone: _phoneController.text.trim(),
      password: _passwordController.text,
      city: _selectedCity,
      neighborhood: _selectedNeighborhood,
      userType: _userType,
    );

    if (success && mounted) {
      context.go('/home');
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authControllerProvider);
    final isLoading = authState.isLoading;

    return Scaffold(
      appBar: AppBar(
        title: const Text('إنشاء حساب جديد'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text(
                  'انضم إلى مجتمع حارتنا',
                  style: GoogleFonts.cairo(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  'سجّل لتتمكن من تقديم الطلبات أو المساعدة في حارتك',
                  style: GoogleFonts.tajawal(
                    fontSize: 14,
                    color: AppColors.textSecondary,
                  ),
                ),
                const SizedBox(height: 24),

                // Error Message Banner
                if (authState.status == AuthStatus.error && authState.errorMessage != null) ...[
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    decoration: BoxDecoration(
                      color: AppColors.error.withValues(alpha: 0.08),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppColors.error.withValues(alpha: 0.3)),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.error_outline, color: AppColors.error, size: 22),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            authState.errorMessage!,
                            style: const TextStyle(
                              color: AppColors.error,
                              fontSize: 13,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                ],

                // Full Name
                AuthTextField(
                  controller: _nameController,
                  label: 'الاسم الكامل',
                  hint: 'مثال: أحمد العلي',
                  prefixIcon: Icons.person_outline,
                  validator: (val) {
                    if (val == null || val.trim().isEmpty) {
                      return 'يرجى إدخال الاسم';
                    }
                    if (val.trim().length < 3) {
                      return 'الاسم يجب أن يكون 3 أحرف على الأقل';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),

                // Phone
                AuthTextField(
                  controller: _phoneController,
                  label: 'رقم الهاتف',
                  hint: '09xxxxxxxx',
                  prefixIcon: Icons.phone_outlined,
                  keyboardType: TextInputType.phone,
                  validator: (val) {
                    if (val == null || val.trim().isEmpty) {
                      return 'يرجى إدخال رقم الهاتف';
                    }
                    if (val.trim().length < 8) {
                      return 'رقم الهاتف غير صالح';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),

                // Password
                AuthTextField(
                  controller: _passwordController,
                  label: 'كلمة المرور',
                  hint: '••••••••',
                  prefixIcon: Icons.lock_outline,
                  obscureText: _obscurePassword,
                  suffixIcon: IconButton(
                    icon: Icon(
                      _obscurePassword ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                      color: AppColors.textMuted,
                      size: 20,
                    ),
                    onPressed: () {
                      setState(() {
                        _obscurePassword = !_obscurePassword;
                      });
                    },
                  ),
                  validator: (val) {
                    if (val == null || val.isEmpty) {
                      return 'يرجى إدخال كلمة المرور';
                    }
                    if (val.length < 6) {
                      return 'كلمة المرور يجب أن لا تقل عن 6 أحرف';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 20),

                // City & Neighborhood Cascading Selector
                CityNeighborhoodPicker(
                  initialCity: _selectedCity,
                  initialNeighborhood: _selectedNeighborhood,
                  onChanged: (city, neighborhood) {
                    _selectedCity = city;
                    _selectedNeighborhood = neighborhood;
                  },
                ),
                const SizedBox(height: 20),

                // User Type Selection
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'نوع العضوية',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 8),
                    DropdownButtonFormField<String>(
                      initialValue: _userType,
                      decoration: InputDecoration(
                        filled: true,
                        fillColor: Colors.white,
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: const BorderSide(color: AppColors.border),
                        ),
                      ),
                      items: const [
                        DropdownMenuItem(value: 'resident', child: Text('مقيم في الحي')),
                        DropdownMenuItem(value: 'returning', child: Text('عائد إلى الحي')),
                        DropdownMenuItem(value: 'donor', child: Text('متبرع / داعم')),
                        DropdownMenuItem(value: 'committee', child: Text('عضو لجنة أهلية')),
                      ],
                      onChanged: (val) {
                        if (val != null) {
                          setState(() {
                            _userType = val;
                          });
                        }
                      },
                    ),
                  ],
                ),
                const SizedBox(height: 32),

                // Submit Button
                AppButton(
                  text: 'إتمام التسجيل',
                  onPressed: isLoading ? null : _handleRegister,
                  isLoading: isLoading,
                  icon: Icons.person_add_alt_1_rounded,
                ),
                const SizedBox(height: 24),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
