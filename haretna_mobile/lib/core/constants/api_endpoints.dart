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

  // Posts Endpoints (matching NestJS PostsController)
  static const String posts = '/posts';
  static String postDetail(String id) => '/posts/$id';

  // Profile & User Endpoints (matching NestJS UsersController)
  static const String updateProfile = '/users/me';
  static const String uploadAvatar = '/users/me/avatar';

  // Swaps Endpoints (matching NestJS SwapsController)
  static const String swaps = '/swaps';
  static const String mySwaps = '/swaps/my-swaps';
  static String updateSwapStatus(String id) => '/swaps/$id/status';

  // Notifications Endpoints (matching NestJS NotificationsController)
  static const String notifications = '/notifications';
  static String markNotificationRead(String id) => '/notifications/$id/read';
  static const String markAllNotificationsRead = '/notifications/read-all';

  // Request timeouts
  static const Duration connectTimeout = Duration(seconds: 15);
  static const Duration receiveTimeout = Duration(seconds: 15);
}
