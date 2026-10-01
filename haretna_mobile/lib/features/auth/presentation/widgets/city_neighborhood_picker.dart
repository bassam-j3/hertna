import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';

class CityNeighborhoodPicker extends StatefulWidget {
  final String? initialCity;
  final String? initialNeighborhood;
  final void Function(String city, String neighborhood) onChanged;

  const CityNeighborhoodPicker({
    super.key,
    this.initialCity,
    this.initialNeighborhood,
    required this.onChanged,
  });

  @override
  State<CityNeighborhoodPicker> createState() => _CityNeighborhoodPickerState();
}

class _CityNeighborhoodPickerState extends State<CityNeighborhoodPicker> {
  static const Map<String, List<String>> _cityData = {
    'دمشق': [
      'الميدان',
      'المزة',
      'الشاغور',
      'الصالحية',
      'ركن الدين',
      'كفرسوسة',
      'القصاع',
      'البرامكة',
      'المهاجرين',
    ],
    'حماة': [
      'الحاضر',
      'الدباغة',
      'الصابونية',
      'الشريعة',
      'القصور',
      'طريق حلب',
      'الجنوبية',
      'الكيلانية',
    ],
    'حلب': [
      'الجميلية',
      'الشهباء',
      'الميرديان',
      'السريان',
      'سيف الدولة',
      'الفرقان',
    ],
    'حمص': [
      'الحميدية',
      'الوعر',
      'الإنشاءات',
      'الدبلان',
      'الخالدية',
    ],
    'اللاذقية': [
      'الصليبة',
      'مشروع دمر',
      'الأمريكان',
      'الزراعة',
      'الرمل الشمالي',
    ],
  };

  late String _selectedCity;
  late String _selectedNeighborhood;

  @override
  void initState() {
    super.initState();
    _selectedCity = widget.initialCity ?? _cityData.keys.first;
    _selectedNeighborhood = widget.initialNeighborhood ?? _cityData[_selectedCity]!.first;
  }

  @override
  Widget build(BuildContext context) {
    final neighborhoods = _cityData[_selectedCity] ?? [];

    return Column(
      children: [
        // City selector
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'المدينة',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 8),
            DropdownButtonFormField<String>(
              value: _selectedCity,
              icon: const Icon(Icons.arrow_drop_down, color: AppColors.primary),
              decoration: InputDecoration(
                filled: true,
                fillColor: Colors.white,
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: AppColors.border),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: AppColors.border),
                ),
              ),
              items: _cityData.keys.map((city) {
                return DropdownMenuItem(
                  value: city,
                  child: Text(city),
                );
              }).toList(),
              onChanged: (newCity) {
                if (newCity != null) {
                  setState(() {
                    _selectedCity = newCity;
                    _selectedNeighborhood = _cityData[newCity]!.first;
                  });
                  widget.onChanged(_selectedCity, _selectedNeighborhood);
                }
              },
            ),
          ],
        ),
        const SizedBox(height: 16),

        // Neighborhood selector
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'الحي / المنطقة',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 8),
            DropdownButtonFormField<String>(
              value: _selectedNeighborhood,
              icon: const Icon(Icons.arrow_drop_down, color: AppColors.primary),
              decoration: InputDecoration(
                filled: true,
                fillColor: Colors.white,
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: AppColors.border),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: AppColors.border),
                ),
              ),
              items: neighborhoods.map((neighborhood) {
                return DropdownMenuItem(
                  value: neighborhood,
                  child: Text(neighborhood),
                );
              }).toList(),
              onChanged: (newNeighborhood) {
                if (newNeighborhood != null) {
                  setState(() {
                    _selectedNeighborhood = newNeighborhood;
                  });
                  widget.onChanged(_selectedCity, _selectedNeighborhood);
                }
              },
            ),
          ],
        ),
      ],
    );
  }
}
