import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';

class CategoryItem {
  final String key;
  final String label;
  final IconData icon;

  const CategoryItem({
    required this.key,
    required this.label,
    required this.icon,
  });
}

class CategorySelector extends StatelessWidget {
  final String selectedCategory;
  final ValueChanged<String> onSelected;

  static const List<CategoryItem> categories = [
    CategoryItem(key: 'ALL', label: 'الكل', icon: Icons.apps_rounded),
    CategoryItem(key: 'صحي', label: 'رعاية صحية وأدوية', icon: Icons.medication_rounded),
    CategoryItem(key: 'غذائي', label: 'سلّات ومواد غذائية', icon: Icons.restaurant_rounded),
    CategoryItem(key: 'أدوات', label: 'أدوات وصيانة منزلية', icon: Icons.build_rounded),
    CategoryItem(key: 'تعليمي', label: 'كتب ومستلزمات دراسية', icon: Icons.menu_book_rounded),
    CategoryItem(key: 'ملابس', label: 'ألبسة وكسوة', icon: Icons.checkroom_rounded),
    CategoryItem(key: 'أخرى', label: 'خدمات متنوعة', icon: Icons.more_horiz_rounded),
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

          return FilterChip(
            selected: isSelected,
            label: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  item.icon,
                  size: 16,
                  color: isSelected ? Colors.white : AppColors.primary,
                ),
                const SizedBox(width: 6),
                Text(
                  item.label,
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                    color: isSelected ? Colors.white : AppColors.textPrimary,
                  ),
                ),
              ],
            ),
            backgroundColor: Colors.white,
            selectedColor: AppColors.primary,
            checkmarkColor: Colors.white,
            showCheckmark: false,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
              side: BorderSide(
                color: isSelected ? AppColors.primary : AppColors.border,
                width: 1,
              ),
            ),
            onSelected: (_) => onSelected(item.key),
          );
        },
      ),
    );
  }
}
