import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../providers/admin_provider.dart';
import '../../widgets/avatar_widget.dart';
import '../../widgets/glass_card.dart';
import '../../widgets/rank_badge.dart';

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({super.key});

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<AdminProvider>(context, listen: false).fetchDashboard();
    });
  }

  @override
  Widget build(BuildContext context) {
    final admin = Provider.of<AdminProvider>(context);
    final stats = admin.stats;

    return Scaffold(
      backgroundColor: AppColors.bgDark,
      body: admin.isLoading && stats == null
          ? const Center(child: CircularProgressIndicator(color: AppColors.primaryLight))
          : RefreshIndicator(
              color: AppColors.primaryLight,
              onRefresh: () => admin.fetchDashboard(),
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'RINGKASAN SISTEM GUILD MASTER',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 0.8,
                        color: AppColors.primaryLight,
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Metrics Grid (2 columns)
                    if (stats != null) ...[
                      GridView.count(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        crossAxisCount: 2,
                        crossAxisSpacing: 10,
                        mainAxisSpacing: 10,
                        childAspectRatio: 1.6,
                        children: [
                          _statCard('Total Siswa', '${stats['total_students']}', Icons.people, AppColors.sapphire),
                          _statCard('Quest Aktif', '${stats['total_quests']}', Icons.sports_martial_arts, AppColors.emerald),
                          _statCard('Penyelesaian Hari Ini', '${stats['completions_today']}', Icons.check_circle, AppColors.gold),
                          _statCard('Antrian Validasi', '${stats['pending_validations']}', Icons.pending_actions, AppColors.ruby),
                        ],
                      ),
                    ],

                    const SizedBox(height: 24),

                    // Top 5 Students
                    const Row(
                      children: [
                        Icon(Icons.emoji_events, size: 18, color: AppColors.gold),
                        SizedBox(width: 8),
                        Text('Top 5 Siswa Berprestasi', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                      ],
                    ),
                    const SizedBox(height: 12),
                    ListView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: admin.topPerformers.length,
                      itemBuilder: (context, index) {
                        final student = admin.topPerformers[index];
                        return GlassCard(
                          margin: const EdgeInsets.only(bottom: 8),
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                          child: Row(
                            children: [
                              Text('#${index + 1}', style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.gold)),
                              const SizedBox(width: 12),
                              AvatarWidget(
                                avatar: student['avatar'],
                                avatarSeed: student['avatar_seed'],
                                size: 36,
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(student['name'] ?? '', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                                    Text('${student['class'] ?? "Siswa"} • Level ${student['level']}', style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
                                  ],
                                ),
                              ),
                              RankBadge(rank: student['rank_name'] ?? 'Novice', fontSize: 9),
                            ],
                          ),
                        );
                      },
                    ),

                    const SizedBox(height: 24),

                    // Recent Completions
                    const Row(
                      children: [
                        Icon(Icons.history, size: 18, color: AppColors.primaryLight),
                        SizedBox(width: 8),
                        Text('Aktivitas Validasi Terakhir', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                      ],
                    ),
                    const SizedBox(height: 12),
                    ListView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: admin.recentCompletions.length,
                      itemBuilder: (context, index) {
                        final comp = admin.recentCompletions[index];
                        return GlassCard(
                          margin: const EdgeInsets.only(bottom: 8),
                          child: Row(
                            children: [
                              const Icon(Icons.verified, color: AppColors.emerald, size: 18),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(comp['student_name'] ?? 'Siswa', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                                    Text(comp['quest_title'] ?? 'Quest', style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                                  ],
                                ),
                              ),
                              Text('+${comp['exp_earned']} EXP', style: const TextStyle(color: AppColors.gold, fontWeight: FontWeight.bold, fontSize: 12)),
                            ],
                          ),
                        );
                      },
                    ),

                    const SizedBox(height: 30),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _statCard(String title, String value, IconData icon, Color color) {
    return GlassCard(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(title, style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
              Icon(icon, size: 18, color: color),
            ],
          ),
          const SizedBox(height: 6),
          Text(value, style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: color)),
        ],
      ),
    );
  }
}
