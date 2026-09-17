import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../models/user_model.dart';
import '../../providers/student_dashboard_provider.dart';
import '../../widgets/avatar_widget.dart';
import '../../widgets/exp_progress_bar.dart';
import '../../widgets/rank_badge.dart';
import 'quest_submit_sheet.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<StudentDashboardProvider>(context, listen: false).fetchDashboard();
    });
  }

  @override
  Widget build(BuildContext context) {
    final dashboard = Provider.of<StudentDashboardProvider>(context);
    final user = dashboard.user;
    final stats = dashboard.stats;

    return Scaffold(
      backgroundColor: AppColors.surfaceCanvas,
      body: dashboard.isLoading && user == null
          ? const Center(
              child: CircularProgressIndicator(color: AppColors.manaCyan),
            )
          : RefreshIndicator(
              color: AppColors.gold,
              backgroundColor: AppColors.surfaceCard,
              onRefresh: () => dashboard.fetchDashboard(),
              child: CustomScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                slivers: [
                  // ── 1. Top Realm Header Bar ──
                  SliverAppBar(
                    pinned: true,
                    elevation: 4,
                    shadowColor: Colors.black54,
                    backgroundColor: AppColors.surfaceCard.withOpacity(0.95),
                    title: Row(
                      children: [
                        // Realm Logo
                        Image.asset(
                          'assets/images/realm_logo.png',
                          width: 26,
                          height: 26,
                          fit: BoxFit.contain,
                          errorBuilder: (context, error, stackTrace) => const Icon(
                            Icons.fort,
                            color: AppColors.gold,
                            size: 22,
                          ),
                        ),
                        const SizedBox(width: 8),
                        const Text(
                          'SchoolQuest',
                          style: TextStyle(
                            fontFamily: 'Outfit',
                            fontSize: 18,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 0.5,
                            color: AppColors.textPrimary,
                          ),
                        ),
                      ],
                    ),
                    actions: [
                      // Streak Flame Pill
                      if (user != null)
                        Container(
                          margin: const EdgeInsets.symmetric(vertical: 12),
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                          decoration: BoxDecoration(
                            color: AppColors.surfaceDeep.withOpacity(0.9),
                            borderRadius: BorderRadius.circular(9999),
                            border: Border.all(color: AppColors.borderPixel),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(
                                Icons.local_fire_department,
                                size: 16,
                                color: AppColors.gold,
                              ),
                              const SizedBox(width: 3),
                              Text(
                                '${user.streakDays}D',
                                style: const TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w800,
                                  color: AppColors.amberGlow,
                                ),
                              ),
                            ],
                          ),
                        ),
                      const SizedBox(width: 8),

                      // Notification Bell Button
                      IconButton(
                        style: IconButton.styleFrom(
                          backgroundColor: AppColors.surfaceDeep,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                            side: const BorderSide(color: AppColors.borderPixel),
                          ),
                        ),
                        icon: const Icon(Icons.notifications_outlined, size: 18, color: AppColors.textSecondary),
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Tidak ada pemberitahuan baru saat ini.'),
                              behavior: SnackBarBehavior.floating,
                            ),
                          );
                        },
                      ),
                      const SizedBox(width: 14),
                    ],
                  ),

                  // ── 2. Scrollable Body Content ──
                  SliverPadding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    sliver: SliverList(
                      delegate: SliverChildListDelegate([
                        // Sanction Alert Banner (if any)
                        if (dashboard.activeSanction != null)
                          _buildSanctionBanner(dashboard),

                        // RPG Hero Profile Card
                        if (user != null) _buildHeroProfileCard(user, stats),

                        const SizedBox(height: 16),

                        // 2x2 Quick Stats Grid
                        if (user != null) _buildQuickStatsGrid(user, stats),

                        const SizedBox(height: 22),

                        // Active Quests Section
                        _buildActiveQuestsSection(dashboard),

                        const SizedBox(height: 22),

                        // Realm Visual Showcase Banner
                        _buildRealmShowcaseBanner(),

                        const SizedBox(height: 22),

                        // Achievements Section
                        if (dashboard.achievements.isNotEmpty)
                          _buildAchievementsSection(dashboard),

                        const SizedBox(height: 22),

                        // Today's Timetable Section
                        _buildTimetableSection(dashboard),

                        const SizedBox(height: 20),

                        // Today's Piket Section (if any)
                        if (dashboard.piket != null && dashboard.piket!.members.isNotEmpty) ...[
                          _buildPiketSection(dashboard.piket!),
                          const SizedBox(height: 20),
                        ],

                        const SizedBox(height: 30),
                      ]),
                    ),
                  ),
                ],
              ),
            ),
    );
  }

  // ─── Hero Profile Card ───
  Widget _buildHeroProfileCard(UserModel user, Map<String, dynamic>? stats) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surfaceCard,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderPixel, width: 1),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.35),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Stack(
        children: [
          // Decorative Ambient Backdrop Glow
          Positioned(
            top: -20,
            right: -20,
            child: Container(
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppColors.manaCyan.withOpacity(0.08),
              ),
            ),
          ),
          Positioned(
            bottom: -20,
            left: -20,
            child: Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppColors.primary.withOpacity(0.08),
              ),
            ),
          ),

          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top Row: Avatar + Details
                Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    // Squircle RPG Avatar Frame with Level Badge
                    AvatarWidget(
                      avatar: user.avatar,
                      avatarSeed: user.avatarSeed,
                      size: 60,
                      borderWidth: 2,
                      borderColor: AppColors.manaCyan.withOpacity(0.4),
                      level: user.level,
                    ),
                    const SizedBox(width: 14),

                    // Player Details
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Flexible(
                                child: Text(
                                  user.name.toUpperCase(),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(
                                    fontFamily: 'Outfit',
                                    fontSize: 18,
                                    fontWeight: FontWeight.w800,
                                    color: AppColors.textPrimary,
                                    letterSpacing: 0.5,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 6),
                              RankBadge(
                                rank: user.rankName,
                                fontSize: 10,
                              ),
                            ],
                          ),
                          const SizedBox(height: 3),
                          Text(
                            'NISN: ${user.nisn ?? "0084169869"} • ${user.studentClass ?? "XII RPL"}',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontSize: 12,
                              color: AppColors.textMuted,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Row(
                            children: [
                              const Icon(Icons.school, size: 13, color: AppColors.tertiary),
                              const SizedBox(width: 4),
                              Expanded(
                                child: Text(
                                  'SMK Rekayasa Perangkat Lunak',
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w600,
                                    color: AppColors.tertiary,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 16),

                // EXP Gauge Module
                ExpProgressBar(
                  currentExp: user.exp,
                  expInLevel: stats?['exp_in_level'],
                  expNeededInLevel: stats?['exp_needed_in_level'],
                  expPercentage: (stats?['exp_percentage'] as num?)?.toDouble(),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ─── 2x2 Quick Stats Grid ───
  Widget _buildQuickStatsGrid(UserModel user, Map<String, dynamic>? stats) {
    final completedQuests = stats?['completed_quests_count'] ?? stats?['quests_completed'] ?? 1;
    final rankPos = stats?['rank_position'] ?? 9;

    return GridView.count(
      crossAxisCount: 2,
      crossAxisSpacing: 10,
      mainAxisSpacing: 10,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      childAspectRatio: 1.55,
      children: [
        // Total EXP
        _buildStatCard(
          label: 'TOTAL EXP',
          value: '${user.exp}',
          unit: 'PTS',
          icon: Icons.star,
          iconColor: AppColors.amberGlow,
          valueColor: AppColors.textPrimary,
        ),
        // Quest Selesai
        _buildStatCard(
          label: 'QUEST SELESAI',
          value: '$completedQuests',
          unit: 'MISI',
          icon: Icons.task_alt,
          iconColor: AppColors.tertiary,
          valueColor: AppColors.textPrimary,
        ),
        // Daily Streak
        _buildStatCard(
          label: 'DAILY STREAK',
          value: '${user.streakDays}',
          unit: 'HARI AKTIF',
          icon: Icons.local_fire_department,
          iconColor: AppColors.gold,
          valueColor: AppColors.textPrimary,
        ),
        // Peringkat
        _buildStatCard(
          label: 'PERINGKAT',
          value: '#$rankPos',
          unit: 'KELAS ${user.studentClass ?? "XII"}',
          icon: Icons.military_tech,
          iconColor: AppColors.manaCyan,
          valueColor: AppColors.manaCyan,
        ),
      ],
    );
  }

  Widget _buildStatCard({
    required String label,
    required String value,
    required String unit,
    required IconData icon,
    required Color iconColor,
    required Color valueColor,
  }) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.surfaceCard,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.borderPixel),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.2),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                label,
                style: const TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.8,
                  color: AppColors.textMuted,
                ),
              ),
              Container(
                width: 26,
                height: 26,
                decoration: BoxDecoration(
                  color: iconColor.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(icon, size: 16, color: iconColor),
              ),
            ],
          ),
          Row(
            crossAxisAlignment: CrossAxisAlignment.baseline,
            textBaseline: TextBaseline.alphabetic,
            children: [
              Text(
                value,
                style: TextStyle(
                  fontFamily: 'Outfit',
                  fontSize: 20,
                  fontWeight: FontWeight.w800,
                  color: valueColor,
                ),
              ),
              const SizedBox(width: 4),
              Text(
                unit,
                style: TextStyle(
                  fontSize: 9.5,
                  fontWeight: FontWeight.w700,
                  color: iconColor,
                  letterSpacing: 0.5,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // ─── Active Quests Section ───
  Widget _buildActiveQuestsSection(StudentDashboardProvider dashboard) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Row(
              children: [
                Icon(Icons.assignment, size: 18, color: AppColors.amberGlow),
                SizedBox(width: 8),
                Text(
                  'QUEST AKTIF',
                  style: TextStyle(
                    fontFamily: 'Outfit',
                    fontSize: 15,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 0.6,
                    color: AppColors.textPrimary,
                  ),
                ),
              ],
            ),
            InkWell(
              onTap: () {
                // Trigger tab switch to Quests (Index 1)
              },
              child: const Row(
                children: [
                  Text(
                    'Semua',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: AppColors.manaCyan,
                    ),
                  ),
                  SizedBox(width: 2),
                  Icon(Icons.arrow_forward, size: 13, color: AppColors.manaCyan),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),

        if (dashboard.recentQuests.isEmpty)
          Container(
            padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
            decoration: BoxDecoration(
              color: AppColors.surfaceCard,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: AppColors.borderPixel),
            ),
            child: const Center(
              child: Text(
                'Semua quest hari ini telah diselesaikan! 🎉',
                style: TextStyle(color: AppColors.emerald, fontSize: 13),
              ),
            ),
          )
        else
          Column(
            children: dashboard.recentQuests.map((q) {
              final isEasy = q.difficulty.toLowerCase() == 'easy';
              final diffColor = isEasy ? AppColors.tertiary : AppColors.amberGlow;

              return Container(
                margin: const EdgeInsets.only(bottom: 10),
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppColors.surfaceCard,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppColors.borderPixel),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.2),
                      blurRadius: 6,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Top Row: Difficulty + EXP reward
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2.5),
                          decoration: BoxDecoration(
                            color: AppColors.surfaceDeep,
                            borderRadius: BorderRadius.circular(9999),
                          ),
                          child: Text(
                            q.difficulty.toUpperCase(),
                            style: TextStyle(
                              fontSize: 9.5,
                              fontWeight: FontWeight.w800,
                              letterSpacing: 0.8,
                              color: diffColor,
                            ),
                          ),
                        ),
                        Row(
                          children: [
                            const Icon(Icons.monetization_on, size: 14, color: AppColors.amberGlow),
                            const SizedBox(width: 3),
                            Text(
                              '+${q.expReward} EXP',
                              style: const TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w800,
                                color: AppColors.amberGlow,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),

                    // Title
                    Text(
                      q.title,
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
                      q.description,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppColors.textMuted,
                        height: 1.35,
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Bottom Row: Category Pill + KERJAKAN button
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: AppColors.surfaceDeep,
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(Icons.category_outlined, size: 12, color: AppColors.secondary),
                              const SizedBox(width: 4),
                              Text(
                                q.category.toUpperCase(),
                                style: const TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w700,
                                  color: AppColors.secondary,
                                ),
                              ),
                            ],
                          ),
                        ),
                        ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.secondaryContainer,
                            foregroundColor: AppColors.onSecondaryContainer,
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                            elevation: 2,
                          ),
                          onPressed: () {
                            showModalBottomSheet(
                              context: context,
                              isScrollControlled: true,
                              backgroundColor: Colors.transparent,
                              builder: (_) => QuestSubmitSheet(quest: q),
                            ).then((_) => dashboard.fetchDashboard());
                          },
                          icon: const Icon(Icons.sports_martial_arts, size: 15),
                          label: const Text(
                            'KERJAKAN',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w800,
                              letterSpacing: 0.6,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              );
            }).toList(),
          ),
      ],
    );
  }

  // ─── Realm Visual Showcase Banner ───
  Widget _buildRealmShowcaseBanner() {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surfaceCard,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderPixel),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.3),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            height: 120,
            width: double.infinity,
            child: Stack(
              fit: StackFit.expand,
              children: [
                Image.asset(
                  'assets/images/realm_banner.png',
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) => Container(
                    color: AppColors.surfaceDeep,
                    child: const Icon(Icons.castle, size: 40, color: AppColors.borderPixel),
                  ),
                ),
                Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Colors.transparent,
                        AppColors.surfaceCard.withOpacity(0.85),
                      ],
                    ),
                  ),
                ),
                Positioned(
                  bottom: 10,
                  left: 12,
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppColors.primaryContainer,
                          borderRadius: BorderRadius.circular(9999),
                        ),
                        child: const Text(
                          'EVENT BULANAN',
                          style: TextStyle(
                            fontSize: 9.5,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 0.6,
                            color: AppColors.onPrimaryContainer,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      const Text(
                        'Raid Bos Semester Ganjil',
                        style: TextStyle(
                          fontFamily: 'Outfit',
                          fontSize: 12.5,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Expanded(
                  child: Text(
                    'Kumpulkan XP bersama kawan guild untuk mengklaim gelar Juara Kelas.',
                    style: TextStyle(
                      fontSize: 12,
                      color: AppColors.textMuted,
                    ),
                  ),
                ),
                const Icon(Icons.shield_outlined, color: AppColors.gold, size: 22),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ─── Achievements Section ───
  Widget _buildAchievementsSection(StudentDashboardProvider dashboard) {
    final unlockedCount = dashboard.achievements.where((a) => a.isUnlocked).length;
    final totalCount = dashboard.achievements.length;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Row(
              children: [
                Icon(Icons.emoji_events, size: 18, color: AppColors.gold),
                SizedBox(width: 8),
                Text(
                  'PENCAPAIAN',
                  style: TextStyle(
                    fontFamily: 'Outfit',
                    fontSize: 15,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 0.6,
                    color: AppColors.textPrimary,
                  ),
                ),
              ],
            ),
            Text(
              '$unlockedCount / $totalCount Terbuka',
              style: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: AppColors.textMuted,
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),

        SizedBox(
          height: 125,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: dashboard.achievements.length,
            itemBuilder: (context, index) {
              final ach = dashboard.achievements[index];
              final isUnlocked = ach.isUnlocked;

              return Container(
                width: 105,
                margin: const EdgeInsets.only(right: 10),
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: isUnlocked ? AppColors.surfaceCard : AppColors.surfaceDeep,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(
                    color: isUnlocked ? AppColors.gold.withOpacity(0.4) : AppColors.borderPixel,
                  ),
                  boxShadow: [
                    if (isUnlocked)
                      BoxShadow(
                        color: AppColors.gold.withOpacity(0.15),
                        blurRadius: 8,
                      ),
                  ],
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(10),
                        gradient: isUnlocked
                            ? const LinearGradient(
                                colors: [AppColors.amberGlow, AppColors.primaryContainer],
                              )
                            : null,
                        color: isUnlocked ? null : AppColors.surfaceCard,
                      ),
                      child: Icon(
                        isUnlocked ? Icons.workspace_premium : Icons.lock_outline,
                        color: isUnlocked ? AppColors.surfaceDeep : AppColors.textMuted,
                        size: 22,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      ach.name,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontFamily: 'Outfit',
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: isUnlocked ? AppColors.textPrimary : AppColors.textMuted,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1.5),
                      decoration: BoxDecoration(
                        color: isUnlocked
                            ? AppColors.primaryContainer.withOpacity(0.2)
                            : AppColors.surfaceCard,
                        borderRadius: BorderRadius.circular(9999),
                      ),
                      child: Text(
                        isUnlocked ? 'TERBUKA' : 'TERKUNCI',
                        style: TextStyle(
                          fontSize: 8.5,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 0.6,
                          color: isUnlocked ? AppColors.amberGlow : AppColors.textMuted,
                        ),
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  // ─── Today's Timetable Section ───
  Widget _buildTimetableSection(StudentDashboardProvider dashboard) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Row(
              children: [
                Icon(Icons.calendar_month, size: 18, color: AppColors.manaCyan),
                SizedBox(width: 8),
                Text(
                  'JADWAL HARI INI',
                  style: TextStyle(
                    fontFamily: 'Outfit',
                    fontSize: 15,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 0.6,
                    color: AppColors.textPrimary,
                  ),
                ),
              ],
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2.5),
              decoration: BoxDecoration(
                color: AppColors.surfaceDeep,
                borderRadius: BorderRadius.circular(6),
                border: Border.all(color: AppColors.borderPixel),
              ),
              child: const Text(
                'SENIN',
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 0.8,
                  color: AppColors.amberGlow,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),

        if (dashboard.schedules.isEmpty)
          Container(
            padding: const EdgeInsets.symmetric(vertical: 18, horizontal: 16),
            decoration: BoxDecoration(
              color: AppColors.surfaceCard,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: AppColors.borderPixel),
            ),
            child: const Center(
              child: Text(
                'Tidak ada jadwal pelajaran hari ini.',
                style: TextStyle(color: AppColors.textMuted, fontSize: 13),
              ),
            ),
          )
        else
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppColors.surfaceCard,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.borderPixel),
            ),
            child: Column(
              children: List.generate(dashboard.schedules.length, (index) {
                final s = dashboard.schedules[index];
                final isCurrent = index == 1; // Example active class
                final isLast = index == dashboard.schedules.length - 1;

                return IntrinsicHeight(
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Time indicator
                      SizedBox(
                        width: 50,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              s.timeStart.length >= 5 ? s.timeStart.substring(0, 5) : s.timeStart,
                              style: TextStyle(
                                fontSize: 11.5,
                                fontWeight: isCurrent ? FontWeight.w800 : FontWeight.w600,
                                color: isCurrent ? AppColors.manaCyan : AppColors.textMuted,
                              ),
                            ),
                            Text(
                              s.timeEnd.length >= 5 ? s.timeEnd.substring(0, 5) : s.timeEnd,
                              style: const TextStyle(
                                fontSize: 9.5,
                                color: AppColors.textMuted,
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Timeline node and vertical line
                      Column(
                        children: [
                          Container(
                            width: 10,
                            height: 10,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: isCurrent ? AppColors.manaCyan : AppColors.borderLight,
                              boxShadow: isCurrent
                                  ? [
                                      BoxShadow(
                                        color: AppColors.manaCyan.withOpacity(0.6),
                                        blurRadius: 6,
                                      ),
                                    ]
                                  : null,
                            ),
                          ),
                          if (!isLast)
                            Expanded(
                              child: Container(
                                width: 1.5,
                                color: AppColors.borderPixel,
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(width: 12),

                      // Subject details
                      Expanded(
                        child: Container(
                          margin: const EdgeInsets.only(bottom: 14),
                          padding: isCurrent ? const EdgeInsets.all(10) : EdgeInsets.zero,
                          decoration: isCurrent
                              ? BoxDecoration(
                                  color: AppColors.surfaceDeep,
                                  borderRadius: BorderRadius.circular(10),
                                  border: Border.all(color: AppColors.manaCyan.withOpacity(0.3)),
                                )
                              : null,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Expanded(
                                    child: Text(
                                      s.subjectName,
                                      style: TextStyle(
                                        fontFamily: 'Outfit',
                                        fontSize: 13.5,
                                        fontWeight: FontWeight.w700,
                                        color: isCurrent ? AppColors.manaCyan : AppColors.textPrimary,
                                      ),
                                    ),
                                  ),
                                  if (isCurrent)
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
                                      decoration: BoxDecoration(
                                        color: AppColors.manaCyan.withOpacity(0.2),
                                        borderRadius: BorderRadius.circular(4),
                                      ),
                                      child: const Text(
                                        'SEKARANG',
                                        style: TextStyle(
                                          fontSize: 8.5,
                                          fontWeight: FontWeight.w800,
                                          color: AppColors.manaCyan,
                                        ),
                                      ),
                                    ),
                                ],
                              ),
                              if (s.teacher != null) ...[
                                const SizedBox(height: 2),
                                Text(
                                  s.teacher!,
                                  style: const TextStyle(fontSize: 11, color: AppColors.textMuted),
                                ),
                              ],
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              }),
            ),
          ),
      ],
    );
  }

  // ─── Piket Section ───
  Widget _buildPiketSection(dynamic piket) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Row(
          children: [
            Icon(Icons.cleaning_services, size: 18, color: AppColors.tertiary),
            SizedBox(width: 8),
            Text(
              'PETUGAS PIKET KELAS',
              style: TextStyle(
                fontFamily: 'Outfit',
                fontSize: 15,
                fontWeight: FontWeight.w800,
                letterSpacing: 0.6,
                color: AppColors.textPrimary,
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: AppColors.surfaceCard,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: AppColors.borderPixel),
          ),
          child: Wrap(
            spacing: 12,
            runSpacing: 10,
            children: piket.members.map<Widget>((m) {
              return Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  AvatarWidget(
                    avatar: m.avatar,
                    avatarSeed: m.avatarSeed,
                    size: 26,
                  ),
                  const SizedBox(width: 6),
                  Text(
                    m.name,
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                  ),
                ],
              );
            }).toList(),
          ),
        ),
      ],
    );
  }

  // ─── Sanction Banner ───
  Widget _buildSanctionBanner(StudentDashboardProvider dashboard) {
    final sanction = dashboard.activeSanction!;
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.ruby.withOpacity(0.12),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.ruby, width: 1.2),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.warning_amber_rounded, color: AppColors.ruby, size: 20),
              const SizedBox(width: 8),
              Text(
                'PERINGATAN DISIPLIN: ${sanction['type'].toString().toUpperCase()}',
                style: const TextStyle(
                  fontWeight: FontWeight.w800,
                  color: AppColors.ruby,
                  fontSize: 12.5,
                  letterSpacing: 0.5,
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            sanction['reason'] ?? '',
            style: const TextStyle(fontSize: 12.5, color: AppColors.textPrimary),
          ),
          if (sanction['expires_at'] != null) ...[
            const SizedBox(height: 4),
            Text(
              'Berlaku hingga: ${sanction['expires_at']}',
              style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
            ),
          ],
          const SizedBox(height: 10),
          Align(
            alignment: Alignment.centerRight,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.ruby,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              ),
              onPressed: () => dashboard.acknowledgeSanction(sanction['id']),
              child: const Text('Saya Mengerti', style: TextStyle(fontSize: 12)),
            ),
          ),
        ],
      ),
    );
  }
}
