import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/repositories/notifications_repository_impl.dart';
import '../../domain/repositories/notifications_repository.dart';
import 'notifications_state.dart';

final notificationsControllerProvider = StateNotifierProvider<
    NotificationsController, NotificationsState>((ref) {
  final repository = ref.watch(notificationsRepositoryProvider);
  return NotificationsController(repository: repository);
});

class NotificationsController extends StateNotifier<NotificationsState> {
  final NotificationsRepository repository;

  NotificationsController({required this.repository})
      : super(const NotificationsState()) {
    loadNotifications();
  }

  Future<void> loadNotifications() async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final list = await repository.getNotifications();
      state = state.copyWith(
        isLoading: false,
        notifications: list,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: e.toString().replaceFirst('Exception: ', ''),
      );
    }
  }

  Future<void> markAsRead(String id) async {
    try {
      await repository.markAsRead(id);
      final updated = state.notifications.map((n) {
        return n.id == id ? n.copyWith(isRead: true) : n;
      }).toList();
      state = state.copyWith(notifications: updated);
    } catch (e) {
      state = state.copyWith(
        errorMessage: e.toString().replaceFirst('Exception: ', ''),
      );
    }
  }

  Future<void> markAllAsRead() async {
    state = state.copyWith(isActionLoading: true, clearError: true);
    try {
      await repository.markAllAsRead();
      final updated = state.notifications.map((n) {
        return n.copyWith(isRead: true);
      }).toList();
      state = state.copyWith(
        isActionLoading: false,
        notifications: updated,
      );
    } catch (e) {
      state = state.copyWith(
        isActionLoading: false,
        errorMessage: e.toString().replaceFirst('Exception: ', ''),
      );
    }
  }

  Future<void> deleteNotification(String id) async {
    try {
      await repository.deleteNotification(id);
      final updated = state.notifications.where((n) => n.id != id).toList();
      state = state.copyWith(notifications: updated);
    } catch (e) {
      state = state.copyWith(
        errorMessage: e.toString().replaceFirst('Exception: ', ''),
      );
    }
  }

  Future<void> clearAll() async {
    state = state.copyWith(isActionLoading: true, clearError: true);
    try {
      await repository.clearAllNotifications();
      state = state.copyWith(
        isActionLoading: false,
        notifications: const [],
      );
    } catch (e) {
      state = state.copyWith(
        isActionLoading: false,
        errorMessage: e.toString().replaceFirst('Exception: ', ''),
      );
    }
  }
}
