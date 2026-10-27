import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:haretna_mobile/core/theme/app_theme.dart';
import 'package:haretna_mobile/features/auth/presentation/controllers/auth_controller.dart';
import 'package:haretna_mobile/features/swaps/domain/entities/swap.dart';
import 'package:haretna_mobile/features/swaps/presentation/controllers/swaps_controller.dart';
import 'package:haretna_mobile/features/swaps/presentation/screens/my_swaps_screen.dart';

import 'fakes/fake_repositories.dart';

/// Verifies the exchanges dashboard matches the Stitch "Exchanges Dashboard
/// v2" design.
void main() {
  GoogleFonts.config.allowRuntimeFetching = false;

  Widget buildSwaps({FakeSwapsRepository? repo}) {
    return ProviderScope(
      overrides: [
        authControllerProvider.overrideWith((ref) => FakeAuthController()),
        swapsControllerProvider.overrideWith(
          (ref) => SwapsController(
            repository: repo ?? FakeSwapsRepository(),
          ),
        ),
      ],
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        locale: const Locale('ar'),
        home: const MySwapsScreen(),
      ),
    );
  }

  testWidgets('renders user header, metrics and Stitch tabs', (tester) async {
    tester.view.physicalSize = const Size(800, 2200);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.reset);

    await tester.pumpWidget(buildSwaps());
    await tester.pumpAndSettle();

    // Header card
    expect(find.text('أبو محمد'), findsOneWidget);
    expect(find.text('أغراض تمت إعارتها'), findsOneWidget);
    expect(find.text('مرات المساعدة'), findsOneWidget);
    expect(find.text('نقاط الثقة'), findsOneWidget);

    // Tabs
    expect(find.text('المعارات النشطة'), findsOneWidget);
    expect(find.text('الطلبات المستلمة'), findsOneWidget);
    expect(find.text('الطلبات المرسلة'), findsOneWidget);
    expect(find.text('سجل التقييمات'), findsOneWidget);

    // Active-loan card (in_use → visible in first tab)
    expect(find.text('مثقاب كهربائي (دريل)'), findsOneWidget);
    expect(find.text('المستعير: رامي خ.'), findsOneWidget);
    expect(find.text('قيد الإعارة'), findsOneWidget);
    expect(find.text('تذكير بالإرجاع'), findsOneWidget);
  });

  testWidgets('switching tabs shows pending received requests', (tester) async {
    tester.view.physicalSize = const Size(800, 2200);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.reset);

    await tester.pumpWidget(buildSwaps());
    await tester.pumpAndSettle();

    // Pending card is not in the first tab
    expect(find.text('كراسي رحلات (عدد ٤)'), findsNothing);

    await tester.tap(find.text('الطلبات المستلمة'));
    await tester.pumpAndSettle();

    expect(find.text('كراسي رحلات (عدد ٤)'), findsOneWidget);
    expect(find.text('المستعير: عائلة محمد'), findsOneWidget);
    expect(find.text('قبول الطلب'), findsOneWidget);
    expect(find.text('رفض'), findsOneWidget);
  });

  testWidgets('rating-history tab shows completed swaps', (tester) async {
    tester.view.physicalSize = const Size(800, 2200);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.reset);

    final repo = FakeSwapsRepository(
      offers: const [
        SwapItemEntity(
          id: 's3',
          title: 'سلم خشبي (٣ متر)',
          status: 'completed',
          otherParty: SwapParty(id: 'b3', name: 'جابر م.'),
          isLender: true,
        ),
      ],
    );

    await tester.pumpWidget(buildSwaps(repo: repo));
    await tester.pumpAndSettle();

    // The tabs row overflows horizontally — scroll it to reveal the last tab
    await tester.drag(
      find.byType(SingleChildScrollView).first,
      const Offset(-250, 0),
    );
    await tester.pumpAndSettle();

    await tester.tap(find.text('سجل التقييمات'));
    await tester.pumpAndSettle();

    expect(find.text('سلم خشبي (٣ متر)'), findsOneWidget);
    expect(find.text('مكتمل'), findsOneWidget);
    expect(find.text('إرسال شكر'), findsOneWidget);
  });
}
