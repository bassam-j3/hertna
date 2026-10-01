enum NotificationItemType {
  request,
  system,
  approval,
  urgent;

  static NotificationItemType fromString(String? val) {
    switch (val?.toUpperCase()) {
      case 'REQUEST':
        return NotificationItemType.request;
      case 'APPROVAL':
        return NotificationItemType.approval;
      case 'URGENT':
        return NotificationItemType.urgent;
      case 'SYSTEM':
      default:
        return NotificationItemType.system;
    }
  }

  String get label {
    switch (this) {
      case NotificationItemType.request:
        return 'طلب مساعدة / إعارة';
      case NotificationItemType.approval:
        return 'موافقة وقبول';
      case NotificationItemType.urgent:
        return 'عاجل';
      case NotificationItemType.system:
        return 'إشعار نظام';
    }
  }
}

class NotificationItem {
  final String id;
  final String title;
  final String message;
  final bool read;
  final NotificationItemType type;
  final DateTime createdAt;
  final String userId;

  const NotificationItem({
    required this.id,
    required this.title,
    required this.message,
    required this.read,
    required this.type,
    required this.createdAt,
    required this.userId,
  });

  NotificationItem copyWith({
    String? id,
    String? title,
    String? message,
    bool? read,
    NotificationItemType? type,
    DateTime? createdAt,
    String? userId,
  }) {
    return NotificationItem(
      id: id ?? this.id,
      title: title ?? this.title,
      message: message ?? this.message,
      read: read ?? this.read,
      type: type ?? this.type,
      createdAt: createdAt ?? this.createdAt,
      userId: userId ?? this.userId,
    );
  }
}
