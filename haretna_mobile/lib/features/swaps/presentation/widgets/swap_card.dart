import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../core/constants/app_colors.dart';
import '../../domain/entities/swap.dart';

class SwapCard extends StatelessWidget {
  final SwapItem swap;
  final void Function(String status)? onStatusUpdate;

  const SwapCard({
    super.key,
    required this.swap,
    this.onStatusUpdate,
  });

  Color _getStatusColor() {
    switch (swap.status) {
      case 'approved':
      case 'in_progress':
        return AppColors.success;
      case 'completed':
        return AppColors.primary;
      case 'cancelled':
        return AppColors.error;
      case 'pending':
      default:
        return AppColors.accent;
    }
  }

  @override
  Widget build(BuildContext context) {
    final statusColor = _getStatusColor();

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header: Status badge & role indicator
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: statusColor.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  swap.statusArabic,
                  style: GoogleFonts.cairo(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: statusColor,
                  ),
                ),
              ),
              Text(
                swap.isBorrower ? 'طلب مساعدة مستلم' : 'عرض مساعدة مقدّم',
                style: GoogleFonts.tajawal(
                  fontSize: 12,
                  color: AppColors.textMuted,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Title
          Text(
            swap.title,
            style: GoogleFonts.cairo(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 8),

          // Partner neighbor info
          Row(
            children: [
              CircleAvatar(
                radius: 14,
                backgroundColor: AppColors.primarySurface,
                child: Text(
                  swap.otherPartyName.isNotEmpty ? swap.otherPartyName.substring(0, 1) : 'ج',
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primary,
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Text(
                'الطرف الآخر: ${swap.otherPartyName}',
                style: GoogleFonts.tajawal(
                  fontSize: 13,
                  color: AppColors.textSecondary,
                ),
              ),
              const Spacer(),
              if (swap.otherPartyPhone != null && swap.otherPartyPhone!.isNotEmpty) ...[
                IconButton(
                  icon: const Icon(Icons.phone_outlined, size: 20, color: AppColors.primary),
                  tooltip: 'اتصال',
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('الهاتف: ${swap.otherPartyPhone}')),
                    );
                  },
                ),
              ],
            ],
          ),
          const SizedBox(height: 8),

          // Due date if available
          if (swap.dueDate != null) ...[
            Row(
              children: [
                const Icon(Icons.event_outlined, size: 14, color: AppColors.textMuted),
                const SizedBox(width: 6),
                Text(
                  'الموعد المحدد: ${swap.dueDate!.year}/${swap.dueDate!.month}/${swap.dueDate!.day}',
                  style: GoogleFonts.tajawal(
                    fontSize: 12,
                    color: AppColors.textMuted,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
          ],

          // Action buttons
          if (swap.isPending) ...[
            const Divider(height: 16),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.success,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      elevation: 0,
                    ),
                    onPressed: () => onStatusUpdate?.call('approved'),
                    child: Text('قبول وموافقة', style: GoogleFonts.cairo(fontSize: 13, fontWeight: FontWeight.bold)),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: OutlinedButton(
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.error,
                      side: const BorderSide(color: AppColors.error),
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    onPressed: () => onStatusUpdate?.call('cancelled'),
                    child: Text('اعتذار / إلغاء', style: GoogleFonts.cairo(fontSize: 13, fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
          ] else if (swap.isApproved) ...[
            const Divider(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  elevation: 0,
                ),
                icon: const Icon(Icons.check_circle_outline_rounded, size: 18),
                label: Text('تأكيد إتمام المساعدة واستلام النقاط', style: GoogleFonts.cairo(fontSize: 13, fontWeight: FontWeight.bold)),
                onPressed: () => onStatusUpdate?.call('completed'),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
