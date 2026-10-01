import '../../domain/entities/notification_item.dart';

enum NotificationsStatus { initial, loading, loaded, error }

class NotificationsState {
  final NotificationsStatus status;
  final List<NotificationItem> notifications;
  final bool filterUnreadOnly;
  final String? errorMessage;

  const NotificationsState({
    this.status = NotificationsStatus.initial,
    this.notifications = const [],
    this.filterUnreadOnly = false,
    this.errorMessage,
  });

  int get unreadCount => notifications.where((n) => !n.read).length;

  List<NotificationItem> get filteredNotifications {
    if (filterUnreadOnly) {
      return notifications.where((n) => !n.read).toList();
    }
    return notifications;
  }

  NotificationsState copyWith({
    NotificationsStatus? status,
    List<NotificationItem>? notifications,
    bool? filterUnreadOnly,
    String? errorMessage,
  }) {
    return NotificationsState(
      status: status ?? this.status,
      notifications: notifications ?? this.notifications,
      filterUnreadOnly: filterUnreadOnly ?? this.filterUnreadOnly,
      errorMessage: errorMessage,
    );
  }
}
