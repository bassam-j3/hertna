import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:haretna_mobile/core/router/app_router.dart';
import 'package:haretna_mobile/core/theme/app_theme.dart';
import 'package:haretna_mobile/features/auth/presentation/controllers/auth_controller.dart';
import 'package:haretna_mobile/features/posts/presentation/controllers/posts_controller.dart';
import 'package:haretna_mobile/features/profile/presentation/controllers/profile_controller.dart';
import 'package:haretna_mobile/features/swaps/presentation/controllers/swaps_controller.dart';

import 'fakes/fake_repositories.dart';

void main() {
  GoogleFonts.config.allowRuntimeFetching = false;

  List<Override> buildOverrides() => [
        authControllerProvider.overrideWith(
          (ref) => FakeAuthController(),
        ),
        postsControllerProvider.overrideWith(
          (ref) => PostsController(FakePostsRepository()),
        ),
        swapsControllerProvider.overrideWith(
          (ref) => SwapsController(repository: FakeSwapsRepository()),
        ),
        profileControllerProvider.overrideWith(
          (ref) => ProfileController(FakeProfileRepository()),
        ),
      ];

  Widget buildApp(ProviderContainer container) {
    return UncontrolledProviderScope(
      container: container,
      child: Consumer(
        builder: (context, ref, _) {
          // Watch the router so it is recreated when auth state changes,
          // exactly like HaretnaApp does in production.
          final router = ref.watch(appRouterProvider);
          return MaterialApp.router(
            title: 'حارتنا - Haretna',
            debugShowCheckedModeBanner: false,
            theme: AppTheme.lightTheme,
            routerConfig: router,
            locale: const Locale('ar'),
            supportedLocales: const [Locale('ar'), Locale('en')],
            localizationsDelegates: const [
              GlobalMaterialLocalizations.delegate,
              GlobalWidgetsLocalizations.delegate,
              GlobalCupertinoLocalizations.delegate,
            ],
          );
        },
      ),
    );
  }

  testWidgets('App boots, authenticates and lands on the Stitch home shell',
      (tester) async {
    tester.view.physicalSize = const Size(800, 1600);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.reset);

    final container = ProviderContainer(overrides: buildOverrides());
    addTearDown(container.dispose);

    await tester.pumpWidget(buildApp(container));
    await tester.pumpAndSettle();

    // Landed on home (splash redirected after fake session check)
    expect(find.text('دعم الأسر العائدة'), findsOneWidget);
    expect(find.text('حارتنا'), findsWidgets);

    // Bottom navigation per the Stitch design
    expect(find.text('الرئيسية'), findsOneWidget);
    expect(find.text('بحث'), findsOneWidget);
    expect(find.text('إضافة'), findsOneWidget);
    expect(find.text('مبادلاتي'), findsOneWidget);
    expect(find.text('حسابي'), findsOneWidget);
  });

  testWidgets('Bottom nav switches between branches', (tester) async {
    tester.view.physicalSize = const Size(800, 1600);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.reset);

    final container = ProviderContainer(overrides: buildOverrides());
    addTearDown(container.dispose);

    await tester.pumpWidget(buildApp(container));
    await tester.pumpAndSettle();

    // Go to map branch
    await tester.tap(find.text('بحث'));
    await tester.pumpAndSettle();
    expect(find.text('دمشق - حي الروضة'), findsOneWidget);

    // Go to swaps branch
    await tester.tap(find.text('مبادلاتي'));
    await tester.pumpAndSettle();
    expect(find.text('المعارات النشطة'), findsOneWidget);
    expect(find.text('نقاط الثقة'), findsOneWidget);

    // Go to profile branch
    await tester.tap(find.text('حسابي'));
    await tester.pumpAndSettle();
    expect(find.text('أحمد السوري'), findsOneWidget);
  });

  testWidgets('Add button opens the create-post bottom sheet', (tester) async {
    tester.view.physicalSize = const Size(800, 1600);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.reset);

    final container = ProviderContainer(overrides: buildOverrides());
    addTearDown(container.dispose);

    await tester.pumpWidget(buildApp(container));
    await tester.pumpAndSettle();

    await tester.tap(find.text('إضافة'));
    await tester.pumpAndSettle();

    expect(find.text('إضافة مشاركة'), findsOneWidget);
    expect(find.text('إعارة مجانية'), findsOneWidget);
    expect(find.text('نشر في نطاق 4 كم'), findsOneWidget);
  });
}
