import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/constants/api_endpoints.dart';
import '../../../../core/network/api_client.dart';
import '../models/notification_model.dart';

final notificationsRemoteDataSourceProvider = Provider<NotificationsRemoteDataSource>((ref) {
  final dio = ref.watch(apiClientProvider);
  return NotificationsRemoteDataSourceImpl(dio: dio);
});

abstract class NotificationsRemoteDataSource {
  Future<List<NotificationModel>> getNotifications();
  Future<void> markAsRead(String id);
  Future<void> markAllAsRead();
  Future<void> deleteNotification(String id);
}

class NotificationsRemoteDataSourceImpl implements NotificationsRemoteDataSource {
  final Dio dio;

  NotificationsRemoteDataSourceImpl({required this.dio});

  @override
  Future<List<NotificationModel>> getNotifications() async {
    final response = await dio.get(ApiEndpoints.notifications);
    final data = response.data;
    if (data is List) {
      return data
          .map((item) => NotificationModel.fromJson(item as Map<String, dynamic>))
          .toList();
    }
    return [];
  }

  @override
  Future<void> markAsRead(String id) async {
    await dio.patch(ApiEndpoints.markNotificationRead(id));
  }

  @override
  Future<void> markAllAsRead() async {
    await dio.patch(ApiEndpoints.markAllNotificationsRead);
  }

  @override
  Future<void> deleteNotification(String id) async {
    await dio.delete('${ApiEndpoints.notifications}/$id');
  }
}
