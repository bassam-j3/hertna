import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../core/constants/app_colors.dart';
import '../../domain/entities/notification_item.dart';
import '../controllers/notifications_controller.dart';
import '../controllers/notifications_state.dart';

class NotificationsScreen extends ConsumerWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(notificationsControllerProvider);
    final controller = ref.read(notificationsControllerProvider.notifier);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(
          'الإشعارات',
          style: GoogleFonts.cairo(
            fontWeight: FontWeight.bold,
            fontSize: 20,
          ),
        ),
        centerTitle: false,
        actions: [
          if (state.unreadCount > 0)
            TextButton.icon(
              onPressed: () => controller.markAllAsRead(),
              icon: const Icon(Icons.done_all_rounded, size: 18, color: AppColors.primary),
              label: Text(
                'قراءة الكل',
                style: GoogleFonts.cairo(
                  color: AppColors.primary,
                  fontWeight: FontWeight.bold,
                  fontSize: 13,
                ),
              ),
            ),
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            tooltip: 'تحديث',
            onPressed: () => controller.refresh(),
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Filter Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Row(
                children: [
                  FilterChip(
                    label: Text(
                      'غير المقروءة (${state.unreadCount})',
                      style: GoogleFonts.cairo(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: state.filterUnreadOnly ? Colors.white : AppColors.textPrimary,
                      ),
                    ),
                    selected: state.filterUnreadOnly,
                    selectedColor: AppColors.primary,
                    checkmarkColor: Colors.white,
                    backgroundColor: Colors.white,
                    side: BorderSide(
                      color: state.filterUnreadOnly ? AppColors.primary : AppColors.border,
                    ),
                    onSelected: (_) => controller.toggleUnreadFilter(),
                  ),
                  const Spacer(),
                  Text(
                    'المجموع: ${state.notifications.length}',
                    style: GoogleFonts.cairo(
                      fontSize: 12,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
            ),

            // Content List
            Expanded(
              child: RefreshIndicator(
                color: AppColors.primary,
                onRefresh: () => controller.refresh(),
                child: _buildBody(context, state, controller),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBody(
    BuildContext context,
    NotificationsState state,
    NotificationsController controller,
  ) {
    if (state.status == NotificationsStatus.loading && state.notifications.isEmpty) {
      return const Center(child: CircularProgressIndicator(color: AppColors.primary));
    }

    if (state.status == NotificationsStatus.error && state.notifications.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.error_outline_rounded, size: 54, color: AppColors.error),
              const SizedBox(height: 12),
              Text(
                state.errorMessage ?? 'حدث خطأ في تحميل الإشعارات',
                style: GoogleFonts.cairo(color: AppColors.textSecondary),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: () => controller.loadNotifications(),
                icon: const Icon(Icons.refresh_rounded),
                label: Text('إعادة المحاولة', style: GoogleFonts.cairo()),
              ),
            ],
          ),
        ),
      );
    }

    final items = state.filteredNotifications;

    if (items.isEmpty) {
      return ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        children: [
          SizedBox(height: MediaQuery.of(context).size.height * 0.25),
          Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: const BoxDecoration(
                    color: AppColors.primarySurface,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.notifications_off_outlined,
                    size: 48,
                    color: AppColors.primary,
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  state.filterUnreadOnly
                      ? 'لا توجد إشعارات غير مقروءة'
                      : 'صندوق الإشعارات فارغ حالياً',
                  style: GoogleFonts.cairo(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  'ستصلك تنبيهات عندما يتفاعل الجيران مع طلباتك وعروضك',
                  style: GoogleFonts.cairo(
                    fontSize: 13,
                    color: AppColors.textSecondary,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        ],
      );
    }

    return ListView.separated(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      itemCount: items.length,
      separatorBuilder: (_, __) => const SizedBox(height: 10),
      itemBuilder: (context, index) {
        final item = items[index];
        return _NotificationTile(
          item: item,
          onTap: () {
            if (!item.read) {
              controller.markAsRead(item.id);
            }
          },
          onDelete: () => controller.deleteNotification(item.id),
        );
      },
    );
  }
}

class _NotificationTile extends StatelessWidget {
  final NotificationItem item;
  final VoidCallback onTap;
  final VoidCallback onDelete;

  const _NotificationTile({
    required this.item,
    required this.onTap,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final (icon, color, bgColor) = _getTypeStyle(item.type);

    return Dismissible(
      key: Key(item.id),
      direction: DismissDirection.endToStart,
      background: Container(
        alignment: Alignment.centerLeft,
        padding: const EdgeInsets.only(left: 20),
        decoration: BoxDecoration(
          color: AppColors.error,
          borderRadius: BorderRadius.circular(14),
        ),
        child: const Icon(Icons.delete_outline_rounded, color: Colors.white),
      ),
      onDismissed: (_) => onDelete(),
      child: Material(
        color: item.read ? Colors.white : AppColors.primarySurface.withValues(alpha: 0.35),
        borderRadius: BorderRadius.circular(14),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(14),
          child: Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(14),
              border: Border.all(
                color: item.read ? AppColors.border : AppColors.primary.withValues(alpha: 0.3),
                width: item.read ? 1 : 1.5,
              ),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Type Icon Badge
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: bgColor,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(icon, color: color, size: 22),
                ),
                const SizedBox(width: 12),

                // Notification Content
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              item.title,
                              style: GoogleFonts.cairo(
                                fontWeight: item.read ? FontWeight.w600 : FontWeight.bold,
                                fontSize: 14,
                                color: AppColors.textPrimary,
                              ),
                            ),
                          ),
                          if (!item.read)
                            Container(
                              width: 8,
                              height: 8,
                              decoration: const BoxDecoration(
                                color: AppColors.primary,
                                shape: BoxShape.circle,
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        item.message,
                        style: GoogleFonts.cairo(
                          fontSize: 13,
                          color: AppColors.textSecondary,
                          height: 1.35,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: color.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              item.type.label,
                              style: GoogleFonts.cairo(
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                color: color,
                              ),
                            ),
                          ),
                          const Spacer(),
                          Text(
                            _formatDate(item.createdAt),
                            style: GoogleFonts.cairo(
                              fontSize: 11,
                              color: AppColors.textSecondary.withValues(alpha: 0.7),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  (IconData, Color, Color) _getTypeStyle(NotificationItemType type) {
    switch (type) {
      case NotificationItemType.request:
        return (
          Icons.volunteer_activism_rounded,
          AppColors.accent,
          AppColors.accent.withValues(alpha: 0.12),
        );
      case NotificationItemType.approval:
        return (
          Icons.check_circle_rounded,
          AppColors.success,
          AppColors.success.withValues(alpha: 0.12),
        );
      case NotificationItemType.urgent:
        return (
          Icons.warning_amber_rounded,
          AppColors.error,
          AppColors.error.withValues(alpha: 0.12),
        );
      case NotificationItemType.system:
        return (
          Icons.notifications_active_rounded,
          AppColors.primary,
          AppColors.primarySurface,
        );
    }
  }

  String _formatDate(DateTime dt) {
    final now = DateTime.now();
    final diff = now.difference(dt);

    if (diff.inMinutes < 1) return 'الآن';
    if (diff.inMinutes < 60) return 'منذ ${diff.inMinutes} دقيقة';
    if (diff.inHours < 24) return 'منذ ${diff.inHours} ساعة';
    if (diff.inDays < 7) return 'منذ ${diff.inDays} يوم';
    return '${dt.year}/${dt.month}/${dt.day}';
  }
}
