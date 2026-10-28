import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../core/constants/app_colors.dart';
import '../../domain/entities/swap.dart';

/// Bento-style swap card matching the Stitch "Exchanges Dashboard v2"
/// design: image header with status pill, title, borrower line, status badge
/// and contextual action buttons.
class SwapCard extends StatelessWidget {
  final SwapItemEntity swap;
  final bool isLender;
  final bool isUpdating;
  final void Function(SwapStatus status)? onStatusChange;

  const SwapCard({
    super.key,
    required this.swap,
    required this.isLender,
    this.isUpdating = false,
    this.onStatusChange,
  });

  bool get _isOverdue =>
      swap.isAccepted &&
      swap.dueDate != null &&
      swap.dueDate!.isBefore(DateTime.now());

  @override
  Widget build(BuildContext context) {
    final borrower = swap.otherParty?.name ??
        (isLender ? 'جار من الحارة' : 'صاحب الغرض');

    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.surfaceLowest,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: AppColors.border.withValues(alpha: 0.2),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 6,
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Image header with status pill ─────────────────────────
            ClipRRect(
              borderRadius:
                  const BorderRadius.vertical(top: Radius.circular(16)),
              child: Stack(
                children: [
                  SizedBox(
                    height: 150,
                    width: double.infinity,
                    child: swap.postImage != null &&
                            swap.postImage!.isNotEmpty
                        ? Image.network(
                            swap.postImage!,
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) => _imagePlaceholder(),
                          )
                        : _imagePlaceholder(),
                  ),
                  Positioned(
                    top: 12,
                    right: 12,
                    child: _buildStatusPill(),
                  ),
                ],
              ),
            ),
            // ── Body ──────────────────────────────────────────────────
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              swap.title,
                              style: GoogleFonts.cairo(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: AppColors.textPrimary,
                              ),
                            ),
                            const SizedBox(height: 6),
                            Row(
                              children: [
                                const Icon(
                                  Icons.person_outline,
                                  size: 16,
                                  color: AppColors.textSecondary,
                                ),
                                const SizedBox(width: 6),
                                Expanded(
                                  child: Text(
                                    'المستعير: $borrower',
                                    style: GoogleFonts.cairo(
                                      fontSize: 14,
                                      color: AppColors.textSecondary,
                                    ),
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 8),
                      _buildStatusBadge(),
                    ],
                  ),
                  const SizedBox(height: 16),
                  // ── Action buttons ──────────────────────────────────
                  Container(
                    padding: const EdgeInsets.only(top: 14),
                    decoration: BoxDecoration(
                      border: Border(
                        top: BorderSide(
                          color: AppColors.border.withValues(alpha: 0.2),
                        ),
                      ),
                    ),
                    child: _buildActions(),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _imagePlaceholder() {
    return Container(
      color: AppColors.surfaceHigh,
      child: const Center(
        child: Icon(
          Icons.handyman_outlined,
          size: 40,
          color: AppColors.textMuted,
        ),
      ),
    );
  }

  Widget _buildStatusPill() {
    if (swap.isCompleted) {
      return _pill(
        background: AppColors.surface.withValues(alpha: 0.9),
        foreground: AppColors.textPrimary,
        icon: Icons.check_circle_outline,
        label: 'تم الإرجاع',
      );
    }
    if (_isOverdue) {
      return _pill(
        background: AppColors.error.withValues(alpha: 0.9),
        foreground: Colors.white,
        icon: Icons.warning_amber_rounded,
        label: 'متأخر',
      );
    }
    if (swap.isInUse || swap.isAccepted) {
      final remaining = swap.dueDate != null
          ? 'متبقي ${swap.dueDate!.difference(DateTime.now()).inDays.clamp(0, 99)} يوم'
          : 'قيد الإعارة';
      return _pill(
        background: AppColors.accent.withValues(alpha: 0.9),
        foreground: AppColors.accentOnContainer,
        icon: Icons.schedule_rounded,
        label: remaining,
      );
    }
    return _pill(
      background: AppColors.surface.withValues(alpha: 0.9),
      foreground: AppColors.textPrimary,
      icon: Icons.hourglass_empty_rounded,
      label: 'بانتظار التأكيد',
    );
  }

  Widget _pill({
    required Color background,
    required Color foreground,
    required IconData icon,
    required String label,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: background,
        borderRadius: BorderRadius.circular(999),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 4,
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16, color: foreground),
          const SizedBox(width: 4),
          Text(
            label,
            style: GoogleFonts.cairo(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: foreground,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusBadge() {
    if (swap.isCompleted) {
      return _badge(
        background: AppColors.surfaceHighest,
        foreground: AppColors.textPrimary,
        label: 'مكتمل',
      );
    }
    if (_isOverdue) {
      return _badge(
        background: AppColors.errorContainer,
        foreground: AppColors.onErrorContainer,
        label: 'متأخر',
      );
    }
    if (swap.isInUse || swap.isAccepted) {
      return _badge(
        background: const Color(0xFFEEF2E8),
        foreground: AppColors.primaryDeep,
        label: 'قيد الإعارة',
      );
    }
    return _badge(
      background: AppColors.surfaceLow,
      foreground: AppColors.textSecondary,
      label: 'قيد الانتظار',
    );
  }

  Widget _badge({
    required Color background,
    required Color foreground,
    required String label,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: background,
        borderRadius: BorderRadius.circular(6),
        border: Border.all(
          color: foreground.withValues(alpha: 0.2),
        ),
      ),
      child: Text(
        label,
        style: GoogleFonts.cairo(
          fontSize: 12,
          fontWeight: FontWeight.w500,
          color: foreground,
        ),
      ),
    );
  }

  Widget _buildActions() {
    if (onStatusChange == null) return const SizedBox.shrink();

    // Completed → thank-you
    if (swap.isCompleted) {
      return OutlinedButton.icon(
        onPressed: null,
        icon: const Icon(Icons.favorite_border_rounded, size: 18),
        label: const Text('إرسال شكر'),
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.primary,
          side: const BorderSide(color: AppColors.primary, width: 2),
          padding: const EdgeInsets.symmetric(vertical: 8),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
      );
    }

    // Lender: pending request → accept / reject
    if (isLender && swap.isPending) {
      return Row(
        children: [
          Expanded(
            child: ElevatedButton.icon(
              onPressed: isUpdating
                  ? null
                  : () => onStatusChange!(SwapStatus.accepted),
              icon: const Icon(Icons.check_rounded, size: 18),
              label: const Text('قبول الطلب'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 8),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: OutlinedButton.icon(
              onPressed: isUpdating
                  ? null
                  : () => onStatusChange!(SwapStatus.cancelled),
              icon: const Icon(Icons.close_rounded, size: 18),
              label: const Text('رفض'),
              style: OutlinedButton.styleFrom(
                foregroundColor: AppColors.error,
                side: const BorderSide(color: AppColors.error),
                padding: const EdgeInsets.symmetric(vertical: 8),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
            ),
          ),
        ],
      );
    }

    // Borrower: pending → cancel
    if (!isLender && swap.isPending) {
      return SizedBox(
        width: double.infinity,
        child: OutlinedButton.icon(
          onPressed: isUpdating
              ? null
              : () => onStatusChange!(SwapStatus.cancelled),
          icon: const Icon(Icons.cancel_outlined, size: 18),
          label: const Text('إلغاء الطلب'),
          style: OutlinedButton.styleFrom(
            foregroundColor: AppColors.textSecondary,
            side: const BorderSide(color: AppColors.border),
            padding: const EdgeInsets.symmetric(vertical: 8),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
        ),
      );
    }

    // Lender: active loan → reminder
    if (isLender && (swap.isAccepted || swap.isInUse)) {
      return ElevatedButton.icon(
        onPressed: isUpdating
            ? null
            : () => onStatusChange!(
                _isOverdue ? SwapStatus.cancelled : SwapStatus.completed),
        icon: Icon(
          _isOverdue
              ? Icons.priority_high_rounded
              : Icons.notifications_active_rounded,
          size: 18,
        ),
        label: Text(_isOverdue ? 'تنبيه' : 'تذكير بالإرجاع'),
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(vertical: 8),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
      );
    }

    // Borrower: accepted → complete / cancel
    return Row(
      children: [
        Expanded(
          child: ElevatedButton.icon(
            onPressed: isUpdating
                ? null
                : () => onStatusChange!(SwapStatus.completed),
            icon: const Icon(Icons.done_all_rounded, size: 18),
            label: const Text('تم الاستلام'),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 8),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: OutlinedButton.icon(
            onPressed: isUpdating
                ? null
                : () => onStatusChange!(SwapStatus.cancelled),
            icon: const Icon(Icons.cancel_outlined, size: 18),
            label: const Text('إلغاء'),
            style: OutlinedButton.styleFrom(
              foregroundColor: AppColors.textSecondary,
              side: const BorderSide(color: AppColors.border),
              padding: const EdgeInsets.symmetric(vertical: 8),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
