import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/constants/app_colors.dart';
import '../../domain/entities/swap.dart';
import '../controllers/swaps_controller.dart';
import '../widgets/swap_card.dart';

class MySwapsScreen extends ConsumerStatefulWidget {
  const MySwapsScreen({super.key});

  @override
  ConsumerState<MySwapsScreen> createState() => _MySwapsScreenState();
}

class _MySwapsScreenState extends ConsumerState<MySwapsScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _handleStatusChange(String swapId, String status) async {
    final success = await ref
        .read(swapsControllerProvider.notifier)
        .updateStatus(swapId, status);

    if (mounted) {
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('تم تحديث حالة الطلب بنجاح'),
            backgroundColor: AppColors.primary,
          ),
        );
      } else {
        final error = ref.read(swapsControllerProvider).errorMessage ??
            'حدث خطأ أثناء التحديث';
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(error),
            backgroundColor: AppColors.error,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(swapsControllerProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('طلباتي وعروضي'),
        bottom: TabBar(
          controller: _tabController,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white70,
          indicatorColor: Colors.white,
          indicatorWeight: 3,
          tabs: [
            Tab(
              icon: const Icon(Icons.download_rounded, size: 20),
              text: 'طلباتي (${state.requests.length})',
            ),
            Tab(
              icon: const Icon(Icons.upload_rounded, size: 20),
              text: 'عروضي (${state.offers.length})',
            ),
          ],
        ),
      ),
      body: state.isLoading
          ? const Center(child: CircularProgressIndicator())
          : state.errorMessage != null &&
                  state.requests.isEmpty &&
                  state.offers.isEmpty
              ? _buildErrorView(state.errorMessage!)
              : TabBarView(
                  controller: _tabController,
                  children: [
                    // Tab 1: Requests made by the user (as borrower)
                    _buildSwapsList(
                      swaps: state.requests,
                      isLender: false,
                      isUpdating: state.isUpdating,
                      emptyMessage: 'لا توجد طلبات استعارة حالية',
                      emptySubMessage:
                          'عندما تطلب استعارة غرض من الجيران ستظهر هنا',
                    ),
                    // Tab 2: Requests received for user's items (as lender)
                    _buildSwapsList(
                      swaps: state.offers,
                      isLender: true,
                      isUpdating: state.isUpdating,
                      emptyMessage: 'لا توجد عروض أو طلبات مستلمة',
                      emptySubMessage:
                          'عندما يطلب أحد الجيران غرضاً قمت بنشره ستجده هنا',
                    ),
                  ],
                ),
    );
  }

  Widget _buildSwapsList({
    required List<SwapItemEntity> swaps,
    required bool isLender,
    required bool isUpdating,
    required String emptyMessage,
    required String emptySubMessage,
  }) {
    return RefreshIndicator(
      onRefresh: () =>
          ref.read(swapsControllerProvider.notifier).loadSwaps(),
      child: swaps.isEmpty
          ? LayoutBuilder(
              builder: (context, constraints) => SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                child: ConstrainedBox(
                  constraints:
                      BoxConstraints(minHeight: constraints.maxHeight),
                  child: Center(
                    child: Padding(
                      padding: const EdgeInsets.all(32),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            isLender
                                ? Icons.inventory_2_outlined
                                : Icons.handshake_outlined,
                            size: 64,
                            color: AppColors.textMuted.withValues(alpha: 0.5),
                          ),
                          const SizedBox(height: 16),
                          Text(
                            emptyMessage,
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: AppColors.textPrimary,
                            ),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 8),
                          Text(
                            emptySubMessage,
                            style: const TextStyle(
                              fontSize: 13,
                              color: AppColors.textMuted,
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            )
          : ListView.builder(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.symmetric(vertical: 12),
              itemCount: swaps.length,
              itemBuilder: (context, index) {
                final swap = swaps[index];
                return SwapCard(
                  swap: swap,
                  isLender: isLender,
                  isUpdating: isUpdating,
                  onStatusChange: (status) =>
                      _handleStatusChange(swap.id, status),
                );
              },
            ),
    );
  }

  Widget _buildErrorView(String message) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.error_outline,
              size: 48,
              color: AppColors.error,
            ),
            const SizedBox(height: 16),
            Text(
              message,
              style: const TextStyle(
                color: AppColors.textSecondary,
                fontSize: 14,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () =>
                  ref.read(swapsControllerProvider.notifier).loadSwaps(),
              child: const Text('إعادة المحاولة'),
            ),
          ],
        ),
      ),
    );
  }
}
