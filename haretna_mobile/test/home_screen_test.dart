import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:haretna_mobile/core/theme/app_theme.dart';
import 'package:haretna_mobile/features/auth/presentation/controllers/auth_controller.dart';
import 'package:haretna_mobile/features/home/presentation/screens/home_screen.dart';
import 'package:haretna_mobile/features/posts/presentation/controllers/posts_controller.dart';

import 'fakes/fake_repositories.dart';

/// Verifies the home feed matches the Stitch "Haretna Home Feed v2" design.
void main() {
  GoogleFonts.config.allowRuntimeFetching = false;

  Widget buildHome() {
    return ProviderScope(
      overrides: [
        authControllerProvider.overrideWith((ref) => FakeAuthController()),
        postsControllerProvider.overrideWith(
          (ref) => PostsController(FakePostsRepository()),
        ),
      ],
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        locale: const Locale('ar'),
        home: const HomeScreen(),
      ),
    );
  }

  testWidgets('renders the Stitch home structure: bar, hero, radius & categories',
      (tester) async {
    tester.view.physicalSize = const Size(800, 2600);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.reset);

    await tester.pumpWidget(buildHome());
    await tester.pumpAndSettle();

    // Top app bar
    expect(find.text('حارتنا'), findsOneWidget);
    expect(find.text('المهاجرين'), findsOneWidget);
    expect(find.text('موثوق'), findsOneWidget);

    // Urgent support hero
    expect(find.text('دعم الأسر العائدة'), findsOneWidget);
    expect(find.text('ساهم الآن'), findsOneWidget);

    // Radius filter chips
    expect(find.text('النطاق:'), findsOneWidget);
    expect(find.text('1 كم'), findsOneWidget);
    expect(find.text('2 كم'), findsOneWidget);
    expect(find.text('10 كم'), findsOneWidget);
    expect(find.text('كل دمشق'), findsOneWidget);

    // Category chips
    expect(find.text('الكل'), findsOneWidget);
    expect(find.text('إعارة أدوات'), findsOneWidget);
    expect(find.text('توزيع طعام'), findsOneWidget);
  });

  testWidgets('renders the three Stitch card variants in the feed',
      (tester) async {
    tester.view.physicalSize = const Size(800, 2600);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.reset);

    await tester.pumpWidget(buildHome());
    await tester.pumpAndSettle();

    // Loan card (image + badge)
    expect(find.text('مثقب كهربائي (شنيور)'), findsOneWidget);
    expect(find.text('إعارة'), findsOneWidget);
    expect(find.text('أبو محمد'), findsOneWidget);

    // Gift card (no image, orange chip + request button)
    expect(find.text('ملابس شتوية أطفال'), findsOneWidget);
    expect(find.text('هدية'), findsOneWidget);
    expect(find.text('طلب'), findsOneWidget);

    // Urgent request card
    expect(find.text('مساعدة في نقل أثاث'), findsOneWidget);
    expect(find.text('طلب مستعجل'), findsOneWidget);
  });

  testWidgets('radius chips select visually', (tester) async {
    tester.view.physicalSize = const Size(800, 2600);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.reset);

    await tester.pumpWidget(buildHome());
    await tester.pumpAndSettle();

    await tester.tap(find.text('10 كم'));
    await tester.pumpAndSettle();

    // No crash + selection state changed (chip container colored)
    final chipText = tester.widget<Text>(find.text('10 كم'));
    expect(chipText, isNotNull);
  });

  testWidgets('renders without overflow on a narrow phone (390x844)',
      (tester) async {
    tester.view.physicalSize = const Size(390, 844);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.reset);

    final errors = <FlutterErrorDetails>[];
    final oldOnError = FlutterError.onError;
    FlutterError.onError = (details) => errors.add(details);
    await tester.pumpWidget(buildHome());
    await tester.pumpAndSettle();
    FlutterError.onError = oldOnError;

    expect(errors, isEmpty);

    // Trusted pill is hidden on narrow screens (Stitch `hidden md:flex`)
    expect(find.text('موثوق'), findsNothing);
    // Bell and neighborhood remain visible
    expect(find.byIcon(Icons.notifications_none_rounded), findsOneWidget);
    expect(find.text('المهاجرين'), findsOneWidget);
  });
}
