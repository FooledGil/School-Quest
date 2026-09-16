import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../providers/admin_provider.dart';
import '../../widgets/avatar_widget.dart';
import '../../widgets/glass_card.dart';
import '../../widgets/rank_badge.dart';

class AdminStudentsScreen extends StatefulWidget {
  const AdminStudentsScreen({super.key});

  @override
  State<AdminStudentsScreen> createState() => _AdminStudentsScreenState();
}

class _AdminStudentsScreenState extends State<AdminStudentsScreen> {
  final _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<AdminProvider>(context, listen: false).fetchStudents();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _inspectStudent(dynamic student) async {
    final admin = Provider.of<AdminProvider>(context, listen: false);
    await admin.fetchStudentDetail(student['id']);

    if (!mounted) return;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Consumer<AdminProvider>(
        builder: (context, provider, _) {
          final detail = provider.selectedStudentDetail;
          if (detail == null) {
            return const Center(child: CircularProgressIndicator());
          }

          final s = detail['student'];
          final achievements = detail['achievements'] as List? ?? [];
          final completions = detail['quest_completions'] as List? ?? [];

          return Container(
            padding: const EdgeInsets.all(20),
            height: MediaQuery.of(context).size.height * 0.8,
            decoration: const BoxDecoration(
              color: AppColors.bgCard,
              borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
              border: Border(top: BorderSide(color: AppColors.border)),
            ),
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Center(
                    child: Container(
                      width: 40,
                      height: 4,
                      decoration: BoxDecoration(
                        color: AppColors.border,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      AvatarWidget(
                        avatar: s['avatar'],
                        avatarSeed: s['avatarSeed'],
                        size: 50,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(s['name'] ?? '', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                            Text('NISN: ${s['nisn'] ?? "-"} • Kelas: ${s['class'] ?? "-"}', style: const TextStyle(fontSize: 12, color: AppColors.textMuted)),
                            const SizedBox(height: 4),
                            RankBadge(rank: s['rank_name'] ?? 'Novice', fontSize: 9),
                          ],
                        ),
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text('${s['exp']} EXP', style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.gold)),
                          Text('Level ${s['level']}', style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  const Divider(color: AppColors.border),
                  const SizedBox(height: 10),
                  Text('Lencana Pencapaian (${achievements.length})', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: achievements.map<Widget>((a) {
                      return Chip(
                        backgroundColor: AppColors.bgCardLighter,
                        avatar: const Icon(Icons.verified, size: 16, color: AppColors.gold),
                        label: Text(a['name'] ?? '', style: const TextStyle(fontSize: 11)),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 20),
                  Text('Histori Quest Terakhir (${completions.length})', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                  const SizedBox(height: 8),
                  ...completions.take(5).map((c) {
                    return ListTile(
                      contentPadding: EdgeInsets.zero,
                      leading: Icon(
                        c['status'] == 'approved' ? Icons.check_circle : Icons.pending,
                        color: c['status'] == 'approved' ? AppColors.emerald : AppColors.gold,
                        size: 20,
                      ),
                      title: Text(c['quest_title'] ?? '', style: const TextStyle(fontSize: 13)),
                      subtitle: Text(c['completed_at'] ?? '', style: const TextStyle(fontSize: 10, color: AppColors.textMuted)),
                      trailing: Text('+${c['exp_earned']} EXP', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.gold)),
                    );
                  }),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final admin = Provider.of<AdminProvider>(context);

    return Scaffold(
      backgroundColor: AppColors.bgDark,
      body: RefreshIndicator(
        onRefresh: () => admin.fetchStudents(),
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              TextField(
                controller: _searchController,
                decoration: InputDecoration(
                  hintText: 'Cari siswa berdasarkan nama atau NISN...',
                  prefixIcon: const Icon(Icons.search, color: AppColors.textMuted),
                  suffixIcon: _searchController.text.isNotEmpty
                      ? IconButton(
                          icon: const Icon(Icons.clear, color: AppColors.textMuted),
                          onPressed: () {
                            _searchController.clear();
                            admin.fetchStudents();
                          },
                        )
                      : null,
                ),
                onSubmitted: (val) => admin.fetchStudents(search: val),
              ),
              const SizedBox(height: 14),
              Text('${admin.students.length} Siswa Terdaftar', style: const TextStyle(fontSize: 12, color: AppColors.textMuted)),
              const SizedBox(height: 10),
              if (admin.isLoading && admin.students.isEmpty)
                const Center(child: Padding(padding: EdgeInsets.symmetric(vertical: 40), child: CircularProgressIndicator()))
              else
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: admin.students.length,
                  itemBuilder: (context, index) {
                    final s = admin.students[index];
                    return GlassCard(
                      margin: const EdgeInsets.only(bottom: 8),
                      onTap: () => _inspectStudent(s),
                      child: Row(
                        children: [
                          AvatarWidget(
                            avatar: s['avatar'],
                            avatarSeed: s['avatar_seed'],
                            size: 38,
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(s['name'] ?? '', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                                Text('NISN: ${s['nisn'] ?? "-"} • ${s['class'] ?? "Siswa"}', style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
                              ],
                            ),
                          ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Text('${s['exp']} EXP', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.gold)),
                              RankBadge(rank: s['rank_name'] ?? 'Novice', fontSize: 8),
                            ],
                          ),
                        ],
                      ),
                    );
                  },
                ),
            ],
          ),
        ),
      ),
    );
  }
}
