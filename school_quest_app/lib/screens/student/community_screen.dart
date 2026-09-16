import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../models/community_model.dart';
import '../../providers/community_provider.dart';
import '../../widgets/avatar_widget.dart';
import '../../widgets/glass_card.dart';
import '../../widgets/rank_badge.dart';
import 'thread_detail_screen.dart';

class CommunityScreen extends StatefulWidget {
  const CommunityScreen({super.key});

  @override
  State<CommunityScreen> createState() => _CommunityScreenState();
}

class _CommunityScreenState extends State<CommunityScreen> {
  final _searchController = TextEditingController();

  final List<Map<String, String>> _categories = [
    {'id': 'all', 'label': 'Semua'},
    {'id': 'umum', 'label': 'Umum'},
    {'id': 'quest', 'label': 'Quest'},
    {'id': 'bug', 'label': 'Bug'},
    {'id': 'saran', 'label': 'Saran'},
    {'id': 'showcase', 'label': 'Showcase'},
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<CommunityProvider>(context, listen: false).fetchThreads();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _showCreateThreadDialog() {
    final titleController = TextEditingController();
    final bodyController = TextEditingController();
    String category = 'umum';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) {
          return Container(
            padding: EdgeInsets.only(
              top: 20,
              left: 20,
              right: 20,
              bottom: MediaQuery.of(context).viewInsets.bottom + 20,
            ),
            decoration: const BoxDecoration(
              color: AppColors.bgCard,
              borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
              border: Border(top: BorderSide(color: AppColors.border)),
            ),
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text(
                    'BUAT DISKUSI BARU DI THE REALM',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 0.5,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: titleController,
                    decoration: const InputDecoration(labelText: 'Judul Diskusi'),
                  ),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<String>(
                    value: category,
                    dropdownColor: AppColors.bgCardLighter,
                    decoration: const InputDecoration(labelText: 'Kategori'),
                    items: const [
                      DropdownMenuItem(value: 'umum', child: Text('Umum')),
                      DropdownMenuItem(value: 'quest', child: Text('Quest')),
                      DropdownMenuItem(value: 'bug', child: Text('Bug & Kendala')),
                      DropdownMenuItem(value: 'saran', child: Text('Saran & Ide')),
                      DropdownMenuItem(value: 'showcase', child: Text('Showcase Prestasi')),
                    ],
                    onChanged: (val) {
                      if (val != null) setModalState(() => category = val);
                    },
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: bodyController,
                    maxLines: 4,
                    decoration: const InputDecoration(
                      labelText: 'Isi Diskusi',
                      hintText: 'Tuliskan topik pembahasan Anda...',
                    ),
                  ),
                  const SizedBox(height: 20),
                  ElevatedButton(
                    onPressed: () async {
                      if (titleController.text.trim().isEmpty || bodyController.text.trim().isEmpty) {
                        return;
                      }
                      final provider = Provider.of<CommunityProvider>(ctx, listen: false);
                      final success = await provider.createThread(
                        titleController.text.trim(),
                        category,
                        bodyController.text.trim(),
                      );
                      if (context.mounted && success) {
                        Navigator.pop(ctx);
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Diskusi berhasil dipublikasikan!'),
                            backgroundColor: AppColors.emerald,
                          ),
                        );
                      }
                    },
                    child: const Text('PUBLIKASIKAN THREAD'),
                  ),
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
    final provider = Provider.of<CommunityProvider>(context);

    return Scaffold(
      backgroundColor: AppColors.bgDark,
      appBar: AppBar(
        title: const Text(
          'THE REALM - FORUM KOMUNITAS',
          style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 0.8),
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppColors.primary,
        onPressed: provider.isMuted ? null : _showCreateThreadDialog,
        icon: const Icon(Icons.add_comment, color: Colors.white),
        label: const Text(
          'BUAT DISKUSI',
          style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
        ),
      ),
      body: RefreshIndicator(
        color: AppColors.primaryLight,
        onRefresh: () => provider.fetchThreads(),
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Mute notification banner if user is muted
              if (provider.isMuted) ...[
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.ruby.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppColors.ruby),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.volume_off, color: AppColors.ruby, size: 20),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'Anda sedang di-mute hingga ${provider.muteRemaining ?? "beberapa saat"}. Tidak dapat membuat thread atau komentar.',
                          style: const TextStyle(fontSize: 12, color: AppColors.ruby),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 12),
              ],

              // Search Bar
              TextField(
                controller: _searchController,
                decoration: InputDecoration(
                  hintText: 'Cari diskusi, topik, atau kata kunci...',
                  prefixIcon: const Icon(Icons.search, color: AppColors.textMuted),
                  suffixIcon: _searchController.text.isNotEmpty
                      ? IconButton(
                          icon: const Icon(Icons.clear, color: AppColors.textMuted),
                          onPressed: () {
                            _searchController.clear();
                            provider.setSearch('');
                          },
                        )
                      : null,
                ),
                onSubmitted: (val) => provider.setSearch(val),
              ),

              const SizedBox(height: 12),

