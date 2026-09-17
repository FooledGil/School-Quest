import 'dart:io';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import '../../core/constants/api_constants.dart';
import '../../core/constants/app_colors.dart';
import '../../core/network/api_client.dart';
import '../../models/achievement_model.dart';
import '../../models/user_model.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/avatar_widget.dart';
import '../../widgets/exp_progress_bar.dart';
import '../../widgets/glass_card.dart';
import '../../widgets/rank_badge.dart';
import '../auth/login_screen.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final ApiClient _apiClient = ApiClient();
  bool _isLoading = false;
  UserModel? _profileUser;
  List<AchievementModel> _achievements = [];
  List<dynamic> _recentCompletions = [];

  final List<String> _popularSeeds = [
    'Shadow', 'Valkyrie', 'Titan', 'Cyber', 'Nova', 'Specter', 'Luna', 'Apex', 'Blaze', 'Phoenix'
  ];

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    setState(() => _isLoading = true);
    try {
      final response = await _apiClient.get(ApiConstants.studentProfile);
      if (response['status'] == 'success') {
        final data = response['data'];
        _profileUser = UserModel.fromJson(data['user']);
        _achievements = (data['achievements'] as List? ?? [])
            .map((a) => AchievementModel.fromJson(a))
            .toList();
        _recentCompletions = data['recent_completions'] ?? [];
      }
    } catch (_) {}
    if (mounted) setState(() => _isLoading = false);
  }

  Future<void> _selectPixelSeed(String seed) async {
    try {
      final response = await _apiClient.post(ApiConstants.studentAvatarUpdate, body: {
        'avatar_seed': seed,
      });
      if (response['status'] == 'success') {
        await _loadProfile();
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Avatar PixelBot berhasil diperbarui! 🎨'), backgroundColor: AppColors.emerald),
          );
        }
      }
    } catch (_) {}
  }

  Future<void> _uploadCustomPhoto() async {
    final picker = ImagePicker();
    final picked = await picker.pickImage(source: ImageSource.gallery, imageQuality: 85);
    if (picked == null) return;

    try {
      final response = await _apiClient.multipart(
        ApiConstants.studentAvatarUpload,
        fileField: 'avatar_file',
        file: File(picked.path),
      );
      if (response['status'] == 'success') {
        await _loadProfile();
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Foto profil berhasil diunggah! 📸'), backgroundColor: AppColors.emerald),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Gagal mengunggah foto: $e'), backgroundColor: AppColors.ruby),
        );
      }
    }
  }

  Future<void> _resetAvatar() async {
    try {
      final response = await _apiClient.post(ApiConstants.studentAvatarReset);
      if (response['status'] == 'success') {
        await _loadProfile();
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Avatar dikembalikan ke siluet default! 👤'), backgroundColor: AppColors.emerald),
          );
        }
      }
    } catch (_) {}
  }

  void _showPasswordDialog() {
    final oldPass = TextEditingController();
    final newPass = TextEditingController();
    final confPass = TextEditingController();

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.bgCard,
        title: const Text('Ganti Kata Sandi'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: oldPass, obscureText: true, decoration: const InputDecoration(labelText: 'Password Lama')),
            const SizedBox(height: 10),
            TextField(controller: newPass, obscureText: true, decoration: const InputDecoration(labelText: 'Password Baru (min 6 karakter)')),
            const SizedBox(height: 10),
            TextField(controller: confPass, obscureText: true, decoration: const InputDecoration(labelText: 'Konfirmasi Password Baru')),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Batal')),
          ElevatedButton(
            onPressed: () async {
              if (newPass.text != confPass.text) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Konfirmasi password tidak cocok!'), backgroundColor: AppColors.ruby),
                );
                return;
              }
              try {
                final res = await _apiClient.post(ApiConstants.studentPasswordUpdate, body: {
                  'current_password': oldPass.text,
                  'password': newPass.text,
                  'password_confirmation': confPass.text,
                });
                if (mounted && res['status'] == 'success') {
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Password berhasil diperbarui! 🔒'), backgroundColor: AppColors.emerald),
                  );
                }
              } catch (e) {
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text(e.toString()), backgroundColor: AppColors.ruby),
                  );
                }
              }
            },
            child: const Text('Simpan Password'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final user = _profileUser ?? auth.user;

    if (user == null) {
      return const Center(child: CircularProgressIndicator(color: AppColors.primaryLight));
    }

    return Scaffold(
      backgroundColor: AppColors.bgDark,
      appBar: AppBar(
        title: const Text('PROFIL PETUALANG', style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1)),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, color: AppColors.ruby),
            tooltip: 'Keluar Akun',
            onPressed: () async {
              await auth.logout();
              if (mounted) {
                Navigator.of(context).pushReplacement(
                  MaterialPageRoute(builder: (_) => const LoginScreen()),
                );
              }
            },
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: AppColors.primaryLight))
          : RefreshIndicator(
              color: AppColors.primaryLight,
              onRefresh: _loadProfile,
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                child: Column(
                  children: [
                    // Big Character Profile Card
                    GlassCard(
                      padding: const EdgeInsets.all(20),
                      borderColor: AppColors.primaryLight.withOpacity(0.5),
                      child: Column(
                        children: [
                          AvatarWidget(
                            avatar: user.avatar,
                            avatarSeed: user.avatarSeed,
                            size: 90,
                            borderWidth: 2.5,
                            borderColor: AppColors.manaCyan,
                            level: user.level,
                          ),
                          const SizedBox(height: 12),
                          Text(
                            user.name,
                            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'NISN: ${user.nisn ?? "-"} • Kelas: ${user.studentClass ?? "Siswa"}',
                            style: const TextStyle(fontSize: 13, color: AppColors.textSecondary),
                          ),
                          const SizedBox(height: 8),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              RankBadge(rank: user.rankName, fontSize: 11, showGlow: true),
                              const SizedBox(width: 10),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: AppColors.gold.withOpacity(0.15),
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(color: AppColors.gold.withOpacity(0.5)),
                                ),
                                child: Text(
                                  'Level ${user.level}',
                                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.gold),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          ExpProgressBar(
                            currentExp: user.exp,
                            expInLevel: user.expInLevel,
                            expNeededInLevel: user.expNeededInLevel,
                            expPercentage: user.expPercentage,
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 20),

                    // Avatar Customizer Card (PixelBot + Upload)
                    GlassCard(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Row(
                            children: [
                              Icon(Icons.palette_outlined, size: 18, color: AppColors.accent),
                              SizedBox(width: 8),
                              Text('Kustomisasi PixelBot & Foto Avatar', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                            ],
                          ),
                          const SizedBox(height: 12),
                          const Text(
                            'Pilih benih robot pixel (PixelBot) atau unggah foto asli Anda:',
                            style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
                          ),
                          const SizedBox(height: 12),

                          // Popular PixelBot seeds chips
                          Wrap(
                            spacing: 8,
                            runSpacing: 8,
                            children: [
                              ..._popularSeeds.map((seed) {
                                final isSelected = user.avatarSeed == seed;
                                return ActionChip(
                                  backgroundColor: isSelected ? AppColors.primary : AppColors.bgCardLighter,
                                  label: Text(seed, style: TextStyle(fontSize: 11, color: isSelected ? Colors.white : AppColors.textPrimary)),
                                  onPressed: () => _selectPixelSeed(seed),
                                );
                              }),
                              ActionChip(
                                backgroundColor: AppColors.bgCardLighter,
                                avatar: const Icon(Icons.casino, size: 14, color: AppColors.gold),
                                label: const Text('Acak (Random)', style: TextStyle(fontSize: 11)),
                                onPressed: () {
                                  final randomSeed = 'Seed_${Random().nextInt(99999)}';
                                  _selectPixelSeed(randomSeed);
                                },
                              ),
                            ],
                          ),

                          const SizedBox(height: 16),
                          const Divider(color: AppColors.border),
                          const SizedBox(height: 10),

                          Row(
                            children: [
                              Expanded(
                                child: OutlinedButton.icon(
                                  onPressed: _uploadCustomPhoto,
                                  icon: const Icon(Icons.upload_outlined, size: 16),
                                  label: const Text('Unggah Foto', style: TextStyle(fontSize: 12)),
                                ),
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                child: OutlinedButton.icon(
                                  onPressed: _resetAvatar,
                                  icon: const Icon(Icons.refresh, size: 16),
                                  label: const Text('Reset Siluet', style: TextStyle(fontSize: 12)),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 20),

                    // Badges Collection
                    GlassCard(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Row(
                                children: [
                                  Icon(Icons.military_tech, size: 18, color: AppColors.gold),
                                  SizedBox(width: 8),
                                  Text('Lencana Pencapaian', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                                ],
                              ),
                              Text(
                                '${_achievements.where((a) => a.isUnlocked).length}/${_achievements.length} Terbuka',
                                style: const TextStyle(fontSize: 12, color: AppColors.gold, fontWeight: FontWeight.bold),
                              ),
                            ],
                          ),
                          const SizedBox(height: 14),
                          GridView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemCount: _achievements.length,
                            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: 3,
                              crossAxisSpacing: 10,
                              mainAxisSpacing: 10,
                              childAspectRatio: 0.9,
                            ),
                            itemBuilder: (context, index) {
                              final ach = _achievements[index];
                              return Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: ach.isUnlocked ? AppColors.primary.withOpacity(0.15) : AppColors.bgDark,
                                  borderRadius: BorderRadius.circular(10),
                                  border: Border.all(color: ach.isUnlocked ? AppColors.primaryLight : AppColors.border),
                                ),
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(
                                      ach.isUnlocked ? Icons.verified : Icons.lock_outline,
                                      color: ach.isUnlocked ? AppColors.gold : AppColors.textMuted,
                                      size: 26,
                                    ),
                                    const SizedBox(height: 6),
                                    Text(
                                      ach.name,
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      textAlign: TextAlign.center,
                                      style: TextStyle(
                                        fontSize: 11,
                                        fontWeight: FontWeight.bold,
                                        color: ach.isUnlocked ? AppColors.textPrimary : AppColors.textMuted,
                                      ),
                                    ),
                                    Text(
                                      '+${ach.expReward} EXP',
                                      style: TextStyle(
                                        fontSize: 9,
                                        color: ach.isUnlocked ? AppColors.gold : AppColors.textMuted,
                                      ),
                                    ),
                                  ],
                                ),
                              );
                            },
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 20),

                    // Recent Quest History Log
                    GlassCard(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Row(
                            children: [
                              Icon(Icons.history, size: 18, color: AppColors.primaryLight),
                              SizedBox(width: 8),
                              Text('Riwayat 10 Quest Terakhir', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                            ],
                          ),
                          const SizedBox(height: 12),
                          if (_recentCompletions.isEmpty)
                            const Padding(
                              padding: EdgeInsets.symmetric(vertical: 12),
                              child: Text('Belum ada riwayat pengerjaan quest.', style: TextStyle(color: AppColors.textMuted, fontSize: 12)),
                            )
                          else
                            ListView.separated(
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              itemCount: _recentCompletions.length,
                              separatorBuilder: (_, __) => const Divider(color: AppColors.border, height: 16),
                              itemBuilder: (context, index) {
                                final item = _recentCompletions[index];
                                final isApproved = item['status'] == 'approved';
                                return Row(
                                  children: [
                                    Icon(
                                      isApproved ? Icons.check_circle : (item['status'] == 'pending' ? Icons.hourglass_top : Icons.cancel),
                                      color: isApproved ? AppColors.emerald : (item['status'] == 'pending' ? AppColors.gold : AppColors.ruby),
                                      size: 18,
                                    ),
                                    const SizedBox(width: 10),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(item['quest_title'] ?? 'Quest', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                                          Text(item['completed_at'] ?? '', style: const TextStyle(fontSize: 10, color: AppColors.textMuted)),
                                        ],
                                      ),
                                    ),
                                    Text(
                                      '+${item['exp_earned']} EXP',
                                      style: TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.bold,
                                        color: isApproved ? AppColors.gold : AppColors.textMuted,
                                      ),
                                    ),
                                  ],
                                );
                              },
                            ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 20),

                    // Security / Password Settings Button
                    SizedBox(
                      width: double.infinity,
                      child: OutlinedButton.icon(
                        style: OutlinedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 14)),
                        onPressed: _showPasswordDialog,
                        icon: const Icon(Icons.lock_reset, size: 18),
                        label: const Text('Ganti Kata Sandi Akun'),
                      ),
                    ),

                    const SizedBox(height: 30),
                  ],
                ),
              ),
            ),
    );
  }
}
