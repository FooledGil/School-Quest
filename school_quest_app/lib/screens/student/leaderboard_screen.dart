import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../models/leaderboard_model.dart';
import '../../providers/leaderboard_provider.dart';
import '../../widgets/avatar_widget.dart';
import '../../widgets/podium_widget.dart';

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

  void _showRulesDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.surfaceCard,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: AppColors.borderPixel),
        ),
        title: const Row(
          children: [
            Icon(Icons.help_outline, color: AppColors.gold, size: 20),
            SizedBox(width: 8),
            Text(
              'Aturan Hall of Fame',
              style: TextStyle(
                fontFamily: 'Outfit',
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: AppColors.textPrimary,
              ),
            ),
          ],
        ),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '1. Peringkat Mingguan direset setiap hari Senin pukul 00:00 WIB.\n'
              '2. Selesaikan misi harian & tambahan untuk mendulang EXP mingguan.\n'
              '3. Top 3 murid di akhir pekan berhak menyandang gelar Juara Kelas dan bonus loot XP!\n'
              '4. Murid di peringkat bawah otomatis mendapatkan bonus pengganda Catch-up EXP.',
              style: TextStyle(fontSize: 12.5, color: AppColors.textSecondary, height: 1.4),
            ),
          ],
        ),
        actions: [
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primaryContainer,
              foregroundColor: AppColors.onPrimaryContainer,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Saya Paham'),
          ),
        ],
      ),
    );
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
      backgroundColor: AppColors.surfaceCanvas,
      appBar: AppBar(
        title: const Row(
          children: [
            Icon(Icons.military_tech, color: AppColors.gold, size: 22),
            SizedBox(width: 8),
            Text(
              'HALL OF FAME',
              style: TextStyle(
                fontFamily: 'Outfit',
                fontWeight: FontWeight.w800,
                letterSpacing: 0.8,
                fontSize: 16,
              ),
            ),
          ],
        ),
        actions: [
          TextButton.icon(
            style: TextButton.styleFrom(
              foregroundColor: AppColors.manaCyan,
            ),
            onPressed: _showRulesDialog,
            icon: const Icon(Icons.help_outline, size: 16),
            label: const Text(
              'Aturan',
              style: TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.w700, fontSize: 12),
            ),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: provider.isLoading && students.isEmpty
          ? const Center(child: CircularProgressIndicator(color: AppColors.manaCyan))
          : RefreshIndicator(
              color: AppColors.gold,
              backgroundColor: AppColors.surfaceCard,
              onRefresh: () => provider.fetchLeaderboard(),
              child: Stack(
                children: [
                  SingleChildScrollView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    padding: const EdgeInsets.only(bottom: 120),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // ── 1. Weekly vs Overall Tabs ──
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          child: _buildModeSwitcher(provider),
                        ),

                        // ── 2. Cycle Countdown Ribbon ──
                        if (provider.activeTab == LeaderboardTab.weekly && resetInfo != null)
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                            child: _buildCycleCountdownRibbon(resetInfo),
                          ),

                        // Catch-Up Multiplier Banner (if any)
                        if (myRank != null && myRank.catchUpMultiplier > 1.0)
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                            child: _buildCatchUpBanner(myRank),
                          ),

                        // ── 3. Arena Reference Banner ──
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          child: _buildArenaBanner(),
                        ),

                        // ── 4. 3D Stepped Podium for Top 3 ──
                        if (topThree.isNotEmpty)
                          PodiumWidget(
                            topThree: topThree,
                            currentUserId: myRank?.id,
                          ),

                        const SizedBox(height: 12),

                        // ── 5. Challenger Stream (Ranks 4+) ──
                        if (remainingStudents.isNotEmpty) ...[
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Row(
                                      children: [
                                        Icon(Icons.format_list_numbered, size: 16, color: AppColors.manaCyan),
                                        SizedBox(width: 6),
                                        Text(
                                          'Hero Penantang',
                                          style: TextStyle(
                                            fontFamily: 'Outfit',
                                            fontSize: 14,
                                            fontWeight: FontWeight.w700,
                                            color: AppColors.textPrimary,
                                          ),
                                        ),
                                      ],
                                    ),
                                    Text(
                                      'TOP SEKOLAH',
                                      style: TextStyle(
                                        fontSize: 9.5,
                                        fontWeight: FontWeight.w800,
                                        letterSpacing: 0.8,
                                        color: AppColors.textMuted,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 8),

                                // Table Micro-Header
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                  decoration: BoxDecoration(
                                    color: AppColors.surfaceDeep,
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: const Row(
                                    children: [
                                      SizedBox(
                                        width: 38,
                                        child: Text(
                                          'RANK',
                                          style: TextStyle(
                                            fontSize: 9,
                                            fontWeight: FontWeight.w800,
                                            color: AppColors.textMuted,
                                            letterSpacing: 0.6,
                                          ),
                                        ),
                                      ),
                                      Expanded(
                                        flex: 5,
                                        child: Text(
                                          'HERO / MURID',
                                          style: TextStyle(
                                            fontSize: 9,
                                            fontWeight: FontWeight.w800,
                                            color: AppColors.textMuted,
                                            letterSpacing: 0.6,
                                          ),
                                        ),
                                      ),
                                      Expanded(
                                        flex: 3,
                                        child: Text(
                                          'KELAS',
                                          textAlign: TextAlign.center,
                                          style: TextStyle(
                                            fontSize: 9,
                                            fontWeight: FontWeight.w800,
                                            color: AppColors.textMuted,
                                            letterSpacing: 0.6,
                                          ),
                                        ),
                                      ),
                                      SizedBox(
                                        width: 60,
                                        child: Text(
                                          'EXP',
                                          textAlign: TextAlign.right,
                                          style: TextStyle(
                                            fontSize: 9,
                                            fontWeight: FontWeight.w800,
                                            color: AppColors.textMuted,
                                            letterSpacing: 0.6,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                const SizedBox(height: 6),

                                // Rows
                                ListView.builder(
                                  shrinkWrap: true,
                                  physics: const NeverScrollableScrollPhysics(),
                                  itemCount: remainingStudents.length,
                                  itemBuilder: (context, index) {
                                    final student = remainingStudents[index];
                                    final isMe = myRank != null && student.id == myRank.id;
                                    return _buildRankRow(student, isMe);
                                  },
                                ),
                              ],
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),

                  // ── 6. Floating "Peringkat Saya" Sticky Card ──
                  if (myRank != null)
                    Positioned(
                      left: 16,
                      right: 16,
                      bottom: 14,
                      child: _buildMyRankFloatingCard(myRank, provider.activeTab),
                    ),
                ],
              ),
            ),
    );
  }

  Widget _buildModeSwitcher(LeaderboardProvider provider) {
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: AppColors.surfaceDeep,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.borderPixel),
      ),
      child: Row(
        children: [
          Expanded(
            child: _switcherButton(
              title: 'MINGGUAN (WEEKLY)',
              icon: Icons.bolt,
              isSelected: provider.activeTab == LeaderboardTab.weekly,
              onTap: () => provider.setTab(LeaderboardTab.weekly),
            ),
          ),
          Expanded(
            child: _switcherButton(
              title: 'OVERALL (ALL-TIME)',
              icon: Icons.workspace_premium,
              isSelected: provider.activeTab == LeaderboardTab.overall,
              onTap: () => provider.setTab(LeaderboardTab.overall),
            ),
          ),
        ],
      ),
    );
  }

  Widget _switcherButton({
    required String title,
    required IconData icon,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 9),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.secondaryContainer : Colors.transparent,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              size: 15,
              color: isSelected ? AppColors.amberGlow : AppColors.textMuted,
            ),
            const SizedBox(width: 5),
            Text(
              title,
              style: TextStyle(
                fontFamily: 'Outfit',
                fontSize: 10.5,
                fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                letterSpacing: 0.5,
                color: isSelected ? AppColors.onSecondaryContainer : AppColors.textMuted,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCycleCountdownRibbon(ResetInfoModel resetInfo) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      decoration: BoxDecoration(
        color: AppColors.surfaceCard,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.borderPixel),
      ),
      child: Row(
        children: [
          Container(
            width: 28,
            height: 28,
            decoration: const BoxDecoration(
              color: AppColors.surfaceDeep,
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.update, size: 16, color: AppColors.gold),
          ),
          const SizedBox(width: 10),
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Siklus Mingguan',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary,
                  ),
                ),
                Text(
                  'Reset setiap Senin 00:00 WIB',
                  style: TextStyle(
                    fontSize: 10,
                    color: AppColors.textMuted,
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(
              color: AppColors.surfaceDeep,
              borderRadius: BorderRadius.circular(9999),
            ),
            child: Row(
              children: [
                const Icon(Icons.hourglass_top, size: 12, color: AppColors.amberGlow),
                const SizedBox(width: 4),
                Text(
                  '${resetInfo.daysRemaining}h ${resetInfo.hoursRemaining}j',
                  style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w800,
                    color: AppColors.amberGlow,
                    fontFamily: 'monospace',
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCatchUpBanner(MyRankModel myRank) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      decoration: BoxDecoration(
        color: AppColors.primary.withOpacity(0.12),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.primary.withOpacity(0.4)),
      ),
      child: Row(
        children: [
          const Icon(Icons.flash_on, color: AppColors.amberGlow, size: 18),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              'CHALLENGER SURGE AKTIF (${myRank.catchUpMultiplier}x EXP Boost)',
              style: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w800,
                color: AppColors.amberGlow,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildArenaBanner() {
    return Container(
      height: 90,
      width: double.infinity,
      decoration: BoxDecoration(
        color: AppColors.surfaceCard,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderPixel),
      ),
      clipBehavior: Clip.antiAlias,
      child: Stack(
        fit: StackFit.expand,
        children: [
          Image.asset(
            'assets/images/realm_banner.png',
            fit: BoxFit.cover,
            errorBuilder: (context, error, stackTrace) => Container(color: AppColors.surfaceDeep),
          ),
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Colors.transparent,
                  AppColors.surfaceCard.withOpacity(0.9),
                ],
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Text(
                      'ARENA PERTEMPURAN NILAI',
                      style: TextStyle(
                        fontSize: 9,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 1.0,
                        color: AppColors.amberGlow,
                      ),
                    ),
                    Text(
                      'Top 3 Pendekar SMKN 1',
                      style: TextStyle(
                        fontFamily: 'Outfit',
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textPrimary,
                      ),
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: AppColors.primaryContainer.withOpacity(0.25),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: const Text(
                    'LIGA MYTHIC',
                    style: TextStyle(
                      fontSize: 9.5,
                      fontWeight: FontWeight.w800,
                      color: AppColors.gold,
                      letterSpacing: 0.6,
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

  Widget _buildRankRow(LeaderboardEntryModel student, bool isMe) {
    return Container(
      margin: const EdgeInsets.only(bottom: 6),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: isMe ? AppColors.secondaryContainer.withOpacity(0.2) : AppColors.surfaceCard,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isMe ? AppColors.manaCyan : AppColors.borderPixel,
        ),
      ),
      child: Row(
        children: [
          // Rank
          SizedBox(
            width: 38,
            child: Text(
              '#${student.rankNumber}',
              style: TextStyle(
                fontFamily: 'Outfit',
                fontSize: 13,
                fontWeight: FontWeight.w800,
                color: isMe ? AppColors.manaCyan : AppColors.textMuted,
              ),
            ),
          ),

          // Hero / Murid
          Expanded(
            flex: 5,
            child: Row(
              children: [
                AvatarWidget(
                  avatar: student.avatar,
                  avatarSeed: student.avatarSeed,
                  size: 30,
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        student.name,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontFamily: 'Outfit',
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: isMe ? AppColors.manaCyan : AppColors.textPrimary,
                        ),
                      ),
                      Text(
                        'Level ${student.level}',
                        style: const TextStyle(fontSize: 10, color: AppColors.textMuted),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Kelas
          Expanded(
            flex: 3,
            child: Text(
              student.studentClass,
              textAlign: TextAlign.center,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                fontSize: 11,
                color: AppColors.textSecondary,
              ),
            ),
          ),

          // EXP
          SizedBox(
            width: 60,
            child: Text(
              '${student.exp}',
              textAlign: TextAlign.right,
              style: const TextStyle(
                fontFamily: 'Outfit',
                fontSize: 13,
                fontWeight: FontWeight.w800,
                color: AppColors.textPrimary,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMyRankFloatingCard(MyRankModel myRank, LeaderboardTab activeTab) {
    final rankNumber = activeTab == LeaderboardTab.weekly ? myRank.weeklyRank : myRank.overallRank;
    final expText = activeTab == LeaderboardTab.weekly
        ? '${myRank.weeklyExp} Weekly EXP'
        : '${myRank.exp} Total EXP';

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: AppColors.surfaceCardElevated,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderActive, width: 1.2),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.55),
            blurRadius: 16,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: AppColors.primaryContainer,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              '#$rankNumber',
              style: const TextStyle(
                fontFamily: 'Outfit',
                fontSize: 14,
                fontWeight: FontWeight.w900,
                color: AppColors.onPrimaryContainer,
              ),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Row(
                  children: [
                    const Text(
                      'Peringkat Kamu',
                      style: TextStyle(
                        fontFamily: 'Outfit',
                        fontSize: 12.5,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      '• Lv.${myRank.level} (${myRank.studentClass})',
                      style: const TextStyle(
                        fontSize: 10.5,
                        color: AppColors.textMuted,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
                Text(
                  expText,
                  style: const TextStyle(
                    fontSize: 11,
                    color: AppColors.manaCyan,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
          if (myRank.catchUpMultiplier > 1.0)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: AppColors.surfaceDeep,
                borderRadius: BorderRadius.circular(6),
              ),
              child: Text(
                '${myRank.catchUpMultiplier}x BOOST',
                style: const TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.w800,
                  color: AppColors.amberGlow,
                ),
              ),
            ),
        ],
      ),
    );
  }
}
