import 'package:flutter/material.dart';

/// Stitch design system palette for Haretna.
///
/// Source of truth: the Stitch project "Haretna Community Aid Hub"
/// (Material 3, light mode, custom color #2e7d32, roundness 8).
/// Mirrored from the exported design HTML in docs/stitch_design_clean.
class AppColors {
  AppColors._();

  // ── Primary brand palette (Haretna green) ────────────────────────────
  static const Color primary = Color(0xFF2E7D32);          // primary-app brand green
  static const Color primaryDeep = Color(0xFF0D631B);      // dark green for text/icon accents
  static const Color primaryContainer = Color(0xFF2E7D32); // selected chip / pill background
  static const Color onPrimaryContainer = Color(0xFFCBFFC2);
  static const Color primaryLight = Color(0xFF88D982);     // primary-fixed-dim
  static const Color primarySurface = Color(0xFFCBFFC2);   // light green tint surface
  static const Color primaryTint = Color(0xFF1B6D24);      // surface-tint / success

  // ── Secondary & Accents (warm amber/orange) ──────────────────────────
  static const Color accent = Color(0xFFFC820C);           // secondary-container / urgent orange
  static const Color accentOnContainer = Color(0xFF5E2C00);
  static const Color secondary = Color(0xFF954A00);        // deep orange-brown
  static const Color urgent = Color(0xFFFC820C);

  // ── Neutral palette (Material 3 olive-tinted surfaces) ───────────────
  static const Color background = Color(0xFFF7FBF0);
  static const Color surface = Color(0xFFF7FBF0);
  static const Color surfaceLowest = Color(0xFFFFFFFF);    // cards
  static const Color surfaceLow = Color(0xFFF1F5EB);
  static const Color surfaceContainer = Color(0xFFEBEFE5);
  static const Color surfaceHigh = Color(0xFFE5EADF);
  static const Color surfaceHighest = Color(0xFFE0E4DA);
  static const Color surfaceVariant = Color(0xFFE0E4DA);

  static const Color textPrimary = Color(0xFF181D17);      // on-surface
  static const Color textSecondary = Color(0xFF40493D);    // on-surface-variant
  static const Color textMuted = Color(0xFF707A6C);        // outline
  static const Color border = Color(0xFFBFCABA);           // outline-variant
  static const Color borderStrong = Color(0xFF707A6C);     // outline

  // ── Semantic status colors ───────────────────────────────────────────
  static const Color success = Color(0xFF1B6D24);
  static const Color error = Color(0xFFBA1A1A);
  static const Color errorContainer = Color(0xFFFFDAD6);
  static const Color onErrorContainer = Color(0xFF93000A);
  static const Color warning = Color(0xFFFC820C);
  static const Color info = Color(0xFF2E7D32);

  // ── Special Stitch surfaces ──────────────────────────────────────────
  static const Color urgentHeroBg = Color(0xFFFFF3E0);     // urgent support banner
  static const Color urgentHeroTitle = Color(0xFF954A00);
  static const Color urgentCardBg = Color(0xFFFFF8F6);     // urgent request card
  static const Color giftCardBg = Color(0xFFFFF9F2);       // gift card tint
}
