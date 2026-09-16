import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../models/quest_model.dart';
import '../../providers/admin_provider.dart';
import '../../widgets/glass_card.dart';

class AdminQuestsScreen extends StatefulWidget {
  const AdminQuestsScreen({super.key});

  @override
  State<AdminQuestsScreen> createState() => _AdminQuestsScreenState();
}

class _AdminQuestsScreenState extends State<AdminQuestsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<AdminProvider>(context, listen: false).fetchAdminQuests();
    });
  }

  void _showQuestFormDialog({QuestModel? editQuest}) {
    final titleController = TextEditingController(text: editQuest?.title ?? '');
    final descController = TextEditingController(text: editQuest?.description ?? '');
    final catController = TextEditingController(text: editQuest?.category ?? 'Tugas');
    final expController = TextEditingController(text: editQuest?.expReward.toString() ?? '50');
    String difficulty = editQuest?.difficulty ?? 'easy';

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) {
          return AlertDialog(
            backgroundColor: AppColors.bgCard,
            title: Text(editQuest != null ? 'Edit Quest' : 'Tambah Quest Baru'),
            content: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextField(controller: titleController, decoration: const InputDecoration(labelText: 'Judul Quest')),
                  const SizedBox(height: 10),
                  TextField(controller: descController, maxLines: 2, decoration: const InputDecoration(labelText: 'Deskripsi Instruksi')),
                  const SizedBox(height: 10),
                  TextField(controller: catController, decoration: const InputDecoration(labelText: 'Kategori (cth: Matematika, Piket)')),
                  const SizedBox(height: 10),
                  TextField(controller: expController, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'EXP Reward')),
                  const SizedBox(height: 10),
                  DropdownButtonFormField<String>(
                    value: difficulty,
                    dropdownColor: AppColors.bgCardLighter,
                    decoration: const InputDecoration(labelText: 'Tingkat Kesulitan'),
                    items: const [
                      DropdownMenuItem(value: 'easy', child: Text('Easy (Mudah)')),
                      DropdownMenuItem(value: 'medium', child: Text('Medium (Sedang)')),
                      DropdownMenuItem(value: 'hard', child: Text('Hard (Sulit)')),
                    ],
                    onChanged: (val) {
                      if (val != null) setModalState(() => difficulty = val);
                    },
                  ),
                ],
              ),
            ),
            actions: [
              TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Batal')),
              ElevatedButton(
                onPressed: () async {
                  if (titleController.text.trim().isEmpty) return;
                  final admin = Provider.of<AdminProvider>(context, listen: false);
                  final data = {
                    'title': titleController.text.trim(),
                    'description': descController.text.trim(),
                    'category': catController.text.trim(),
                    'exp_reward': int.tryParse(expController.text.trim()) ?? 50,
                    'difficulty': difficulty,
                    'is_active': true,
                  };

                  final success = await admin.createQuest(data);
                  if (mounted && success) {
                    Navigator.pop(ctx);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Quest berhasil disimpan! ✨'), backgroundColor: AppColors.emerald),
                    );
                  }
                },
                child: const Text('Simpan'),
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
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppColors.primary,
        onPressed: () => _showQuestFormDialog(),
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text('BUAT QUEST BARU', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
      ),
      body: admin.isLoading && admin.adminQuests.isEmpty
          ? const Center(child: CircularProgressIndicator(color: AppColors.primaryLight))
          : RefreshIndicator(
              onRefresh: () => admin.fetchAdminQuests(),
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                itemCount: admin.adminQuests.length,
                itemBuilder: (context, index) {
                  final quest = admin.adminQuests[index];
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
                                color: AppColors.primary.withOpacity(0.15),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                quest.category.toUpperCase(),
                                style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.primaryLight),
                              ),
                            ),
                            Row(
                              children: [
                                Text('+${quest.expReward} EXP', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.gold)),
                                const SizedBox(width: 8),
                                IconButton(
                                  icon: const Icon(Icons.delete_outline, color: AppColors.ruby, size: 20),
                                  onPressed: () async {
                                    final confirm = await showDialog<bool>(
                                      context: context,
                                      builder: (c) => AlertDialog(
                                        backgroundColor: AppColors.bgCard,
                                        title: const Text('Hapus Quest?'),
                                        content: Text('Apakah Anda yakin ingin menghapus quest "${quest.title}"?'),
                                        actions: [
                                          TextButton(onPressed: () => Navigator.pop(c, false), child: const Text('Batal')),
                                          ElevatedButton(
                                            style: ElevatedButton.styleFrom(backgroundColor: AppColors.ruby),
                                            onPressed: () => Navigator.pop(c, true),
                                            child: const Text('Hapus'),
                                          ),
                                        ],
                                      ),
                                    );
                                    if (confirm == true) {
                                      await admin.deleteQuest(quest.id);
                                    }
                                  },
                                ),
                              ],
                            ),
                          ],
                        ),
                        const SizedBox(height: 6),
                        Text(quest.title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 4),
                        Text(quest.description, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                      ],
                    ),
                  );
                },
              ),
            ),
    );
  }
}
