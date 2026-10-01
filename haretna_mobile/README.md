# Haretna Mobile (حارتنا - تطبيق الموبايل)

A modern, high-performance Flutter mobile application for the **Haretna** community aid and neighborhood collaboration platform.

## Architecture & Completed Features

This application is built using a strict **Feature-First (Clean Architecture)** design pattern with Riverpod state management and GoRouter:
- **`lib/core/`**: Shared singletons, ApiClient (Dio), AuthInterceptor, SecureStorage, AppTheme (Cairo & Tajawal typography), AppColors design tokens, StatefulShellRoute GoRouter setup.
- **`lib/features/auth/`**: Authentication (Login, Register, Session restoration, and Logout).
- **`lib/features/posts/`**: Community Feed, dynamic search, category & type filters, infinite scroll pagination, and interactive post creation bottom sheet.
- **`lib/features/profile/`**: User Profile, Trust Points counter, ratings, profile update form, and avatar upload directly connected to backend storage.
- **`lib/features/swaps/`**: "طلباتي" (My Swaps & Requests) tabbed view for borrower requests and lender offers, with full lifecycle status actions (قبول / إكمال / رفض / إلغاء).
- **`lib/features/notifications/`**: Notification center with unread counters, real-time unread badges on the bottom navigation bar, mark all as read, and swipe-to-dismiss.
- **`lib/features/home/`**: Bottom Navigation Bar powered by `StatefulShellRoute.indexedStack` enabling smooth, state-preserving switching between:
  1. الرئيسية (Home Feed)
  2. طلباتي (My Swaps & Offers)
  3. الإشعارات (Notifications with live badge)
  4. حسابي (Profile & Settings)
- **`lib/shared/`**: Reusable UI components (AppButton, AppToast, LoadingIndicator).

## Connecting to Backend

The app is pre-configured with dynamic base URL detection:
- **Android Emulator**: `http://10.0.2.2:3000/api`
- **iOS Simulator / Web / Desktop**: `http://localhost:3000/api`
- **Physical Device**: Specify your local LAN IP using `--dart-define`:
  ```bash
  flutter run --dart-define=API_URL=http://192.168.1.100:3000/api
  ```

## Getting Started

1. Fetch dependencies:
   ```bash
   flutter pub get
   ```

2. Run code analyzer to ensure 0 issues:
   ```bash
   dart analyze .
   ```

3. Run the mobile application:
   ```bash
   # Android / iOS / Chrome
   flutter run
   ```

4. Ensure the NestJS backend is running:
   ```bash
   cd ../backend
   npm run start:dev
   ```
