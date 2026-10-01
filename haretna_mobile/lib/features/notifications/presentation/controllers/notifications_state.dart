import '../../domain/entities/notification_item.dart';

class NotificationsState {
  final bool isLoading;
  final bool isActionLoading;
  final String? errorMessage;
  final List<NotificationItem> notifications;

  const NotificationsState({
    this.isLoading = false,
    this.isActionLoading = false,
    this.errorMessage,
    this.notifications = const [],
  });

  int get unreadCount => notifications.where((n) => !n.isRead).length;

  NotificationsState copyWith({
    bool? isLoading,
    bool? isActionLoading,
    String? errorMessage,
    List<NotificationItem>? notifications,
    bool clearError = false,
  }) {
    return NotificationsState(
      isLoading: isLoading ?? this.isLoading,
      isActionLoading: isActionLoading ?? this.isActionLoading,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
      notifications: notifications ?? this.notifications,
    );
  }
}
