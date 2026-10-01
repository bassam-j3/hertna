import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/repositories/notifications_repository_impl.dart';
import '../../domain/repositories/notifications_repository.dart';
import 'notifications_state.dart';

final notificationsControllerProvider =
    StateNotifierProvider<NotificationsController, NotificationsState>((ref) {
  final repository = ref.watch(notificationsRepositoryProvider);
  return NotificationsController(repository: repository);
});

class NotificationsController extends StateNotifier<NotificationsState> {
  final NotificationsRepository repository;

  NotificationsController({required this.repository}) : super(const NotificationsState()) {
    loadNotifications();
  }

  Future<void> loadNotifications() async {
    state = state.copyWith(status: NotificationsStatus.loading);
    try {
      final items = await repository.getNotifications();
      state = state.copyWith(
        status: NotificationsStatus.loaded,
        notifications: items,
      );
    } catch (e) {
      state = state.copyWith(
        status: NotificationsStatus.error,
        errorMessage: 'تعذر جلب الإشعارات: ${e.toString()}',
      );
    }
  }

  Future<void> refresh() async {
    try {
      final items = await repository.getNotifications();
      state = state.copyWith(
        status: NotificationsStatus.loaded,
        notifications: items,
      );
    } catch (e) {
      // Keep existing list on pull-to-refresh error
    }
  }

  void toggleUnreadFilter() {
    state = state.copyWith(filterUnreadOnly: !state.filterUnreadOnly);
  }

  Future<void> markAsRead(String id) async {
    try {
      await repository.markAsRead(id);
      final updatedList = state.notifications.map((n) {
        if (n.id == id) {
          return n.copyWith(read: true);
        }
        return n;
      }).toList();
      state = state.copyWith(notifications: updatedList);
    } catch (_) {}
  }

  Future<void> markAllAsRead() async {
    try {
      await repository.markAllAsRead();
      final updatedList = state.notifications.map((n) => n.copyWith(read: true)).toList();
      state = state.copyWith(notifications: updatedList);
    } catch (_) {}
  }

  Future<void> deleteNotification(String id) async {
    try {
      await repository.deleteNotification(id);
      final updatedList = state.notifications.where((n) => n.id != id).toList();
      state = state.copyWith(notifications: updatedList);
    } catch (_) {}
  }
}
