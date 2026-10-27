import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:haretna_mobile/core/theme/app_theme.dart';
import 'package:haretna_mobile/features/map/presentation/screens/map_screen.dart';
import 'package:haretna_mobile/features/posts/presentation/widgets/post_card.dart';
import 'package:haretna_mobile/features/posts/domain/entities/post.dart';

/// Verifies the map screen and the standalone post card variants.
void main() {
  GoogleFonts.config.allowRuntimeFetching = false;

  group('MapScreen (Stitch Neighborhood Map)', () {
    testWidgets('renders header, chips and item preview', (tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            debugShowCheckedModeBanner: false,
            theme: AppTheme.lightTheme,
            locale: const Locale('ar'),
            home: const MapScreen(),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('دمشق - حي الروضة'), findsOneWidget);
      expect(find.text('كل الأدوات'), findsOneWidget);
      expect(find.text('عدد وصيانة'), findsOneWidget);
      expect(find.text('طعام'), findsOneWidget);
      expect(find.text('طلبات عاجلة'), findsOneWidget);
      expect(find.text('سلم ألمنيوم 5 درجات'), findsOneWidget);
      expect(find.text('200 م'), findsOneWidget);
    });
  });

  group('PostCard variants', () {
    Widget wrap(Widget child) {
      return ProviderScope(
        child: MaterialApp(
          debugShowCheckedModeBanner: false,
          theme: AppTheme.lightTheme,
          locale: const Locale('ar'),
          home: Scaffold(
            body: SingleChildScrollView(child: child),
          ),
        ),
      );
    }

    testWidgets('loan card shows image badge, rating and chat action',
        (tester) async {
      final post = Post(
        id: 'p1',
        title: 'مثقب كهربائي (شنيور)',
        description: 'متوفر للإعارة لمدة يومين.',
        category: 'أدوات',
        type: 'OFFER',
        location: 'يبعد 1.2 كم',
        image: 'https://example.com/drill.png',
        createdAt: _created,
        userId: 'u1',
        user: const PostUser(id: 'u1', name: 'أبو محمد', trustPoints: 49),
      );

      await tester.pumpWidget(wrap(PostCard(post: post)));
      await tester.pumpAndSettle();

      expect(find.text('إعارة'), findsOneWidget);
      expect(find.text('مثقب كهربائي (شنيور)'), findsOneWidget);
      expect(find.text('49'), findsOneWidget);
      expect(find.text('أبو محمد'), findsOneWidget);
      expect(find.byIcon(Icons.chat_bubble_outline_rounded), findsOneWidget);
    });

    testWidgets('gift card shows orange chip and request button',
        (tester) async {
      final post = Post(
        id: 'p2',
        title: 'ملابس شتوية أطفال',
        description: 'ثلاث جاكيتات شتوية.',
        category: 'ملابس',
        type: 'OFFER',
        location: 'تبعد 0.8 كم',
        createdAt: _created,
        userId: 'u2',
        user: const PostUser(id: 'u2', name: 'أم سعيد'),
      );

      await tester.pumpWidget(wrap(PostCard(post: post)));
      await tester.pumpAndSettle();

      expect(find.text('هدية'), findsOneWidget);
      expect(find.text('طلب'), findsOneWidget);
      expect(find.byIcon(Icons.chat_bubble_outline_rounded), findsNothing);
    });

    testWidgets('urgent request card shows red label and handshake action',
        (tester) async {
      final post = Post(
        id: 'p3',
        title: 'مساعدة في نقل أثاث',
        description: 'نحتاج لشابين للمساعدة.',
        category: 'تطوع',
        type: 'REQUEST',
        urgent: true,
        location: 'يبعد 2.5 كم',
        createdAt: _created,
        userId: 'u3',
        user: const PostUser(id: 'u3', name: 'سامر'),
      );

      await tester.pumpWidget(wrap(PostCard(post: post)));
      await tester.pumpAndSettle();

      expect(find.text('طلب مستعجل'), findsOneWidget);
      expect(find.byIcon(Icons.handshake_rounded), findsOneWidget);
    });
  });
}

final _created = DateTime(2026, 10, 20);
