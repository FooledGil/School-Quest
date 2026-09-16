import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../providers/student_dashboard_provider.dart';
import '../../widgets/avatar_widget.dart';
import '../../widgets/exp_progress_bar.dart';
import '../../widgets/glass_card.dart';
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
      backgroundColor: AppColors.bgDark,
      appBar: AppBar(
        title: const Row(
          children: [
            Icon(Icons.shield, color: AppColors.primaryLight, size: 22),
            SizedBox(width: 8),
            Text(
              'SCHOOLQUEST',
              style: TextStyle(fontWeight: FontWeight.w900, letterSpacing: 1),
            ),
          ],
        ),
      ),
      body: dashboard.isLoading && user == null
          ? const Center(
              child: CircularProgressIndicator(color: AppColors.primaryLight),
            )
          : RefreshIndicator(
              color: AppColors.primaryLight,
              onRefresh: () => dashboard.fetchDashboard(),
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Sanction Alert Banner (if any)
                    if (dashboard.activeSanction != null)
                      _buildSanctionBanner(dashboard),

                    // User RPG Profile Card
                    if (user != null) _buildProfileHeroCard(user, stats),

                    const SizedBox(height: 20),

                    // Today's Timetable Section
                    _buildSectionHeader('Jadwal Hari Ini', Icons.calendar_today, AppColors.sapphire),
                    const SizedBox(height: 10),
                    _buildSchedulesList(dashboard),

                    const SizedBox(height: 20),

                    // Today's Piket Section
                    if (dashboard.piket != null && dashboard.piket!.members.isNotEmpty) ...[
                      _buildSectionHeader('Petugas Piket Kelas', Icons.cleaning_services, AppColors.emerald),
                      const SizedBox(height: 10),
                      _buildPiketCard(dashboard.piket!),
                      const SizedBox(height: 20),
                    ],

                    // Active Quests Preview
                    _buildSectionHeader('Misi Tersedia Hari Ini', Icons.sports_martial_arts, AppColors.gold),
                    const SizedBox(height: 10),
                    _buildQuestsPreview(dashboard),

                    const SizedBox(height: 20),

                    // Achievements Preview
                    _buildSectionHeader('Koleksi Pencapaian', Icons.military_tech, AppColors.accent),
                    const SizedBox(height: 10),
                    _buildAchievementsGrid(dashboard),

                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildSanctionBanner(StudentDashboardProvider dashboard) {
    final sanction = dashboard.activeSanction!;
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.ruby.withOpacity(0.15),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.ruby, width: 1.2),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.warning_amber_rounded, color: AppColors.ruby, size: 22),
              const SizedBox(width: 8),
              Text(
                'PERINGATAN DISIPLIN: ${sanction['type'].toString().toUpperCase()}',
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  color: AppColors.ruby,
                  fontSize: 13,
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            sanction['reason'] ?? '',
            style: const TextStyle(fontSize: 13, color: AppColors.textPrimary),
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

  Widget _buildProfileHeroCard(dynamic user, Map<String, dynamic>? stats) {
    return GlassCard(
      padding: const EdgeInsets.all(18),
      borderColor: AppColors.primary.withOpacity(0.4),
      child: Column(
        children: [
          Row(
            children: [
              AvatarWidget(
                avatar: user.avatar,
                avatarSeed: user.avatarSeed,
                size: 58,
                borderWidth: 2.5,
                borderColor: AppColors.primaryLight,
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      user.name,
                      style: const TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.bold,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '${user.studentClass ?? "Siswa"} • Level ${user.level}',
                      style: const TextStyle(fontSize: 13, color: AppColors.textSecondary),
                    ),
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        RankBadge(rank: user.rankName),
                        const SizedBox(width: 8),
                        // Streak Flame
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: AppColors.flameOrange.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: AppColors.flameOrange.withOpacity(0.5)),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.local_fire_department, size: 13, color: AppColors.flameOrange),
                              const SizedBox(width: 2),
                              Text(
                                '${user.streakDays}d',
                                style: const TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.bold,
                                  color: AppColors.flameOrange,
                                ),
                              ),
                            ],
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
          // Quadratic EXP Progress Bar
          ExpProgressBar(
            currentExp: user.exp,
            expInLevel: stats?['exp_in_level'],
            expNeededInLevel: stats?['exp_needed_in_level'],
            expPercentage: (stats?['exp_percentage'] as num?)?.toDouble(),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title, IconData icon, Color color) {
    return Row(
      children: [
        Icon(icon, size: 18, color: color),
        const SizedBox(width: 8),
        Text(
          title,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: AppColors.textPrimary,
            letterSpacing: 0.3,
          ),
        ),
      ],
    );
  }

  Widget _buildSchedulesList(StudentDashboardProvider dashboard) {
    if (dashboard.schedules.isEmpty) {
      return const GlassCard(
        child: Center(
          child: Padding(
            padding: EdgeInsets.symmetric(vertical: 12),
            child: Text(
              'Tidak ada jadwal pelajaran hari ini.',
              style: TextStyle(color: AppColors.textMuted, fontSize: 13),
            ),
          ),
        ),
      );
    }

    return Column(
      children: dashboard.schedules.map((s) {
        return GlassCard(
          margin: const EdgeInsets.only(bottom: 8),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: AppColors.sapphire.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: AppColors.sapphire.withOpacity(0.4)),
                ),
                child: Text(
                  '${s.timeStart.substring(0, 5)} - ${s.timeEnd.substring(0, 5)}',
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: AppColors.sapphire,
                  ),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      s.subjectName,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    if (s.teacher != null) ...[
                      const SizedBox(height: 2),
                      Text(
                        s.teacher!,
                        style: const TextStyle(fontSize: 12, color: AppColors.textMuted),
                      ),
                    ],
                  ],
                ),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildPiketCard(dynamic piket) {
    return GlassCard(
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
                size: 28,
              ),
              const SizedBox(width: 6),
              Text(
                m.name,
                style: const TextStyle(fontSize: 13, color: AppColors.textPrimary),
              ),
            ],
          );
        }).toList(),
      ),
    );
  }

  Widget _buildQuestsPreview(StudentDashboardProvider dashboard) {
    if (dashboard.recentQuests.isEmpty) {
      return const GlassCard(
        child: Center(
          child: Padding(
            padding: EdgeInsets.symmetric(vertical: 12),
            child: Text(
              'Semua quest hari ini telah diselesaikan! 🎉',
              style: TextStyle(color: AppColors.emerald, fontSize: 13),
            ),
          ),
        ),
      );
    }

    return Column(
      children: dashboard.recentQuests.map((q) {
        return GlassCard(
          margin: const EdgeInsets.only(bottom: 10),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(color: AppColors.primary.withOpacity(0.4)),
                    ),
                    child: Text(
                      q.category.toUpperCase(),
                      style: const TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: AppColors.primaryLight,
                      ),
                    ),
                  ),
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
                          '+${q.expReward} EXP',
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
              const SizedBox(height: 8),
              Text(
                q.title,
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                q.description,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
              ),
              const SizedBox(height: 12),
              Align(
                alignment: Alignment.centerRight,
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  ),
                  onPressed: () {
                    showModalBottomSheet(
                      context: context,
                      isScrollControlled: true,
                      backgroundColor: Colors.transparent,
                      builder: (_) => QuestSubmitSheet(quest: q),
                    ).then((_) => dashboard.fetchDashboard());
                  },
                  icon: const Icon(Icons.upload_file, size: 16),
                  label: const Text('Kirim Bukti', style: TextStyle(fontSize: 12)),
                ),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildAchievementsGrid(StudentDashboardProvider dashboard) {
    if (dashboard.achievements.isEmpty) {
      return const SizedBox.shrink();
    }

    return GlassCard(
      child: GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        itemCount: dashboard.achievements.length,
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 4,
          crossAxisSpacing: 10,
          mainAxisSpacing: 10,
          childAspectRatio: 0.85,
        ),
        itemBuilder: (context, index) {
          final ach = dashboard.achievements[index];
          final isUnlocked = ach.isUnlocked;

          return Tooltip(
            message: '${ach.name}\n${ach.description}',
            child: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: isUnlocked
                    ? AppColors.primary.withOpacity(0.2)
                    : AppColors.bgDark.withOpacity(0.5),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: isUnlocked ? AppColors.primaryLight : AppColors.border,
                  width: isUnlocked ? 1.5 : 0.8,
                ),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    isUnlocked ? Icons.military_tech : Icons.lock_outline,
                    color: isUnlocked ? AppColors.gold : AppColors.textMuted,
                    size: 28,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    ach.name,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w600,
                      color: isUnlocked ? AppColors.textPrimary : AppColors.textMuted,
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
