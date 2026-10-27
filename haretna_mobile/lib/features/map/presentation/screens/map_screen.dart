import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../core/constants/app_colors.dart';

/// Neighborhood map matching the Stitch "Neighborhood Map View" design:
/// map background, floating search overlay, colored item pins, horizontal
/// category chips and a selected-item preview card.
class MapScreen extends ConsumerWidget {
  const MapScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(64),
        child: Container(
          decoration: BoxDecoration(
            color: AppColors.surface.withValues(alpha: 0.95),
            border: Border(
              bottom: BorderSide(
                color: AppColors.border.withValues(alpha: 0.5),
              ),
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.04),
                blurRadius: 4,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: SafeArea(
            bottom: false,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      const Icon(
                        Icons.location_on_rounded,
                        color: AppColors.primary,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        'دمشق - حي الروضة',
                        style: GoogleFonts.cairo(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppColors.primary,
                        ),
                      ),
                    ],
                  ),
                  IconButton(
                    onPressed: () {},
                    icon: const Icon(
                      Icons.notifications_none_rounded,
                      color: AppColors.primary,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
      body: Stack(
        children: [
          // Background Map
          Container(
            width: double.infinity,
            height: double.infinity,
            color: const Color(0xFFE5EADF),
            child: Image.network(
              'https://lh3.googleusercontent.com/aida-public/AB6AXuCX3Y4fA2qV7N59-EaGyNrWpMGkDW5VWBw0PUjnr5_-G573DJYYBus0qMB-FC_G49TJHhARBM_8RN3vajF83z_JCfIS7tledPJ2GTzcC93PNGkilbDUrI05jf_m0weGU5tS0wXd2UfuwjCttKPbrRJ8_nxocMUlPnrSs0aEOGws4AIr7NXexv0ROdrSWcSPZEBIv-vTsRfQ4Zpwx1S-JkC_TCS8fLuxe1l-lM6iG9KvBSa4h3aCkVFC',
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) => const Center(
                child: Text('Map View Placeholder'),
              ),
            ),
          ),

          // Search & Filter Overlay
          Positioned(
            top: 84,
            left: 16,
            right: 16,
            child: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: AppColors.surface.withValues(alpha: 0.9),
                borderRadius: BorderRadius.circular(999),
                border: Border.all(color: AppColors.border),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.08),
                    blurRadius: 24,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 8,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.surfaceLow,
                        borderRadius: BorderRadius.circular(999),
                      ),
                      child: const Row(
                        children: [
                          Icon(Icons.search, color: AppColors.textSecondary),
                          SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              'ابحث عن أدوات، طعام، مساعدة...',
                              style: TextStyle(
                                color: AppColors.textMuted,
                                fontSize: 14,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: const BoxDecoration(
                      color: AppColors.surfaceHighest,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.list_rounded, color: AppColors.primary),
                  ),
                ],
              ),
            ),
          ),

          // Map Pins
          Positioned(
            top: MediaQuery.of(context).size.height * 0.5,
            left: MediaQuery.of(context).size.width * 0.5,
            child: _buildUserLocationPin(),
          ),
          Positioned(
            top: MediaQuery.of(context).size.height * 0.3,
            right: MediaQuery.of(context).size.width * 0.2,
            child: _buildItemPin(Icons.handyman_rounded, AppColors.primaryDeep),
          ),
          Positioned(
            top: MediaQuery.of(context).size.height * 0.45,
            right: MediaQuery.of(context).size.width * 0.6,
            child: _buildItemPin(Icons.water_drop_rounded, AppColors.urgent),
          ),
          Positioned(
            bottom: MediaQuery.of(context).size.height * 0.4,
            right: MediaQuery.of(context).size.width * 0.35,
            child: _buildItemPin(Icons.restaurant_rounded, AppColors.primaryDeep),
          ),

          // Categories Bottom Area
          Positioned(
            bottom: 100, // Above bottom nav
            left: 0,
            right: 0,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Row(
                    children: [
                      _buildCategoryChip('كل الأدوات', dotColor: AppColors.primaryDeep),
                      const SizedBox(width: 12),
                      _buildCategoryChip(
                        'عدد وصيانة',
                        icon: Icons.handyman_rounded,
                        isSelected: true,
                      ),
                      const SizedBox(width: 12),
                      _buildCategoryChip(
                        'طعام',
                        icon: Icons.restaurant_rounded,
                      ),
                      const SizedBox(width: 12),
                      _buildCategoryChip(
                        'طلبات عاجلة',
                        dotColor: AppColors.urgent,
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                // Selected Item Card Preview
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.border),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.12),
                          blurRadius: 24,
                          offset: const Offset(0, 8),
                        ),
                      ],
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          width: 56,
                          height: 56,
                          decoration: BoxDecoration(
                            color: AppColors.surfaceHigh,
                            borderRadius: BorderRadius.circular(12),
                            image: DecorationImage(
                              image: const NetworkImage(
                                  'https://lh3.googleusercontent.com/aida-public/AB6AXuDK4o6XD7etR3kUfBEMfEWLCUxmsFsTjOekIIyCsGnFwLqZ8JaswvmZSlw1w2D5m5BT8t4juAJgbzsr427fnmp8I83ZzorPgnAiTvLjPn0miEWNW4-dCPOKZMiYfXi46Ke0y-gN4kd2HE0feOASxtXJ3w7dbx8VpGaUmbbsrXYlIi_TQYVLE1CCS46TLad3Tqsd67BNQaDGYPp3Id1IuikY4EXoLDkOc6A2djjsD6bTiZGNNdv4qXXQ'),
                              fit: BoxFit.cover,
                              onError: (_, __) {},
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 10,
                                      vertical: 2,
                                    ),
                                    decoration: BoxDecoration(
                                      color: AppColors.primaryContainer,
                                      borderRadius: BorderRadius.circular(999),
                                    ),
                                    child: const Text(
                                      'إعارة',
                                      style: TextStyle(
                                        fontSize: 11,
                                        color: AppColors.onPrimaryContainer,
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                  ),
                                  const Row(
                                    children: [
                                      Icon(
                                        Icons.near_me_rounded,
                                        size: 14,
                                        color: AppColors.textMuted,
                                      ),
                                      SizedBox(width: 2),
                                      Text(
                                        '200 م',
                                        style: TextStyle(
                                          fontSize: 11,
                                          color: AppColors.textMuted,
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'سلم ألمنيوم 5 درجات',
                                style: GoogleFonts.cairo(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                  color: AppColors.textPrimary,
                                ),
                              ),
                              const SizedBox(height: 4),
                              const Text(
                                'متوفر للإعارة لمدة يومين، التواصل للحجز.',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: AppColors.textSecondary,
                                ),
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildUserLocationPin() {
    return Container(
      width: 16,
      height: 16,
      decoration: BoxDecoration(
        color: const Color(0xFF007AFF),
        shape: BoxShape.circle,
        border: Border.all(color: Colors.white, width: 2),
        boxShadow: const [
          BoxShadow(color: Colors.black38, blurRadius: 4),
        ],
      ),
    );
  }

  Widget _buildItemPin(IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: color,
        shape: BoxShape.circle,
        border: Border.all(color: AppColors.surface, width: 2),
        boxShadow: const [
          BoxShadow(
            color: Colors.black26,
            blurRadius: 8,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Icon(icon, color: Colors.white, size: 20),
    );
  }

  Widget _buildCategoryChip(
    String label, {
    IconData? icon,
    Color? dotColor,
    bool isSelected = false,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      decoration: BoxDecoration(
        color: isSelected ? AppColors.primaryDeep : AppColors.surface,
        borderRadius: BorderRadius.circular(999),
        border: isSelected ? null : Border.all(color: AppColors.border),
        boxShadow: [
          if (isSelected)
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.12),
              blurRadius: 4,
            ),
        ],
      ),
      child: Row(
        children: [
          if (dotColor != null) ...[
            Container(
              width: 12,
              height: 12,
              decoration: BoxDecoration(color: dotColor, shape: BoxShape.circle),
            ),
            const SizedBox(width: 8),
          ],
          if (icon != null) ...[
            Icon(
              icon,
              size: 18,
              color: isSelected ? Colors.white : AppColors.textPrimary,
            ),
            const SizedBox(width: 8),
          ],
          Text(
            label,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: isSelected ? Colors.white : AppColors.textPrimary,
            ),
          ),
        ],
      ),
    );
  }
}
