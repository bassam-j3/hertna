import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../core/constants/app_colors.dart';
import '../../domain/entities/post.dart';

/// Feed card matching the Stitch "Haretna Home Feed v2" design with three
/// variants: loan card (image + badge), gift card (orange chip, no image)
/// and urgent request card (soft red surface).
class PostCard extends StatelessWidget {
  final Post post;
  final VoidCallback? onTap;
  final VoidCallback? onHelpPressed;

  const PostCard({
    super.key,
    required this.post,
    this.onTap,
    this.onHelpPressed,
  });

  bool get _isUrgentCard => post.isRequest && post.urgent;

  bool get _hasImage => post.image != null && post.image!.isNotEmpty;

  /// No-image offer → rendered as a Stitch "gift" card with an orange chip.
  /// Matches the Stitch home feed: loan cards carry a photo + badge, gift
  /// cards are text-only with a "هدية" chip. Posts without a photo are
  /// treated as gifts.
  bool get _isGiftCard => !_isUrgentCard && !post.isRequest && !_hasImage;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Container(
        decoration: BoxDecoration(
          color: _isUrgentCard ? AppColors.urgentCardBg : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: _isUrgentCard
                ? AppColors.errorContainer
                : AppColors.border.withValues(alpha: 0.3),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 6,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Material(
          color: Colors.transparent,
          borderRadius: BorderRadius.circular(12),
          child: InkWell(
            borderRadius: BorderRadius.circular(12),
            onTap: onTap,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // ── Image variant (loan item with photo) ──────────────
                if (!_isUrgentCard && _hasImage) _buildImageHeader(),
                // ── Body ──────────────────────────────────────────────
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Urgent label row
                      if (_isUrgentCard) ...[
                        Row(
                          children: [
                            const Icon(
                              Icons.error_outline,
                              color: AppColors.error,
                              size: 18,
                            ),
                            const SizedBox(width: 6),
                            Text(
                              'طلب مستعجل',
                              style: GoogleFonts.cairo(
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                color: AppColors.error,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                      ],
                      // Gift chip (no-image offer)
                      if (_isGiftCard) ...[
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 10,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: AppColors.accent,
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            'هدية',
                            style: GoogleFonts.cairo(
                              fontSize: 12,
                              fontWeight: FontWeight.w500,
                              color: AppColors.accentOnContainer,
                            ),
                          ),
                        ),
                        const SizedBox(height: 12),
                      ],
                      // Title + rating row
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: Text(
                              post.title,
                              style: GoogleFonts.cairo(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: AppColors.textPrimary,
                                height: 1.35,
                              ),
                            ),
                          ),
                          if ((post.user?.trustPoints ?? 0) > 0) ...[
                            const SizedBox(width: 8),
                            Row(
                              children: [
                                const Icon(
                                  Icons.star_rounded,
                                  size: 16,
                                  color: AppColors.secondary,
                                ),
                                const SizedBox(width: 2),
                                Text(
                                  post.user!.trustPoints.toString(),
                                  style: GoogleFonts.cairo(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w500,
                                    color: AppColors.secondary,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ],
                      ),
                      if (post.description.isNotEmpty) ...[
                        const SizedBox(height: 8),
                        Text(
                          post.description,
                          style: GoogleFonts.cairo(
                            fontSize: 14,
                            color: AppColors.textSecondary,
                            height: 1.5,
                          ),
                          maxLines: 3,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                      const SizedBox(height: 14),
                      // Footer: author + distance + action
                      Container(
                        padding: const EdgeInsets.only(top: 12),
                        decoration: BoxDecoration(
                          border: Border(
                            top: BorderSide(
                              color: _isUrgentCard
                                  ? AppColors.errorContainer
                                  : AppColors.border.withValues(alpha: 0.3),
                            ),
                          ),
                        ),
                        child: Row(
                          children: [
                            _buildAuthorAvatar(),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    post.user?.name ?? 'أحد الجيران',
                                    style: GoogleFonts.cairo(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w500,
                                      color: AppColors.textPrimary,
                                    ),
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  if (post.location.isNotEmpty)
                                    Text(
                                      post.location,
                                      style: GoogleFonts.cairo(
                                        fontSize: 10,
                                        color: AppColors.textSecondary,
                                      ),
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                ],
                              ),
                            ),
                            const SizedBox(width: 8),
                            _buildFooterAction(),
                          ],
                        ),
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

  Widget _buildImageHeader() {
    return ClipRRect(
      borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
      child: Stack(
        children: [
          SizedBox(
            height: 180,
            width: double.infinity,
            child: Image.network(
              post.image!,
              fit: BoxFit.cover,
              errorBuilder: (_, __, ___) => Container(
                color: AppColors.surfaceHigh,
                child: const Center(
                  child: Icon(Icons.image_outlined, color: AppColors.textMuted),
                ),
              ),
            ),
          ),
          Positioned(
            top: 12,
            right: 12,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: AppColors.primaryDeep,
                borderRadius: BorderRadius.circular(6),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.2),
                    blurRadius: 4,
                  ),
                ],
              ),
              child: Text(
                post.isRequest ? 'طلب مساعدة' : 'إعارة',
                style: GoogleFonts.cairo(
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                  color: Colors.white,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAuthorAvatar() {
    final avatar = post.user?.avatar;
    if (avatar != null && avatar.isNotEmpty) {
      return Container(
        width: 32,
        height: 32,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          image: DecorationImage(
            image: NetworkImage(avatar),
            fit: BoxFit.cover,
          ),
        ),
      );
    }
    final initial = (post.user?.name.isNotEmpty ?? false)
        ? post.user!.name.substring(0, 1)
        : 'ج';
    return Container(
      width: 32,
      height: 32,
      alignment: Alignment.center,
      decoration: const BoxDecoration(
        color: AppColors.surfaceVariant,
        shape: BoxShape.circle,
      ),
      child: Text(
        initial,
        style: GoogleFonts.cairo(
          fontSize: 13,
          fontWeight: FontWeight.w500,
          color: AppColors.textSecondary,
        ),
      ),
    );
  }

  Widget _buildFooterAction() {
    // Gift (no-image offer): solid primary "طلب" pill button
    if (_isGiftCard) {
      return ElevatedButton(
        onPressed: onHelpPressed ?? onTap,
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primaryDeep,
          foregroundColor: Colors.white,
          minimumSize: Size.zero,
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 6),
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(999),
          ),
          textStyle: GoogleFonts.cairo(
            fontSize: 12,
            fontWeight: FontWeight.w500,
          ),
        ),
        child: const Text('طلب'),
      );
    }

    // Loan & request cards: icon button
    return IconButton(
      onPressed: onHelpPressed ?? onTap,
      icon: Icon(
        post.isRequest ? Icons.handshake_rounded : Icons.chat_bubble_outline_rounded,
        color: post.isRequest ? AppColors.secondary : AppColors.primaryDeep,
      ),
      style: IconButton.styleFrom(
        padding: const EdgeInsets.all(8),
        minimumSize: Size.zero,
        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
      ),
    );
  }
}
