import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../models/sanction_model.dart';
import '../../providers/admin_provider.dart';
import '../../widgets/avatar_widget.dart';
import '../../widgets/glass_card.dart';

class ValidationsScreen extends StatefulWidget {
  const ValidationsScreen({super.key});

  @override
  State<ValidationsScreen> createState() => _ValidationsScreenState();
}

class _ValidationsScreenState extends State<ValidationsScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<AdminProvider>(context, listen: false).fetchValidations();
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _showRejectDialog(ValidationSubmissionModel submission) {
    final reasonController = TextEditingController();

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.bgCard,
        title: Text('Tolak Misi: ${submission.questTitle}'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Siswa: ${submission.studentName}', style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
            const SizedBox(height: 12),
            TextField(
              controller: reasonController,
              maxLines: 3,
              decoration: const InputDecoration(
                labelText: 'Alasan Penolakan',
                hintText: 'Misal: Foto buram / Bukti tidak sesuai instruksi tugas...',
              ),
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
              final success = await admin.rejectValidation(submission.id, reasonController.text.trim());
              if (mounted && success) {
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Pengajuan quest berhasil ditolak.'), backgroundColor: AppColors.ruby),
                );
              }
            },
            child: const Text('Tolak Submission'),
          ),
        ],
      ),
    );
  }

  void _previewProofImage(String imageUrl) {
    showDialog(
      context: context,
      builder: (ctx) => Dialog(
        backgroundColor: Colors.transparent,
        child: Stack(
          alignment: Alignment.topRight,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(16),
              child: CachedNetworkImage(
                imageUrl: imageUrl,
                fit: BoxFit.contain,
                placeholder: (_, __) => const Center(child: CircularProgressIndicator()),
                errorWidget: (_, __, ___) => const Center(child: Icon(Icons.broken_image, size: 48, color: Colors.white)),
              ),
            ),
            IconButton(
              icon: const CircleAvatar(backgroundColor: Colors.black54, child: Icon(Icons.close, color: Colors.white)),
              onPressed: () => Navigator.pop(ctx),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final admin = Provider.of<AdminProvider>(context);

    return Scaffold(
      backgroundColor: AppColors.bgDark,
      appBar: AppBar(
        title: const Text('VALIDASI QUEST SISWA'),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: AppColors.primaryLight,
          tabs: [
            Tab(text: 'Menunggu (${admin.pendingSubmissions.length})'),
            Tab(text: 'Riwayat (${admin.validationHistory.length})'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildPendingTab(admin),
          _buildHistoryTab(admin),
        ],
      ),
    );
  }

  Widget _buildPendingTab(AdminProvider admin) {
    if (admin.isLoading && admin.pendingSubmissions.isEmpty) {
      return const Center(child: CircularProgressIndicator(color: AppColors.primaryLight));
    }

    if (admin.pendingSubmissions.isEmpty) {
      return const Center(
        child: Text('Tidak ada antrian validasi quest saat ini. ✨', style: TextStyle(color: AppColors.textMuted)),
      );
    }

    return RefreshIndicator(
      onRefresh: () => admin.fetchValidations(),
      child: ListView.builder(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        itemCount: admin.pendingSubmissions.length,
        itemBuilder: (context, index) {
          final sub = admin.pendingSubmissions[index];
          final proofUrl = sub.resolvedProofImageUrl;

          return GlassCard(
            margin: const EdgeInsets.only(bottom: 14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Student info
                Row(
                  children: [
                    AvatarWidget(
                      avatar: sub.studentAvatar,
                      avatarSeed: sub.studentAvatarSeed,
                      size: 38,
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(sub.studentName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                          Text('NISN: ${sub.studentNisn ?? "-"} • ${sub.submittedAtHuman}', style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppColors.gold.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text('+${sub.expReward} EXP', style: const TextStyle(fontSize: 11, color: AppColors.gold, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),

                const SizedBox(height: 12),
                const Divider(color: AppColors.border),
                const SizedBox(height: 8),

                // Quest Title
                Text(sub.questTitle, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
                const SizedBox(height: 4),
                Text('Kategori: ${sub.questCategory} • Tingkat: ${sub.questDifficulty}', style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),

                // Proof Text Note
                if (sub.proofText != null && sub.proofText!.isNotEmpty) ...[
                  const SizedBox(height: 10),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: AppColors.bgDark.withOpacity(0.6),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: AppColors.border),
                    ),
                    child: Text(
                      'Catatan Siswa:\n${sub.proofText!}',
                      style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                    ),
                  ),
                ],

                // Proof Image Thumbnail
                if (proofUrl != null) ...[
                  const SizedBox(height: 12),
                  GestureDetector(
                    onTap: () => _previewProofImage(proofUrl),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(10),
                      child: Stack(
                        alignment: Alignment.bottomRight,
                        children: [
                          CachedNetworkImage(
                            imageUrl: proofUrl,
                            height: 160,
                            width: double.infinity,
                            fit: BoxFit.cover,
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            margin: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: Colors.black87,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: const Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(Icons.zoom_in, color: Colors.white, size: 14),
                                SizedBox(width: 4),
                                Text('Perbesar', style: TextStyle(color: Colors.white, fontSize: 11)),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],

                const SizedBox(height: 16),

                // Action Buttons (Reject / Approve)
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        style: OutlinedButton.styleFrom(
                          foregroundColor: AppColors.ruby,
                          side: const BorderSide(color: AppColors.ruby),
                        ),
                        onPressed: () => _showRejectDialog(sub),
                        icon: const Icon(Icons.close, size: 16),
                        label: const Text('Tolak'),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.emerald,
                        ),
                        onPressed: () async {
                          final success = await admin.approveValidation(sub.id);
                          if (mounted && success) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text(admin.successMessage ?? 'Quest disetujui! EXP telah dikreditkan.'),
                                backgroundColor: AppColors.emerald,
                              ),
                            );
                          }
                        },
                        icon: const Icon(Icons.check, size: 16),
                        label: const Text('Setujui (Approve)'),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildHistoryTab(AdminProvider admin) {
    if (admin.validationHistory.isEmpty) {
      return const Center(child: Text('Belum ada riwayat validasi.', style: TextStyle(color: AppColors.textMuted)));
    }

    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      itemCount: admin.validationHistory.length,
      itemBuilder: (context, index) {
        final item = admin.validationHistory[index];
        final isApproved = item['status'] == 'approved';

        return GlassCard(
          margin: const EdgeInsets.only(bottom: 8),
          child: Row(
            children: [
              Icon(
                isApproved ? Icons.check_circle : Icons.cancel,
                color: isApproved ? AppColors.emerald : AppColors.ruby,
                size: 20,
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(item['student_name'] ?? 'Siswa', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                    Text(item['quest_title'] ?? 'Quest', style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                    if (!isApproved && item['rejection_reason'] != null)
                      Text('Alasan: ${item['rejection_reason']}', style: const TextStyle(fontSize: 10, color: AppColors.ruby)),
                  ],
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    isApproved ? '+${item['exp_reward']} EXP' : 'DITOLAK',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: isApproved ? AppColors.gold : AppColors.ruby,
                    ),
                  ),
                  Text(item['validated_at_human'] ?? '', style: const TextStyle(fontSize: 9, color: AppColors.textMuted)),
                ],
              ),
            ],
          ),
        );
      },
    );
  }
}
