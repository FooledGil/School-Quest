import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../models/quest_model.dart';
import '../../providers/quests_provider.dart';
import 'quest_submit_sheet.dart';

class QuestsScreen extends StatefulWidget {
  const QuestsScreen({super.key});

  @override
  State<QuestsScreen> createState() => _QuestsScreenState();
}

class _QuestsScreenState extends State<QuestsScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  String _selectedStatusFilter = 'all'; // 'all', 'active', 'pending', 'completed'

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
    final totalQuests = provider.mainQuests.length + provider.additionalQuests.length;
    final completedCount = provider.mainQuests.where((q) => q.submissionStatus == 'approved').length +
        provider.additionalQuests.where((q) => q.submissionStatus == 'approved').length;

    return Scaffold(
      backgroundColor: AppColors.surfaceCanvas,
      appBar: AppBar(
        title: const Row(
          children: [
            Icon(Icons.history_edu, color: AppColors.gold, size: 22),
            SizedBox(width: 8),
            Text(
              'PAPAN QUEST PETUALANG',
              style: TextStyle(
                fontFamily: 'Outfit',
                fontWeight: FontWeight.w800,
                letterSpacing: 0.8,
                fontSize: 16,
              ),
            ),
          ],
        ),
      ),
      body: provider.isLoading && provider.mainQuests.isEmpty
          ? const Center(child: CircularProgressIndicator(color: AppColors.manaCyan))
          : RefreshIndicator(
              color: AppColors.gold,
              backgroundColor: AppColors.surfaceCard,
              onRefresh: () => provider.fetchQuests(),
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // ── 1. Guild Notice Board Overview Card ──
                    _buildGuildNoticeOverview(totalQuests, completedCount),

                    const SizedBox(height: 14),

                    // ── 2. Segmented Capsule Tabs (Main vs Additional) ──
                    _buildSegmentedTabs(provider),

                    const SizedBox(height: 12),

                    // ── 3. Status Filter Scrollable Chips ──
                    _buildStatusFilterChips(),

                    const SizedBox(height: 14),

                    // ── 4. Filtered Quest Cards Stream ──
                    AnimatedBuilder(
                      animation: _tabController,
                      builder: (context, _) {
                        final currentList = _tabController.index == 0
                            ? provider.mainQuests
                            : provider.additionalQuests;
                        return _buildQuestsList(currentList);
                      },
                    ),

                    const SizedBox(height: 30),
                  ],
                ),
              ),
            ),
    );
  }

  // ─── Guild Notice Board Overview Card ───
  Widget _buildGuildNoticeOverview(int total, int completed) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surfaceCard,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderPixel),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.3),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Breadcrumb tag
          Row(
            children: [
              const Icon(Icons.pin_drop, size: 14, color: AppColors.manaCyan),
              const SizedBox(width: 4),
              Text(
                'ADVENTURERS GUILD HQ • NOTICE BOARD',
                style: const TextStyle(
                  fontSize: 9.5,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 1.0,
                  color: AppColors.manaCyan,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),

          // Title
          const Row(
            children: [
              Icon(Icons.history_edu, size: 20, color: AppColors.gold),
              SizedBox(width: 8),
              Text(
                'Papan Quest Petualang',
                style: TextStyle(
                  fontFamily: 'Outfit',
                  fontSize: 16,
                  fontWeight: FontWeight.w800,
                  color: AppColors.textPrimary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),

          // Narrative subtitle
          const Text(
            'Selamat datang di Balai Petualang! Pilih misi harian & tantangan ekstra dari papan buletin, selesaikan tugas belajarmu, lalu kumpulkan EXP.',
            style: TextStyle(
              fontSize: 12,
              color: AppColors.textSecondary,
              height: 1.4,
            ),
          ),
          const SizedBox(height: 12),

          // Quick metrics chips
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.surfaceDeep,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: AppColors.borderPixel),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.assignment, size: 13, color: AppColors.manaCyan),
                    const SizedBox(width: 5),
                    Text(
                      'TOTAL: $total QUEST',
                      style: const TextStyle(
                        fontSize: 10.5,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.surfaceDeep,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: AppColors.borderPixel),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.check_circle, size: 13, color: AppColors.emerald),
                    const SizedBox(width: 5),
                    Text(
                      'SELESAI: $completed',
                      style: const TextStyle(
                        fontSize: 10.5,
                        fontWeight: FontWeight.w700,
                        color: AppColors.emerald,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // ─── Segmented Tabs ───
  Widget _buildSegmentedTabs(QuestsProvider provider) {
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: AppColors.surfaceCard,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.borderPixel),
      ),
      child: TabBar(
        controller: _tabController,
        indicator: BoxDecoration(
          color: AppColors.primaryContainer,
          borderRadius: BorderRadius.circular(9),
        ),
        indicatorSize: TabBarIndicatorSize.tab,
        labelColor: AppColors.onPrimaryContainer,
        unselectedLabelColor: AppColors.textMuted,
        labelStyle: const TextStyle(
          fontFamily: 'Outfit',
          fontSize: 12,
          fontWeight: FontWeight.w800,
          letterSpacing: 0.5,
        ),
        unselectedLabelStyle: const TextStyle(
          fontFamily: 'Outfit',
          fontSize: 12,
          fontWeight: FontWeight.w600,
        ),
        tabs: [
          Tab(text: 'MAIN QUESTS (${provider.mainQuests.length})'),
          Tab(text: 'ADDITIONAL (${provider.additionalQuests.length})'),
        ],
      ),
    );
  }

  // ─── Status Filter Chips ───
  Widget _buildStatusFilterChips() {
    final filters = [
      {'id': 'all', 'label': 'SEMUA'},
      {'id': 'active', 'label': 'AKTIF'},
      {'id': 'pending', 'label': 'PENDING'},
      {'id': 'completed', 'label': 'SELESAI'},
    ];

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: filters.map((f) {
          final isSelected = _selectedStatusFilter == f['id'];

          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: InkWell(
              onTap: () => setState(() => _selectedStatusFilter = f['id']!),
              borderRadius: BorderRadius.circular(9999),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                decoration: BoxDecoration(
                  color: isSelected ? AppColors.manaCyan : AppColors.surfaceCard,
                  borderRadius: BorderRadius.circular(9999),
                  border: Border.all(
                    color: isSelected ? AppColors.manaCyan : AppColors.borderPixel,
                  ),
                ),
                child: Text(
                  f['label']!,
                  style: TextStyle(
                    fontFamily: 'Outfit',
                    fontSize: 11,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 0.6,
                    color: isSelected ? AppColors.surfaceDeep : AppColors.textMuted,
                  ),
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  // ─── Quest Cards List ───
  Widget _buildQuestsList(List<QuestModel> rawQuests) {
    // Apply status filter
    final quests = rawQuests.where((q) {
      if (_selectedStatusFilter == 'all') return true;
      if (_selectedStatusFilter == 'active') {
        return q.submissionStatus == null || q.submissionStatus == 'none' || q.submissionStatus == 'rejected';
      }
      if (_selectedStatusFilter == 'pending') {
        return q.submissionStatus == 'pending';
      }
      if (_selectedStatusFilter == 'completed') {
        return q.submissionStatus == 'approved';
      }
      return true;
    }).toList();

    if (quests.isEmpty) {
      return Container(
        margin: const EdgeInsets.only(top: 20),
        padding: const EdgeInsets.symmetric(vertical: 30, horizontal: 20),
        decoration: BoxDecoration(
          color: AppColors.surfaceCard,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.borderPixel),
        ),
        child: const Center(
          child: Text(
            'Tidak ada misi yang sesuai dengan filter.',
            style: TextStyle(color: AppColors.textMuted, fontSize: 13),
          ),
        ),
      );
    }

    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: quests.length,
      itemBuilder: (context, index) {
        final quest = quests[index];
        return _buildQuestItemCard(quest);
      },
    );
  }

  Widget _buildQuestItemCard(QuestModel quest) {
    Color diffColor = AppColors.emerald;
    if (quest.difficulty == 'medium') diffColor = AppColors.amberGlow;
    if (quest.difficulty == 'hard') diffColor = AppColors.ruby;

    final isApproved = quest.submissionStatus == 'approved';
    final isPending = quest.submissionStatus == 'pending';

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surfaceCard,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isApproved ? AppColors.emerald.withOpacity(0.4) : AppColors.borderPixel,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.25),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Row 1: Badges & Rewards
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2.5),
                    decoration: BoxDecoration(
                      color: AppColors.surfaceDeep,
                      borderRadius: BorderRadius.circular(5),
                    ),
                    child: Text(
                      quest.category.toUpperCase(),
                      style: const TextStyle(
                        fontSize: 9.5,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.6,
                        color: AppColors.manaCyan,
                      ),
                    ),
                  ),
                  const SizedBox(width: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2.5),
                    decoration: BoxDecoration(
                      color: diffColor.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(5),
                    ),
                    child: Text(
                      quest.difficulty.toUpperCase(),
                      style: TextStyle(
                        fontSize: 9.5,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.6,
                        color: diffColor,
                      ),
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppColors.surfaceDeep,
                  borderRadius: BorderRadius.circular(9999),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.auto_awesome, size: 13, color: AppColors.amberGlow),
                    const SizedBox(width: 4),
                    Text(
                      '+${quest.expReward} EXP',
                      style: const TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        color: AppColors.amberGlow,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),

          // Title
          Text(
            quest.title,
            style: const TextStyle(
              fontFamily: 'Outfit',
              fontSize: 15,
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 4),

          // Description
          Text(
            quest.description,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(
              fontSize: 12,
              color: AppColors.textMuted,
              height: 1.35,
            ),
          ),
          const SizedBox(height: 12),

          // Status & Action button
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Status Badge
              if (isApproved)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: AppColors.emerald.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: const Row(
                    children: [
                      Icon(Icons.check_circle, size: 13, color: AppColors.emerald),
                      SizedBox(width: 4),
                      Text(
                        'SELESAI (TERVERIFIKASI)',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                          color: AppColors.emerald,
                        ),
                      ),
                    ],
                  ),
                )
              else if (isPending)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: AppColors.gold.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: const Row(
                    children: [
                      Icon(Icons.hourglass_top, size: 13, color: AppColors.gold),
                      SizedBox(width: 4),
                      Text(
                        'MENUNGGU REVIEW GURU',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                          color: AppColors.gold,
                        ),
                      ),
                    ],
                  ),
                )
              else
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: AppColors.surfaceDeep,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: const Text(
                    'BELUM DIKERJAKAN',
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textMuted,
                    ),
                  ),
                ),

              // Action button
              if (!isApproved)
                ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: isPending ? AppColors.surfaceDeep : AppColors.secondaryContainer,
                    foregroundColor: isPending ? AppColors.textSecondary : AppColors.onSecondaryContainer,
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                  onPressed: () {
                    showModalBottomSheet(
                      context: context,
                      isScrollControlled: true,
                      backgroundColor: Colors.transparent,
                      builder: (_) => QuestSubmitSheet(quest: quest),
                    ).then((_) {
                      Provider.of<QuestsProvider>(context, listen: false).fetchQuests();
                    });
                  },
                  icon: Icon(isPending ? Icons.edit_note : Icons.sports_martial_arts, size: 15),
                  label: Text(
                    isPending ? 'Ubah Bukti' : 'KERJAKAN',
                    style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w800),
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }
}
