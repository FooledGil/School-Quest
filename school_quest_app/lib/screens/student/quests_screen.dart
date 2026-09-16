import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../models/quest_model.dart';
import '../../providers/quests_provider.dart';
import '../../widgets/glass_card.dart';
import 'quest_submit_sheet.dart';

class QuestsScreen extends StatefulWidget {
  const QuestsScreen({super.key});

  @override
  State<QuestsScreen> createState() => _QuestsScreenState();
}

class _QuestsScreenState extends State<QuestsScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<QuestsProvider>(context, listen: false).fetchQuests();
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<QuestsProvider>(context);

    return Scaffold(
      backgroundColor: AppColors.bgDark,
      appBar: AppBar(
        title: const Text(
          'PAPAN MISI PETUALANGAN',
          style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1),
        ),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: AppColors.primaryLight,
          labelColor: AppColors.primaryLight,
          unselectedLabelColor: AppColors.textMuted,
          tabs: [
            Tab(text: 'Misi Harian (${provider.mainQuests.length})'),
            Tab(text: 'Misi Tambahan (${provider.additionalQuests.length})'),
          ],
        ),
      ),
      body: provider.isLoading && provider.mainQuests.isEmpty
          ? const Center(child: CircularProgressIndicator(color: AppColors.primaryLight))
          : RefreshIndicator(
              color: AppColors.primaryLight,
              onRefresh: () => provider.fetchQuests(),
              child: TabBarView(
                controller: _tabController,
                children: [
                  _buildQuestsList(provider.mainQuests, 'Belum ada misi harian hari ini.'),
                  _buildQuestsList(provider.additionalQuests, 'Belum ada misi tambahan aktif.'),
                ],
              ),
            ),
    );
  }

  Widget _buildQuestsList(List<QuestModel> quests, String emptyMessage) {
    if (quests.isEmpty) {
      return Center(
        child: Text(
          emptyMessage,
          style: const TextStyle(color: AppColors.textMuted, fontSize: 14),
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      itemCount: quests.length,
      itemBuilder: (context, index) {
        final quest = quests[index];
        return _buildQuestCard(quest);
      },
    );
  }

  Widget _buildQuestCard(QuestModel quest) {
    Color diffColor = AppColors.emerald;
    if (quest.difficulty == 'medium') diffColor = AppColors.gold;
    if (quest.difficulty == 'hard') diffColor = AppColors.ruby;

    return GlassCard(
      margin: const EdgeInsets.only(bottom: 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header badges
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  // Category
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(color: AppColors.primary.withOpacity(0.4)),
                    ),
                    child: Text(
                      quest.category.toUpperCase(),
                      style: const TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: AppColors.primaryLight,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  // Difficulty
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: diffColor.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(color: diffColor.withOpacity(0.4)),
                    ),
                    child: Text(
                      quest.difficulty.toUpperCase(),
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: diffColor,
                      ),
                    ),
                  ),
                ],
              ),
              // EXP reward
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppColors.gold.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.bolt, size: 14, color: AppColors.gold),
                    Text(
                      '+${quest.expReward} EXP',
                      style: const TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: AppColors.gold,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 10),

          // Quest Title & Description
          Text(
            quest.title,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            quest.description,
            style: const TextStyle(fontSize: 13, color: AppColors.textSecondary),
          ),

          // Rejection reason banner (if rejected by teacher)
          if (quest.isRejected && quest.rejectionReason != null) ...[
            const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: AppColors.ruby.withOpacity(0.12),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: AppColors.ruby.withOpacity(0.4)),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(Icons.cancel_outlined, color: AppColors.ruby, size: 16),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Alasan Penolakan Guru: ${quest.rejectionReason}',
                      style: const TextStyle(fontSize: 12, color: AppColors.ruby),
                    ),
                  ),
                ],
              ),
            ),
          ],

          const SizedBox(height: 14),

          // Action Status or Submit Button
          _buildQuestActionArea(quest),
        ],
      ),
    );
  }

  Widget _buildQuestActionArea(QuestModel quest) {
    if (quest.isApproved) {
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 10),
        decoration: BoxDecoration(
          color: AppColors.emerald.withOpacity(0.15),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: AppColors.emerald.withOpacity(0.4)),
        ),
        child: const Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.check_circle, size: 16, color: AppColors.emerald),
            SizedBox(width: 6),
            Text(
              'MISI SELESAI (EXP DITERIMA)',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                color: AppColors.emerald,
              ),
            ),
          ],
        ),
      );
    }

    if (quest.isPending) {
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 10),
        decoration: BoxDecoration(
          color: AppColors.gold.withOpacity(0.15),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: AppColors.gold.withOpacity(0.4)),
        ),
        child: const Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.hourglass_top, size: 16, color: AppColors.gold),
            SizedBox(width: 6),
            Text(
              'MENUNGGU VALIDASI GURU',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                color: AppColors.gold,
              ),
            ),
          ],
        ),
      );
    }

    // Uncompleted or Rejected (can submit / resubmit)
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton.icon(
        style: ElevatedButton.styleFrom(
          backgroundColor: quest.isRejected ? AppColors.ruby : AppColors.primary,
        ),
        onPressed: () {
          showModalBottomSheet(
            context: context,
            isScrollControlled: true,
            backgroundColor: Colors.transparent,
            builder: (_) => QuestSubmitSheet(quest: quest),
          );
        },
        icon: const Icon(Icons.upload_file, size: 16),
        label: Text(
          quest.isRejected ? 'KIRIM ULANG BUKTI' : 'KERJAKAN & SERAHKAN BUKTI',
          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }
}
