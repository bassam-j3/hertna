# Haretna Mobile (حارتنا - تطبيق الموبايل)

A modern, high-performance Flutter mobile application for the **Haretna** community aid and neighborhood collaboration platform.

## Architecture

This application is built using a strict **Feature-First (Clean Architecture)** design pattern:
- **`lib/core/`**: Shared singletons, ApiClient (Dio), AuthInterceptor, SecureStorage, AppTheme (Cairo/Tajawal), GoRouter.
- **`lib/features/auth/`**: Complete domain, data, and presentation layers for Authentication (Login, Register, Session check, and Logout).
- **`lib/shared/`**: Common UI components (AppButton, AppToast, LoadingIndicator).

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

2. Run the mobile application:
   ```bash
   # Android / iOS / Chrome
   flutter run
   ```

3. Ensure the NestJS backend is running:
   ```bash
   cd ../backend
   npm run start:dev
   ```
