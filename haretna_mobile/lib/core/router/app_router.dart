import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../features/auth/presentation/controllers/auth_controller.dart';
import '../../features/auth/presentation/controllers/auth_state.dart';
import '../../features/auth/presentation/screens/login_screen.dart';
import '../../features/auth/presentation/screens/register_screen.dart';
import '../../features/auth/presentation/screens/splash_screen.dart';
import '../../features/home/presentation/screens/home_screen.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  // Use a Listenable that notifies whenever authControllerProvider changes
  final authNotifier = ValueNotifier<AuthState>(ref.watch(authControllerProvider));
  ref.listen<AuthState>(authControllerProvider, (_, next) {
    authNotifier.value = next;
  });

  return GoRouter(
    initialLocation: '/splash',
    refreshListenable: authNotifier,
    redirect: (BuildContext context, GoRouterState state) {
      final authState = authNotifier.value;
      final isAuth = authState.isAuthenticated;
      final isInitializing = authState.status == AuthStatus.initial ||
          (authState.status == AuthStatus.loading && state.matchedLocation == '/splash');

      final isGoingToSplash = state.matchedLocation == '/splash';
      final isGoingToLogin = state.matchedLocation == '/login';
      final isGoingToRegister = state.matchedLocation == '/register';

      // Still verifying session on startup
      if (isInitializing) {
        return isGoingToSplash ? null : '/splash';
      }

      // If user is NOT authenticated
      if (!isAuth) {
        // Allow public pages (Login, Register)
        if (isGoingToLogin || isGoingToRegister) {
          return null;
        }
        return '/login';
      }

      // If user IS authenticated and trying to access auth/splash pages, send to /home
      if (isGoingToLogin || isGoingToRegister || isGoingToSplash) {
        return '/home';
      }

      return null;
    },
    routes: [
      GoRoute(
        path: '/splash',
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/register',
        builder: (context, state) => const RegisterScreen(),
      ),
      GoRoute(
        path: '/home',
        builder: (context, state) => const HomeScreen(),
      ),
    ],
  );
});
