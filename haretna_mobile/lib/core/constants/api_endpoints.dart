import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;

class ApiEndpoints {
  ApiEndpoints._();

  /// Dynamic Base URL detection for Android Emulator (10.0.2.2), iOS Simulator (localhost),
  /// Web (localhost), and Physical Device via --dart-define=API_URL=...
  static String get baseUrl {
    const customUrl = String.fromEnvironment('API_URL');
    if (customUrl.isNotEmpty) {
      return customUrl;
    }

    if (kIsWeb) {
      return 'http://localhost:3000/api';
    }

    try {
      if (Platform.isAndroid) {
        return 'http://10.0.2.2:3000/api';
      }
    } catch (_) {
      // Fallback for non-standard environments
    }

    return 'http://localhost:3000/api';
  }

  // Auth Endpoints (matching NestJS AuthController)
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String profile = '/auth/me';

  // Request timeouts
  static const Duration connectTimeout = Duration(seconds: 15);
  static const Duration receiveTimeout = Duration(seconds: 15);
}
