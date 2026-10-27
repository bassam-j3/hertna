import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../core/constants/app_colors.dart';
import '../../../../shared/widgets/app_button.dart';
import '../controllers/auth_controller.dart';
import '../controllers/auth_state.dart';
import '../widgets/auth_text_field.dart';

/// Login screen redesigned to match the Stitch web login page ("صفحة تسجيل الدخول والربط").
///
/// Mirrors the web modal: phone/password login with city & neighborhood, plus
/// quick-login preset accounts. Uses Haretna green primary (#2E7D32), Cairo font,
/// rounded-xl fields, soft error banners, and RTL Arabic layout.
class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;
  Timer? _errorDismissTimer;

  @override
  void dispose() {
    _phoneController.dispose();
    _passwordController.dispose();
    _errorDismissTimer?.cancel();
    super.dispose();
  }

  void _dismissErrorAfterDelay() {
    _errorDismissTimer?.cancel();
    _errorDismissTimer = Timer(const Duration(seconds: 6), () {
      if (mounted) {
        ref.read(authControllerProvider.notifier).clearError();
      }
    });
  }

  String? _validatePhone(String? val) {
    if (val == null || val.trim().isEmpty) {
      return 'يرجى إدخال رقم الهاتف';
    }
    if (val.trim().length < 8) {
      return 'رقم الهاتف غير صالح';
    }
    return null;
  }

  String? _validatePassword(String? val) {
    if (val == null || val.isEmpty) {
      return 'يرجى إدخال كلمة المرور';
    }
    if (val.length < 6) {
      return 'كلمة المرور يجب أن لا تقل عن 6 أحرف';
    }
    return null;
  }

  Future<void> _handleLogin() async {
    final phoneError = _validatePhone(_phoneController.text);
    final passwordError = _validatePassword(_passwordController.text);

    if (phoneError != null || passwordError != null) {
      ref.read(authControllerProvider.notifier).clearError();
      return;
    }

    final success = await ref.read(authControllerProvider.notifier).login(
      phone: _phoneController.text.trim(),
      password: _passwordController.text,
    );

    if (success && mounted) {
      context.go('/home');
    } else if (mounted) {
      _dismissErrorAfterDelay();
    }
  }

  Widget _buildQuickAccountCard({
    required String name,
    required String phone,
    required String city,
    required String neighborhood,
    required String avatarUrl,
  }) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.surfaceLowest,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: AppColors.primary.withValues(alpha: 0.25),
        ),
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(
                color: AppColors.primary.withValues(alpha: 0.5),
                width: 2,
              ),
              image: DecorationImage(
                image: NetworkImage(avatarUrl),
                fit: BoxFit.cover,
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  name,
                  style: GoogleFonts.cairo(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textPrimary,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.primary.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        city,
                        style: GoogleFonts.cairo(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: AppColors.primaryDeep,
                        ),
                      ),
                    ),
                    const SizedBox(width: 6),
                    const Text(' • ', style: TextStyle(color: AppColors.textMuted)),
                    Expanded(
                      child: Text(
                        neighborhood,
                        style: GoogleFonts.cairo(
                          fontSize: 11,
                          color: AppColors.textSecondary,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          AppButton(
            text: 'دخول',
            icon: Icons.login_rounded,
            onPressed: () async {
              final success = await ref
                  .read(authControllerProvider.notifier)
                  .login(phone: phone, password: 'password123');
              if (success && mounted) {
                context.go('/home');
              } else if (mounted) {
                _dismissErrorAfterDelay();
              }
            },
            isOutlined: false,
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authControllerProvider);
    final isLoading = authState.isLoading;
    final hasError =
        authState.status == AuthStatus.error && authState.errorMessage != null;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            // ── App Icon Header (matches Stitch "Brand Logo / Leading") ──
            Center(
              child: Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: AppColors.primarySurface,
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: AppColors.primaryLight.withValues(alpha: 0.35),
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.primary.withValues(alpha: 0.18),
                      blurRadius: 24,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: const Icon(
                  Icons.spa_rounded,
                  size: 64,
                  color: AppColors.primary,
                ),
              ),
            ),
            const SizedBox(height: 20),

            // ── Welcome Typography ──
            Text(
              'تسجيل الدخول',
              textAlign: TextAlign.center,
              style: GoogleFonts.cairo(
                fontSize: 26,
                fontWeight: FontWeight.bold,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'أهلاً بك مجدداً في حارتنا! يرجى إدخال بيانات حسابك',
              textAlign: TextAlign.center,
              style: GoogleFonts.tajawal(
                fontSize: 14,
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: 32),

            // ── Error / Network Banner ──
            if (hasError) ...[
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
                decoration: BoxDecoration(
                  color: AppColors.error.withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: AppColors.error.withValues(alpha: 0.35),
                  ),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    const Icon(
                      Icons.error_outline,
                      color: AppColors.error,
                      size: 22,
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        authState.errorMessage ??
                            'حدث خطأ أثناء تسجيل الدخول',
                        style: const TextStyle(
                          color: AppColors.error,
                          fontSize: 13,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    GestureDetector(
                      onTap: () {
                        ref
                            .read(authControllerProvider.notifier)
                            .clearError();
                        _errorDismissTimer?.cancel();
                      },
                      child: const Icon(
                        Icons.close,
                        color: AppColors.error,
                        size: 20,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
            ],

            // ── Phone Field ──
            AuthTextField(
              key: const Key('phone_field'),
              controller: _phoneController,
              label: 'رقم الهاتف',
              hint: '09xxxxxxxx',
              prefixIcon: Icons.phone_outlined,
              keyboardType: TextInputType.phone,
              validator: _validatePhone,
            ),
            const SizedBox(height: 18),

            // ── Password Field ──
            AuthTextField(
              key: const Key('password_field'),
              controller: _passwordController,
              label: 'كلمة المرور',
              hint: '••••••••',
              prefixIcon: Icons.lock_outline,
              obscureText: _obscurePassword,
              suffixIcon: IconButton(
                icon: Icon(
                  _obscurePassword
                      ? Icons.visibility_off_outlined
                      : Icons.visibility_outlined,
                  color: AppColors.textMuted,
                  size: 20,
                ),
                onPressed: () {
                  setState(() {
                    _obscurePassword = !_obscurePassword;
                  });
                },
              ),
              validator: _validatePassword,
            ),
            const SizedBox(height: 28),

            // ── Submit Button ──
            AppButton(
              text: 'تسجيل الدخول إلى حساب حارتنا',
              onPressed: isLoading ? null : _handleLogin,
              isLoading: isLoading,
              icon: Icons.login_rounded,
            ),
            const SizedBox(height: 24),

            // ── Switch to Register Screen ──
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  'ليس لديك حساب بعد؟ ',
                  style: GoogleFonts.tajawal(
                    fontSize: 14,
                    color: AppColors.textSecondary,
                  ),
                ),
                GestureDetector(
                  onTap: () {
                    ref
                        .read(authControllerProvider.notifier)
                        .clearError();
                    context.push('/register');
                  },
                  child: Text(
                    'أنشئ حساباً الآن',
                    style: GoogleFonts.cairo(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: AppColors.primary,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 32),

            // ── Quick Login preset accounts (web-style) ──
            Text(
              'أو دخول سريع بحساب جار مجاور',
              textAlign: TextAlign.center,
              style: GoogleFonts.tajawal(
                fontSize: 13,
                color: AppColors.textMuted,
              ),
            ),
            const SizedBox(height: 16),

            _buildQuickAccountCard(
              name: 'أبو أحمد الدمشقي',
              phone: '0933123456',
              city: 'دمشق',
              neighborhood: 'دمشق - حي الروضة',
              avatarUrl:
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuBdDg8GQS8VQaWBkK_vrXehNKikyg4-m55uQNje0-gXjTvf6QWv6aWwuv1ffy7tRthYcMFhfWNCCtoNYZEBFL5gJCLaXrBIZt6j4IgTagameWRZxP713yfm_RGj4rgfPYRmVz0CLsPsWIWMft6lXYDEWevCaPIhqi-tI6RsD2LcIeSFw4bsMAftwu6bMYX05KsOBOoTLRLNHtG5trrEEEj-nwUwPK8FRC53yaheQMD_5KPcstZZ3KMt',
            ),
            const SizedBox(height: 12),

            _buildQuickAccountCard(
              name: 'خالد الحمصي',
              phone: '0931112233',
              city: 'حمص',
              neighborhood: 'حمص - حي الإنشاءات',
              avatarUrl:
                  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
            ),
            const SizedBox(height: 12),

            _buildQuickAccountCard(
              name: 'أم حمزة الحموية',
              phone: '0942223344',
              city: 'حماة',
              neighborhood: 'حماة - حي الحاضر',
              avatarUrl:
                  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
            ),

            const SizedBox(height: 24),

            // ── Footer hint ──
            Text(
              'ندعم دمشق • حمص • حماة',
              textAlign: TextAlign.center,
              style: GoogleFonts.tajawal(
                fontSize: 12,
                color: AppColors.textMuted,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
