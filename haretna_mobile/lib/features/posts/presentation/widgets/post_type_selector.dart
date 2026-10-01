import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';

class PostTypeSelector extends StatelessWidget {
  final String selectedType; // 'ALL', 'REQUEST', 'OFFER'
  final ValueChanged<String> onSelected;

  const PostTypeSelector({
    super.key,
    required this.selectedType,
    required this.onSelected,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: AppColors.border.withValues(alpha: 0.5),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          _buildTab(context, key: 'ALL', label: 'الكل', icon: Icons.all_inclusive_rounded),
          _buildTab(context, key: 'REQUEST', label: 'طلبات مساعدة', icon: Icons.volunteer_activism_rounded),
          _buildTab(context, key: 'OFFER', label: 'عروض وتبرع', icon: Icons.card_giftcard_rounded),
        ],
      ),
    );
  }

  Widget _buildTab(
    BuildContext context, {
    required String key,
    required String label,
    required IconData icon,
  }) {
    final isSelected = selectedType == key;

    return Expanded(
      child: GestureDetector(
        onTap: () => onSelected(key),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: isSelected ? Colors.white : Colors.transparent,
            borderRadius: BorderRadius.circular(9),
            boxShadow: isSelected
                ? [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.06),
                      blurRadius: 4,
                      offset: const Offset(0, 2),
                    ),
                  ]
                : null,
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                size: 16,
                color: isSelected ? AppColors.primary : AppColors.textMuted,
              ),
              const SizedBox(width: 6),
              Text(
                label,
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                  color: isSelected ? AppColors.primary : AppColors.textSecondary,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
