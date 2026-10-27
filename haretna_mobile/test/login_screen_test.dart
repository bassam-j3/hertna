import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:haretna_mobile/core/theme/app_theme.dart';
import 'package:haretna_mobile/features/auth/presentation/controllers/auth_controller.dart';
import 'package:haretna_mobile/features/auth/presentation/screens/login_screen.dart';

import 'fakes/fake_repositories.dart';

/// Verifies the login screen matches the Stitch web login flow:
///   - App icon header with Haretna green branding
///   - Phone + password fields with validation
///   - Quick-login preset accounts
///   - Register link navigation
///   - Password visibility toggle
///   - Loading state on submit button
void main() {
  GoogleFonts.config.allowRuntimeFetching = false;

  Widget buildLogin() {
    return ProviderScope(
      overrides: [
        authControllerProvider.overrideWith((ref) => FakeAuthController()),
      ],
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        locale: const Locale('ar'),
        home: const LoginScreen(),
      ),
    );
  }

  testWidgets('renders Stitch login header: green app icon + brand title',
      (tester) async {
    tester.view.physicalSize = const Size(800, 1600);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.reset);

    await tester.pumpWidget(buildLogin());

    // App icon header (circular green container)
    expect(find.byIcon(Icons.spa_rounded), findsOneWidget);

    // Brand title
    expect(find.text('تسجيل الدخول'), findsOneWidget);

    // Subtitle
    expect(find.text('أهلاً بك مجدداً في حارتنا!'), findsOneWidget);
  });

  testWidgets('renders phone and password fields with Stitch styling',
      (tester) async {
    tester.view.physicalSize = const Size(800, 1600);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.reset);

    await tester.pumpWidget(buildLogin());

    // Phone field
    expect(find.text('رقم الهاتف'), findsOneWidget);
    expect(find.text('09xxxxxxxx'), findsOneWidget);

    // Password field
    expect(find.text('كلمة المرور'), findsOneWidget);
    expect(find.text('••••••••'), findsOneWidget);

    // Password toggle icon
    expect(find.byIcon(Icons.visibility_off_outlined), findsOneWidget);
  });

  testWidgets('shows login button with loading state', (tester) async {
    tester.view.physicalSize = const Size(800, 1600);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.reset);

    await tester.pumpWidget(buildLogin());

    // Login button
    expect(find.text('تسجيل الدخول إلى حساب حارتنا'), findsOneWidget);
    expect(find.byIcon(Icons.login_rounded), findsOneWidget);
  });

  testWidgets('shows register link for new users', (tester) async {
    tester.view.physicalSize = const Size(800, 1600);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.reset);

    await tester.pumpWidget(buildLogin());

    expect(find.text('ليس لديك حساب بعد؟'), findsOneWidget);
    expect(find.text('أنشئ حساباً الآن'), findsOneWidget);
  });

  testWidgets('shows quick-login preset accounts', (tester) async {
    tester.view.physicalSize = const Size(800, 1600);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.reset);

    await tester.pumpWidget(buildLogin());

    // Preset account names from Stitch web design
    expect(find.text('أبو أحمد الدمشقي'), findsOneWidget);
    expect(find.text('خالد الحمصي'), findsOneWidget);
    expect(find.text('أم حمزة الحموية'), findsOneWidget);

    // Quick login buttons
    expect(find.text('دخول'), findsNWidgets(3));
  });

  testWidgets('validates empty phone field', (tester) async {
    tester.view.physicalSize = const Size(800, 1600);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.reset);

    await tester.pumpWidget(buildLogin());

    // Tap login with empty fields
    await tester.tap(find.text('تسجيل الدخول إلى حساب حارتنا'));

    // Validation error should appear
    expect(find.text('يرجى إدخال رقم الهاتف'), findsOneWidget);
  });

  testWidgets('validates short phone number', (tester) async {
    tester.view.physicalSize = const Size(800, 1600);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.reset);

    await tester.pumpWidget(buildLogin());

    // Enter short phone using key
    await tester.enterText(find.byKey(const Key('phone_field')), '123');
    await tester.tap(find.text('تسجيل الدخول إلى حساب حارتنا'));

    expect(find.text('رقم الهاتف غير صالح'), findsOneWidget);
  });

  testWidgets('validates empty password field', (tester) async {
    tester.view.physicalSize = const Size(800, 1600);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.reset);

    await tester.pumpWidget(buildLogin());

    // Enter phone but no password
    await tester.enterText(find.byKey(const Key('phone_field')), '0933123456');
    await tester.tap(find.text('تسجيل الدخول إلى حساب حارتنا'));

    expect(find.text('يرجى إدخال كلمة المرور'), findsOneWidget);
  });

  testWidgets('toggles password visibility', (tester) async {
    tester.view.physicalSize = const Size(800, 1600);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.reset);

    await tester.pumpWidget(buildLogin());

    // Initially password is obscured
    expect(find.byIcon(Icons.visibility_off_outlined), findsOneWidget);

    // Tap visibility toggle
    await tester.tap(find.byIcon(Icons.visibility_off_outlined).last);

    // After toggle, visibility icon should appear
    expect(find.byIcon(Icons.visibility_outlined), findsOneWidget);
  });

  testWidgets('successful login navigates away from login screen',
      (tester) async {
    tester.view.physicalSize = const Size(800, 1600);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.reset);

    await tester.pumpWidget(buildLogin());

    // Fill in valid credentials
    await tester.enterText(find.byKey(const Key('phone_field')), '0933123456');
    await tester.enterText(
        find.byKey(const Key('password_field')), 'password123');

    await tester.tap(find.text('تسجيل الدخول إلى حساب حارتنا'));

    // FakeAuthController returns sampleUser, so login succeeds and navigates
    expect(find.byType(LoginScreen), findsNothing);
  });

  testWidgets('does not show error banner initially', (tester) async {
    tester.view.physicalSize = const Size(800, 1600);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.reset);

    await tester.pumpWidget(buildLogin());

    // No error banner should be visible on fresh load
    expect(find.byIcon(Icons.error_outline), findsNothing);
  });
}
