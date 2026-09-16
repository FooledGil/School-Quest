import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../providers/admin_provider.dart';
import '../../widgets/glass_card.dart';

class AdminCommunityScreen extends StatefulWidget {
  const AdminCommunityScreen({super.key});

  @override
  State<AdminCommunityScreen> createState() => _AdminCommunityScreenState();
}

class _AdminCommunityScreenState extends State<AdminCommunityScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<AdminProvider>(context, listen: false).fetchModeration();
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _showPunishDialog(int userId, String userName) {
    String type = 'warning';
    final reasonController = TextEditingController();
    int amount = 24; // hours for mute

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) {
          return AlertDialog(
            backgroundColor: AppColors.bgCard,
            title: Text('Sanksi Disiplin: $userName'),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                DropdownButtonFormField<String>(
                  value: type,
                  dropdownColor: AppColors.bgCardLighter,
                  decoration: const InputDecoration(labelText: 'Jenis Tindakan Disiplin'),
                  items: const [
                    DropdownMenuItem(value: 'warning', child: Text('Peringatan Resmi (Warning)')),
                    DropdownMenuItem(value: 'mute', child: Text('Mute Komentar (Bisu)')),
                    DropdownMenuItem(value: 'temp_ban', child: Text('Suspend Akun Sementara')),
                    DropdownMenuItem(value: 'ban', child: Text('Nonaktifkan Akun (Ban)')),
                  ],
                  onChanged: (val) {
                    if (val != null) setModalState(() => type = val);
                  },
                ),
                if (type == 'mute') ...[
                  const SizedBox(height: 10),
                  DropdownButtonFormField<int>(
                    value: amount,
                    dropdownColor: AppColors.bgCardLighter,
                    decoration: const InputDecoration(labelText: 'Durasi Mute'),
                    items: const [
                      DropdownMenuItem(value: 1, child: Text('1 Jam')),
                      DropdownMenuItem(value: 6, child: Text('6 Jam')),
                      DropdownMenuItem(value: 24, child: Text('24 Jam (1 Hari)')),
                      DropdownMenuItem(value: 72, child: Text('3 Hari')),
                      DropdownMenuItem(value: 168, child: Text('7 Hari (1 Minggu)')),
                    ],
                    onChanged: (val) {
                      if (val != null) setModalState(() => amount = val);
                    },
                  ),
                ],
                const SizedBox(height: 10),
                TextField(
                  controller: reasonController,
                  maxLines: 2,
                  decoration: const InputDecoration(labelText: 'Alasan Pelanggaran Disiplin'),
                ),
              ],
            ),
            actions: [
              TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Batal')),
              ElevatedButton(
                style: ElevatedButton.styleFrom(backgroundColor: AppColors.ruby),
                onPressed: () async {
                  if (reasonController.text.trim().isEmpty) return;
                  final admin = Provider.of<AdminProvider>(context, listen: false);
                  final success = await admin.punishStudent(
                    userId,
                    type,
                    reasonController.text.trim(),
                    amount: type == 'mute' ? amount : null,
                  );
                  if (mounted && success) {
                    Navigator.pop(ctx);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Sanksi disiplin diterapkan pada $userName!'), backgroundColor: AppColors.ruby),
                    );
                    admin.fetchModeration();
                  }
                },
                child: const Text('Terapkan Sanksi'),
              ),
            ],
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
      appBar: AppBar(
        title: const Text('MODERASI THE REALM'),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: AppColors.primaryLight,
          tabs: [
            Tab(text: 'Laporan (${admin.reports.length})'),
            Tab(text: 'Thread (${admin.threads.length})'),
            Tab(text: 'Sanksi (${admin.sanctions.length})'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildReportsTab(admin),
          _buildThreadsTab(admin),
          _buildSanctionsTab(admin),
        ],
      ),
    );
  }

  Widget _buildReportsTab(AdminProvider admin) {
    if (admin.reports.isEmpty) {
      return const Center(child: Text('Tidak ada laporan aktif. Kondisi forum aman! 🛡️', style: TextStyle(color: AppColors.textMuted)));
    }

    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      itemCount: admin.reports.length,
      itemBuilder: (context, index) {
        final r = admin.reports[index];
        final author = r['target_author'];

        return GlassCard(
          margin: const EdgeInsets.only(bottom: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: AppColors.ruby.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text('Alasan: ${r['reason'].toString().toUpperCase()}', style: const TextStyle(color: AppColors.ruby, fontSize: 10, fontWeight: FontWeight.bold)),
                  ),
                  Text(r['created_at_human'] ?? '', style: const TextStyle(fontSize: 10, color: AppColors.textMuted)),
                ],
              ),
              const SizedBox(height: 8),
              Text('Konten yang dilaporkan:\n"${r['content_snippet']}"', style: const TextStyle(fontSize: 13, color: AppColors.textPrimary)),
              const SizedBox(height: 6),
              Text('Pelapor: ${r['reporter']?['name'] ?? "Siswa"}', style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
              if (author != null)
                Text('Terlapor: ${author['name']}', style: const TextStyle(fontSize: 11, color: AppColors.gold, fontWeight: FontWeight.bold)),

              const SizedBox(height: 12),
              Row(
                children: [
                  if (author != null)
                    Expanded(
                      child: OutlinedButton(
                        style: OutlinedButton.styleFrom(foregroundColor: AppColors.ruby, side: const BorderSide(color: AppColors.ruby)),
                        onPressed: () => _showPunishDialog(author['id'], author['name']),
                        child: const Text('Beri Sanksi', style: TextStyle(fontSize: 11)),
                      ),
                    ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(backgroundColor: AppColors.emerald),
                      onPressed: () async {
                        await admin.resolveReport(r['id'], 'resolved', note: 'Diselesaikan oleh Guru/Admin');
                      },
                      child: const Text('Selesai', style: TextStyle(fontSize: 11)),
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildThreadsTab(AdminProvider admin) {
    if (admin.threads.isEmpty) {
      return const Center(child: Text('Belum ada thread.', style: TextStyle(color: AppColors.textMuted)));
    }

    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      itemCount: admin.threads.length,
      itemBuilder: (context, index) {
        final t = admin.threads[index];
        return GlassCard(
          margin: const EdgeInsets.only(bottom: 10),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(t['title'] ?? '', style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
              const SizedBox(height: 4),
              Text('Penulis: ${t['author']?['name']} • Kategori: #${t['category']}', style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
              const SizedBox(height: 8),
              Row(
                children: [
                  Text(t['is_pinned'] == true ? '📌 Pinned' : '', style: const TextStyle(color: AppColors.gold, fontSize: 11)),
                  const SizedBox(width: 8),
                  Text(t['is_locked'] == true ? '🔒 Locked' : '', style: const TextStyle(color: AppColors.ruby, fontSize: 11)),
                  const Spacer(),
                  IconButton(
                    icon: Icon(t['is_pinned'] == true ? Icons.push_pin : Icons.push_pin_outlined, size: 18),
                    onPressed: () async {
                      await ApiClient().post('/admin/community/thread/${t['id']}/pin');
                      admin.fetchModeration();
                    },
                  ),
                  IconButton(
                    icon: Icon(t['is_locked'] == true ? Icons.lock : Icons.lock_open, size: 18),
                    onPressed: () async {
                      await ApiClient().post('/admin/community/thread/${t['id']}/lock');
                      admin.fetchModeration();
                    },
                  ),
                  IconButton(
                    icon: const Icon(Icons.delete_outline, size: 18, color: AppColors.ruby),
                    onPressed: () async {
                      await ApiClient().delete('/admin/community/thread/${t['id']}');
                      admin.fetchModeration();
                    },
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildSanctionsTab(AdminProvider admin) {
    if (admin.sanctions.isEmpty) {
      return const Center(child: Text('Belum ada sanksi yang tercatat.', style: TextStyle(color: AppColors.textMuted)));
    }

    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      itemCount: admin.sanctions.length,
      itemBuilder: (context, index) {
        final s = admin.sanctions[index];
        return GlassCard(
          margin: const EdgeInsets.only(bottom: 8),
          child: Row(
            children: [
              const Icon(Icons.gavel, color: AppColors.ruby, size: 20),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('${s['student_name']} (${s['type'].toString().toUpperCase()})', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                    Text('Alasan: ${s['reason']}', style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                    Text('Oleh: ${s['admin_name']} • ${s['created_at_human']}', style: const TextStyle(fontSize: 10, color: AppColors.textMuted)),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
