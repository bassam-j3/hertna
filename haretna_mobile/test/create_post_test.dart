import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:haretna_mobile/core/theme/app_theme.dart';
import 'package:haretna_mobile/features/auth/presentation/controllers/auth_controller.dart';
import 'package:haretna_mobile/features/posts/presentation/controllers/posts_controller.dart';
import 'package:haretna_mobile/features/posts/presentation/widgets/create_post_bottom_sheet.dart';

import 'fakes/fake_repositories.dart';

/// Verifies the create-post sheet matches the Stitch "Add Item / Request v2"
/// design and that publishing works end-to-end with the fake backend.
void main() {
  GoogleFonts.config.allowRuntimeFetching = false;

  Widget buildSheetHost() {
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
        home: Scaffold(
          body: Builder(
            builder: (context) => Center(
              child: ElevatedButton(
                onPressed: () => CreatePostBottomSheet.show(context),
                child: const Text('فتح'),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Future<void> openSheet(WidgetTester tester) async {
    await tester.pumpWidget(buildSheetHost());
    await tester.tap(find.text('فتح'));
    await tester.pumpAndSettle();
  }

  testWidgets('renders the Stitch form: toggle, fields, stepper, upload, CTA',
      (tester) async {
    tester.view.physicalSize = const Size(800, 1600);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.reset);

    await openSheet(tester);

    expect(find.text('إضافة مشاركة'), findsOneWidget);

    // Segmented kind toggle
    expect(find.text('إعارة مجانية'), findsOneWidget);
    expect(find.text('تبرع نهائي'), findsOneWidget);
    expect(find.text('طلب مساعدة'), findsOneWidget);

    // Form fields
    expect(find.text('عنوان المشاركة'), findsOneWidget);
    expect(find.text('التفاصيل'), findsOneWidget);
    expect(find.text('التصنيف'), findsOneWidget);
    expect(find.text('الحالة'), findsOneWidget);
    expect(find.text('مدة الإعارة (أيام)'), findsOneWidget);
    expect(find.text('الصور'), findsOneWidget);
    expect(find.text('الحد الأقصى 3 صور (JPG, PNG)'), findsOneWidget);

    // CTA
    expect(find.text('نشر في نطاق 4 كم'), findsOneWidget);
  });

  testWidgets('publishing a loan post closes the sheet and shows success',
      (tester) async {
    tester.view.physicalSize = const Size(800, 1600);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.reset);

    await openSheet(tester);

    await tester.enterText(
      find.byType(TextFormField).first,
      'سلم معدني 3 أمتار',
    );
    await tester.tap(find.text('نشر في نطاق 4 كم'));
    await tester.pumpAndSettle();

    // Sheet closed and success snackbar shown
    expect(find.text('إضافة مشاركة'), findsNothing);
    expect(find.text('تم نشر المشاركة بنجاح'), findsOneWidget);
  });

  testWidgets('duration stepper increments and decrements', (tester) async {
    tester.view.physicalSize = const Size(800, 1600);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.reset);

    await openSheet(tester);

    expect(find.text('3'), findsOneWidget);

    await tester.tap(find.byIcon(Icons.add_rounded).last);
    await tester.pumpAndSettle();
    expect(find.text('4'), findsOneWidget);

    await tester.tap(find.byIcon(Icons.remove_rounded).last);
    await tester.pumpAndSettle();
    expect(find.text('3'), findsOneWidget);
  });

  testWidgets('category dropdown selects and keeps a value', (tester) async {
    tester.view.physicalSize = const Size(800, 1600);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.reset);

    await openSheet(tester);

    // Default category is أدوات ومعدات
    expect(find.text('أدوات ومعدات'), findsOneWidget);

    await tester.tap(find.text('أدوات ومعدات'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('رعاية صحية').last);
    await tester.pumpAndSettle();

    expect(find.text('رعاية صحية'), findsOneWidget);
  });
}
