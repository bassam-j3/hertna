import 'package:flutter/material.dart';

class AppColors {
  AppColors._();

  // Primary brand palette (Emerald & Syrian Olive)
  static const Color primary = Color(0xFF0D9488);        // Deep Teal/Emerald
  static const Color primaryDark = Color(0xFF0F766E);
  static const Color primaryLight = Color(0xFF14B8A6);
  static const Color primarySurface = Color(0xFFF0FDFA);

  // Secondary & Accents
  static const Color accent = Color(0xFFF59E0B);         // Warm Amber/Gold
  static const Color secondary = Color(0xFF6366F1);      // Indigo

  // Neutral palette
  static const Color background = Color(0xFFF8FAFC);     // Slate 50
  static const Color surface = Colors.white;
  static const Color textPrimary = Color(0xFF0F172A);    // Slate 900
  static const Color textSecondary = Color(0xFF475569);  // Slate 600
  static const Color textMuted = Color(0xFF94A3B8);      // Slate 400
  static const Color border = Color(0xFFE2E8F0);         // Slate 200

  // Semantic status colors
  static const Color success = Color(0xFF10B981);
  static const Color error = Color(0xFFEF4444);
  static const Color warning = Color(0xFFF59E0B);
  static const Color info = Color(0xFF3B82F6);
}
