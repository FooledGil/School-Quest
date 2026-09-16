import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../models/leaderboard_model.dart';
import '../../providers/leaderboard_provider.dart';
import '../../widgets/avatar_widget.dart';
import '../../widgets/glass_card.dart';
import '../../widgets/podium_widget.dart';
import '../../widgets/rank_badge.dart';

class LeaderboardScreen extends StatefulWidget {
  const LeaderboardScreen({super.key});

  @override
  State<LeaderboardScreen> createState() => _LeaderboardScreenState();
}

class _LeaderboardScreenState extends State<LeaderboardScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<LeaderboardProvider>(context, listen: false).fetchLeaderboard();
    });
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<LeaderboardProvider>(context);
    final students = provider.currentStudents;
    final topThree = students.take(3).toList();
    final remainingStudents = students.skip(3).toList();
    final myRank = provider.myRank;
    final resetInfo = provider.resetInfo;

    return Scaffold(
      backgroundColor: AppColors.bgDark,
      appBar: AppBar(
        title: const Text(
          'HALL OF FAME',
          style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1.2),
        ),
      ),
      body: provider.isLoading && students.isEmpty
          ? const Center(child: CircularProgressIndicator(color: AppColors.primaryLight))
          : RefreshIndicator(
              color: AppColors.primaryLight,
              onRefresh: () => provider.fetchLeaderboard(),
              child: Stack(
                children: [
                  SingleChildScrollView(
                    padding: const EdgeInsets.only(bottom: 110),
                    child: Column(
                      children: [
                        const SizedBox(height: 12),

                        // Weekly vs Overall Switcher
                        _buildTabSelector(provider),

                        const SizedBox(height: 12),

                        // Reset Info Banner
                        if (provider.activeTab == LeaderboardTab.weekly && resetInfo != null)
                          _buildResetBanner(resetInfo),

                        // Catch-Up Multiplier Banner (if active)
                        if (myRank != null && myRank.catchUpMultiplier > 1.0)
                          _buildCatchUpBanner(myRank),

                        // 3D Podium for Top 3
                        if (topThree.isNotEmpty)
                          PodiumWidget(topThree: topThree),

                        const SizedBox(height: 8),

                        // Remaining Rankings (4th onwards)
                        if (remainingStudents.isNotEmpty)
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            child: ListView.builder(
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              itemCount: remainingStudents.length,
                              itemBuilder: (context, index) {
                                final student = remainingStudents[index];
                                final isMe = myRank != null && student.id == myRank.id;
                                return _buildRankingRow(student, isMe);
                              },
                            ),
                          ),
                      ],
                    ),
                  ),

                  // Floating "Peringkat Saya" Sticky Card
                  if (myRank != null)
                    Positioned(
                      left: 16,
                      right: 16,
                      bottom: 16,
                      child: _buildMyRankFloatingCard(myRank, provider.activeTab),
                    ),
                ],
              ),
            ),
    );
  }

  Widget _buildTabSelector(LeaderboardProvider provider) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: AppColors.bgCard,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Expanded(
            child: _tabButton(
              title: 'Mingguan (Weekly)',
              icon: Icons.timer_outlined,
              isSelected: provider.activeTab == LeaderboardTab.weekly,
              onTap: () => provider.setTab(LeaderboardTab.weekly),
            ),
          ),
          Expanded(
            child: _tabButton(
              title: 'Keseluruhan (Overall)',
              icon: Icons.all_inclusive,
              isSelected: provider.activeTab == LeaderboardTab.overall,
              onTap: () => provider.setTab(LeaderboardTab.overall),
            ),
          ),
        ],
      ),
    );
  }

  Widget _tabButton({
    required String title,
    required IconData icon,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primary : Colors.transparent,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 16, color: isSelected ? Colors.white : AppColors.textMuted),
            const SizedBox(width: 6),
            Text(
              title,
              style: TextStyle(
                fontSize: 12,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                color: isSelected ? Colors.white : AppColors.textSecondary,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildResetBanner(ResetInfoModel resetInfo) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: AppColors.sapphire.withOpacity(0.12),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.sapphire.withOpacity(0.4)),
      ),
      child: Row(
        children: [
          const Icon(Icons.alarm, color: AppColors.sapphire, size: 18),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              'Reset Mingguan: ${resetInfo.daysRemaining} hari ${resetInfo.hoursRemaining} jam lagi (Setiap Senin 00:00 WIB)',
              style: const TextStyle(fontSize: 12, color: AppColors.textPrimary),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCatchUpBanner(MyRankModel myRank) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: AppColors.flameOrange.withOpacity(0.12),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.flameOrange.withOpacity(0.4)),
      ),
      child: Row(
        children: [
          const Icon(Icons.flash_on, color: AppColors.flameOrange, size: 20),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              'CHALLENGER SURGE AKTIF (${myRank.catchUpMultiplier}x EXP Boost): Kerjakan quest untuk mengejar lawan!',
              style: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.bold,
                color: AppColors.flameOrange,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRankingRow(LeaderboardEntryModel student, bool isMe) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: isMe ? AppColors.primary.withOpacity(0.15) : AppColors.bgCard,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isMe ? AppColors.primaryLight : AppColors.border,
          width: isMe ? 1.5 : 0.8,
        ),
      ),
      child: Row(
        children: [
          // Rank Number
          SizedBox(
            width: 28,
            child: Text(
              '#${student.rankNumber}',
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.bold,
                color: isMe ? AppColors.primaryLight : AppColors.textMuted,
              ),
            ),
          ),
          const SizedBox(width: 8),
          AvatarWidget(
            avatar: student.avatar,
            avatarSeed: student.avatarSeed,
            size: 38,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  student.name,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  '${student.studentClass} • Level ${student.level}',
                  style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                '${student.exp} EXP',
                style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.bold,
                  color: AppColors.gold,
                ),
              ),
              const SizedBox(height: 2),
              RankBadge(rank: student.rankName, fontSize: 9),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMyRankFloatingCard(MyRankModel myRank, LeaderboardTab tab) {
    final rank = tab == LeaderboardTab.weekly ? myRank.weeklyRank : myRank.overallRank;

    return GlassCard(
      backgroundColor: AppColors.bgSurface,
      borderColor: AppColors.primaryLight.withOpacity(0.6),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: AppColors.primary,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              '#$rank',
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Peringkat Saya Saat Ini',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primaryLight,
                  ),
                ),
                if (myRank.nextAheadName != null) ...[
                  const SizedBox(height: 2),
                  Text(
                    'Selisih ${myRank.nextAheadGap} EXP dari ${myRank.nextAheadName}',
                    style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
                  ),
                ],
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                '${myRank.exp} EXP',
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: AppColors.gold,
                ),
              ),
              Text(
                'Level ${myRank.level}',
                style: const TextStyle(fontSize: 11, color: AppColors.textMuted),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
