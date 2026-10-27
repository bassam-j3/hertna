import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:haretna_mobile/core/constants/app_colors.dart';
import 'package:haretna_mobile/core/theme/app_theme.dart';

/// Verifies the Stitch design tokens are wired into the app theme.
void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  GoogleFonts.config.allowRuntimeFetching = false;
  group('AppColors (Stitch palette)', () {
    test('matches the Stitch design tokens', () {
      expect(AppColors.primary, const Color(0xFF2E7D32));
      expect(AppColors.primaryDeep, const Color(0xFF0D631B));
      expect(AppColors.background, const Color(0xFFF7FBF0));
      expect(AppColors.surfaceLowest, const Color(0xFFFFFFFF));
      expect(AppColors.surfaceLow, const Color(0xFFF1F5EB));
      expect(AppColors.secondary, const Color(0xFF954A00));
      expect(AppColors.accent, const Color(0xFFFC820C));
      expect(AppColors.error, const Color(0xFFBA1A1A));
      expect(AppColors.errorContainer, const Color(0xFFFFDAD6));
      expect(AppColors.textPrimary, const Color(0xFF181D17));
      expect(AppColors.textSecondary, const Color(0xFF40493D));
      expect(AppColors.border, const Color(0xFFBFCABA));
      expect(AppColors.urgentHeroBg, const Color(0xFFFFF3E0));
      expect(AppColors.urgentCardBg, const Color(0xFFFFF8F6));
    });
  });

  group('AppTheme (Stitch M3 theme)', () {
    testWidgets('light theme uses the green scheme and olive background',
        (tester) async {
      final theme = AppTheme.lightTheme;
      expect(theme.colorScheme.primary, AppColors.primary);
      expect(theme.scaffoldBackgroundColor, AppColors.background);
      expect(theme.appBarTheme.backgroundColor, AppColors.surface);
      expect(theme.appBarTheme.elevation, 0);
    });

    testWidgets('inputs use the Stitch 8dp rounded borders', (tester) async {
      final theme = AppTheme.lightTheme;
      final border = theme.inputDecorationTheme.border as OutlineInputBorder;
      expect(
        border.borderRadius,
        const BorderRadius.all(Radius.circular(8)),
      );
      expect(
        border.borderSide.color,
        AppColors.border,
      );
    });

    testWidgets('buttons use the Stitch 12dp rounded shape with green fill',
        (tester) async {
      final theme = AppTheme.lightTheme;
      final style = theme.elevatedButtonTheme.style!;
      final shape = style.shape!.resolve({}) as RoundedRectangleBorder;
      expect(
        shape.borderRadius,
        const BorderRadius.all(Radius.circular(12)),
      );
      expect(style.backgroundColor!.resolve({}), AppColors.primary);
    });

    testWidgets('cards use white surface with 12dp radius', (tester) async {
      final theme = AppTheme.lightTheme;
      expect(theme.cardTheme.color, AppColors.surfaceLowest);
      final shape = theme.cardTheme.shape as RoundedRectangleBorder;
      expect(
        shape.borderRadius,
        const BorderRadius.all(Radius.circular(12)),
      );
    });
  });
}
