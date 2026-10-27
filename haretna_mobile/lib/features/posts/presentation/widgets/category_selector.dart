import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../core/constants/app_colors.dart';

class CategoryItem {
  final String key;
  final String label;

  const CategoryItem({required this.key, required this.label});
}

/// Horizontal category chips matching the Stitch home feed design:
/// rounded-full text chips; the selected chip is deep orange with white text.
class CategorySelector extends StatelessWidget {
  final String selectedCategory;
  final ValueChanged<String> onSelected;

  /// Category keys are the backend category values; labels follow the
  /// Stitch home feed design (first three chips match the design exactly).
  static const List<CategoryItem> categories = [
    CategoryItem(key: 'ALL', label: 'الكل'),
    CategoryItem(key: 'أدوات', label: 'إعارة أدوات'),
    CategoryItem(key: 'غذائي', label: 'توزيع طعام'),
    CategoryItem(key: 'صحي', label: 'رعاية صحية'),
    CategoryItem(key: 'تعليمي', label: 'كتب وتعليم'),
    CategoryItem(key: 'ملابس', label: 'ألبسة وكسوة'),
    CategoryItem(key: 'أخرى', label: 'أخرى'),
  ];

  const CategorySelector({
    super.key,
    required this.selectedCategory,
    required this.onSelected,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 44,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: categories.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (context, index) {
          final item = categories[index];
          final isSelected = selectedCategory == item.key;

          return GestureDetector(
            onTap: () => onSelected(item.key),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 180),
              padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 9),
              decoration: BoxDecoration(
                color: isSelected
                    ? AppColors.secondary
                    : AppColors.surfaceContainer,
                borderRadius: BorderRadius.circular(999),
                boxShadow: isSelected
                    ? [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.12),
                          blurRadius: 4,
                        ),
                      ]
                    : null,
              ),
              child: Text(
                item.label,
                style: GoogleFonts.cairo(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: isSelected ? Colors.white : AppColors.textPrimary,
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