              // Category Filter Pills
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: _categories.map((cat) {
                    final isSelected = provider.selectedCategory == cat['id'];
                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: FilterChip(
                        selected: isSelected,
                        label: Text(cat['label']!),
                        backgroundColor: AppColors.bgCard,
                        selectedColor: AppColors.primary,
                        checkmarkColor: Colors.white,
                        labelStyle: TextStyle(
                          fontSize: 12,
                          color: isSelected ? Colors.white : AppColors.textSecondary,
                          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                        ),
                        side: BorderSide(
                          color: isSelected ? AppColors.primaryLight : AppColors.border,
                        ),
                        onSelected: (_) => provider.setCategory(cat['id']!),
                      ),
                    );
                  }).toList(),
                ),
              ),

              const SizedBox(height: 14),

              // Sort Dropdown & Threads Count
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    '${provider.threads.length} Diskusi Ditemukan',
                    style: const TextStyle(fontSize: 12, color: AppColors.textMuted),
                  ),
                  DropdownButton<String>(
                    value: provider.selectedSort,
                    dropdownColor: AppColors.bgCardLighter,
                    underline: const SizedBox.shrink(),
                    icon: const Icon(Icons.sort, size: 18, color: AppColors.primaryLight),
                    items: const [
                      DropdownMenuItem(value: 'latest', child: Text('Terbaru', style: TextStyle(fontSize: 12))),
                      DropdownMenuItem(value: 'popular', child: Text('Terpopuler', style: TextStyle(fontSize: 12))),
                      DropdownMenuItem(value: 'unanswered', child: Text('Belum Dijawab', style: TextStyle(fontSize: 12))),
                      DropdownMenuItem(value: 'active', child: Text('Paling Aktif', style: TextStyle(fontSize: 12))),
                    ],
                    onChanged: (val) {
                      if (val != null) provider.setSort(val);
                    },
                  ),
                ],
              ),

              const SizedBox(height: 10),

              // Threads List
              if (provider.isLoading && provider.threads.isEmpty)
                const Center(
                  child: Padding(
                    padding: EdgeInsets.symmetric(vertical: 40),
                    child: CircularProgressIndicator(color: AppColors.primaryLight),
                  ),
                )
              else if (provider.threads.isEmpty)
                const Center(
                  child: Padding(
                    padding: EdgeInsets.symmetric(vertical: 40),
                    child: Text(
                      'Belum ada diskusi dalam kategori ini. Jadilah yang pertama memulai!',
                      style: TextStyle(color: AppColors.textMuted, fontSize: 13),
                    ),
                  ),
                )
              else
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: provider.threads.length,
                  itemBuilder: (context, index) {
                    final thread = provider.threads[index];
                    return _buildThreadCard(thread, provider);
                  },
                ),

              const SizedBox(height: 70),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildThreadCard(ForumThreadModel thread, CommunityProvider provider) {
    return GlassCard(
      margin: const EdgeInsets.only(bottom: 12),
      onTap: () {
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (_) => ThreadDetailScreen(threadId: thread.id),
          ),
        );
      },
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Author header & badges
          Row(
            children: [
              AvatarWidget(
                avatar: thread.author?.avatar,
                avatarSeed: thread.author?.avatarSeed,
                size: 32,
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      thread.author?.name ?? 'Anonim',
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.bold,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    Text(
                      '${thread.author?.studentClass ?? "Siswa"} • ${thread.createdAt}',
                      style: const TextStyle(fontSize: 10, color: AppColors.textMuted),
                    ),
                  ],
                ),
              ),
              if (thread.author != null)
                RankBadge(rank: thread.author!.rankName, fontSize: 9),
            ],
          ),

          const SizedBox(height: 10),

          // Pinned & Locked indicators
          if (thread.isPinned || thread.isLocked) ...[
            Row(
              children: [
                if (thread.isPinned)
                  Container(
                    margin: const EdgeInsets.only(right: 6),
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: AppColors.gold.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: const Text('📌 PINNED', style: TextStyle(fontSize: 9, color: AppColors.gold, fontWeight: FontWeight.bold)),
                  ),
                if (thread.isLocked)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: AppColors.ruby.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: const Text('🔒 LOCKED', style: TextStyle(fontSize: 9, color: AppColors.ruby, fontWeight: FontWeight.bold)),
                  ),
              ],
            ),
            const SizedBox(height: 6),
          ],

          // Title
          Text(
            thread.title,
            style: const TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 4),

          // Snippet
          Text(
            thread.body,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(fontSize: 13, color: AppColors.textSecondary),
          ),

          const SizedBox(height: 12),

          // Footer metrics (Likes, Replies, Views)
          Row(
            children: [
              // Like Button
              InkWell(
                onTap: () => provider.toggleLike('thread', thread.id),
                borderRadius: BorderRadius.circular(6),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
                  child: Row(
                    children: [
                      Icon(
                        thread.isLiked ? Icons.favorite : Icons.favorite_border,
                        size: 16,
                        color: thread.isLiked ? AppColors.ruby : AppColors.textMuted,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        '${thread.likesCount}',
                        style: TextStyle(
                          fontSize: 12,
                          color: thread.isLiked ? AppColors.ruby : AppColors.textMuted,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 14),

              // Reply count
              Row(
                children: [
                  const Icon(Icons.mode_comment_outlined, size: 16, color: AppColors.textMuted),
                  const SizedBox(width: 4),
                  Text(
                    '${thread.repliesCount}',
                    style: const TextStyle(fontSize: 12, color: AppColors.textMuted),
                  ),
                ],
              ),
              const SizedBox(width: 14),

              // Views count
              Row(
                children: [
                  const Icon(Icons.remove_red_eye_outlined, size: 16, color: AppColors.textMuted),
                  const SizedBox(width: 4),
                  Text(
                    '${thread.viewsCount}',
                    style: const TextStyle(fontSize: 12, color: AppColors.textMuted),
                  ),
                ],
              ),

              const Spacer(),

              // Category tag
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: AppColors.bgCardLighter,
                  borderRadius: BorderRadius.circular(4),
                  border: Border.all(color: AppColors.border),
                ),
                child: Text(
                  '#${thread.category}',
                  style: const TextStyle(fontSize: 10, color: AppColors.textMuted),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
