import '../../domain/entities/notification_item.dart';

class NotificationModel extends NotificationItem {
  const NotificationModel({
    required super.id,
    required super.title,
    required super.message,
    required super.read,
    required super.type,
    required super.createdAt,
    required super.userId,
  });

  factory NotificationModel.fromJson(Map<String, dynamic> json) {
    return NotificationModel(
      id: json['id'] as String? ?? '',
      title: json['title'] as String? ?? '',
      message: json['message'] as String? ?? '',
      read: json['read'] as bool? ?? false,
      type: NotificationItemType.fromString(json['type'] as String?),
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'] as String) ?? DateTime.now()
          : DateTime.now(),
      userId: json['userId'] as String? ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'message': message,
      'read': read,
      'type': type.name.toUpperCase(),
      'createdAt': createdAt.toIso8601String(),
      'userId': userId,
    };
  }
}
