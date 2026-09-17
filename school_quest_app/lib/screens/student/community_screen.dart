import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../models/community_model.dart';
import '../../providers/community_provider.dart';
import '../../widgets/avatar_widget.dart';
import 'thread_detail_screen.dart';

class CommunityScreen extends StatefulWidget {
  const CommunityScreen({super.key});

  @override
  State<CommunityScreen> createState() => _CommunityScreenState();
}

class _CommunityScreenState extends State<CommunityScreen> {
  final _searchController = TextEditingController();

  final List<Map<String, String>> _categories = [
    {'id': 'all', 'label': 'Semua Topik'},
    {'id': 'umum', 'label': 'Umum'},
    {'id': 'quest', 'label': 'Quest & Misi'},
    {'id': 'rpl', 'label': 'Diskusi RPL'},
    {'id': 'bug', 'label': 'Bug & Kendala'},
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
            decoration: BoxDecoration(
              color: AppColors.surfaceCard,
              borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
              border: Border.all(color: AppColors.borderPixel),
            ),
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Row(
                    children: const [
                      Icon(Icons.castle, color: AppColors.gold, size: 20),
                      SizedBox(width: 8),
                      Text(
                        'BUAT TOPIK BARU DI THE REALM',
                        style: TextStyle(
                          fontFamily: 'Outfit',
                          fontSize: 16,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 0.5,
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: titleController,
                    decoration: const InputDecoration(labelText: 'Judul Topik Diskusi'),
                  ),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<String>(
                    value: category,
                    dropdownColor: AppColors.surfaceDeep,
                    decoration: const InputDecoration(labelText: 'Kategori'),
                    items: const [
                      DropdownMenuItem(value: 'umum', child: Text('Umum')),
                      DropdownMenuItem(value: 'quest', child: Text('Quest & Misi')),
                      DropdownMenuItem(value: 'rpl', child: Text('Diskusi Kejuruan RPL')),
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
                      hintText: 'Tuliskan topik, pertanyaan, atau pembahasan Anda...',
                    ),
                  ),
                  const SizedBox(height: 20),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primaryContainer,
                      foregroundColor: AppColors.onPrimaryContainer,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
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
                            content: Text('Topik diskusi berhasil dipublikasikan! ⚔️'),
                            backgroundColor: AppColors.emerald,
                          ),
                        );
                      }
                    },
                    child: const Text(
                      'PUBLIKASIKAN TOPIK',
                      style: TextStyle(
                        fontFamily: 'Outfit',
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.8,
                      ),
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

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<CommunityProvider>(context);

    return Scaffold(
      backgroundColor: AppColors.surfaceCanvas,
      appBar: AppBar(
        title: const Row(
          children: [
            Icon(Icons.castle, color: AppColors.gold, size: 22),
            SizedBox(width: 8),
            Text(
              'THE REALM',
              style: TextStyle(
                fontFamily: 'Outfit',
                fontWeight: FontWeight.w800,
                letterSpacing: 0.8,
                fontSize: 16,
              ),
            ),
          ],
        ),
      ),
      body: RefreshIndicator(
        color: AppColors.gold,
        backgroundColor: AppColors.surfaceCard,
        onRefresh: () => provider.fetchThreads(),
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Mute notification banner if user is muted
              if (provider.isMuted) ...[
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.ruby.withOpacity(0.12),
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

              // ── 1. Realm Forum Header Card ──
              _buildForumHeaderCard(provider),

              const SizedBox(height: 14),

              // ── 2. Castle Common Room (Live Tavern Showcase) ──
              _buildLiveTavernCard(provider),

              const SizedBox(height: 14),

              // ── 3. Search Bar ──
              TextField(
                controller: _searchController,
                decoration: InputDecoration(
                  hintText: 'Cari topik diskusi atau nama petualang...',
                  prefixIcon: const Icon(Icons.search, color: AppColors.textMuted, size: 20),
                  suffixIcon: _searchController.text.isNotEmpty
                      ? IconButton(
                          icon: const Icon(Icons.clear, color: AppColors.textMuted, size: 18),
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

              // ── 4. Category Filter Chips ──
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: _categories.map((cat) {
                    final isSelected = provider.selectedCategory == cat['id'];
                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: InkWell(
                        onTap: () => provider.setCategory(cat['id']!),
                        borderRadius: BorderRadius.circular(10),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
                          decoration: BoxDecoration(
                            color: isSelected ? AppColors.primaryContainer : AppColors.surfaceCard,
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(
                              color: isSelected ? AppColors.primaryContainer : AppColors.borderPixel,
                            ),
                          ),
                          child: Text(
                            cat['label']!,
                            style: TextStyle(
                              fontFamily: 'Outfit',
                              fontSize: 11.5,
                              fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                              color: isSelected ? AppColors.onPrimaryContainer : AppColors.textSecondary,
                            ),
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ),

              const SizedBox(height: 16),

              // ── 5. Threads List Feed ──
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    '${provider.threads.length} Topik Diskusi',
                    style: const TextStyle(
                      fontFamily: 'Outfit',
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textMuted,
                    ),
                  ),
                  DropdownButton<String>(
                    value: provider.selectedSort,
                    dropdownColor: AppColors.surfaceCard,
                    underline: const SizedBox.shrink(),
                    style: const TextStyle(
                      fontFamily: 'Outfit',
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: AppColors.manaCyan,
                    ),
                    items: const [
                      DropdownMenuItem(value: 'newest', child: Text('Terbaru')),
                      DropdownMenuItem(value: 'popular', child: Text('Terpopuler')),
                    ],
                    onChanged: (val) {
                      if (val != null) provider.setSort(val);
                    },
                  ),
                ],
              ),
              const SizedBox(height: 8),

              if (provider.isLoading && provider.threads.isEmpty)
                const Center(
                  child: Padding(
                    padding: EdgeInsets.all(32),
                    child: CircularProgressIndicator(color: AppColors.manaCyan),
                  ),
                )
              else if (provider.threads.isEmpty)
                Container(
                  padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 20),
                  decoration: BoxDecoration(
                    color: AppColors.surfaceCard,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.borderPixel),
                  ),
                  child: const Center(
                    child: Text(
                      'Belum ada diskusi dalam kategori ini. Jadilah yang pertama membuat topik!',
                      textAlign: TextAlign.center,
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

              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }

  // ─── Header Card ───
  Widget _buildForumHeaderCard(CommunityProvider provider) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surfaceCard,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderPixel),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.3),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: const [
              Icon(Icons.forum_outlined, size: 14, color: AppColors.manaCyan),
              SizedBox(width: 4),
              Text(
                'GUILD FORUM & COMMUNITY REALM',
                style: TextStyle(
                  fontSize: 9.5,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 1.0,
                  color: AppColors.manaCyan,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          const Text(
            'Ruang berkumpul & berdiskusi para petualang SchoolQuest. Tanyakan bantuan misi atau diskusikan pelajaran!',
            style: TextStyle(
              fontSize: 12.5,
              color: AppColors.textSecondary,
              height: 1.35,
            ),
          ),
          const SizedBox(height: 12),

          // Radiant "+ BUAT TOPIK BARU" button
          Container(
            width: double.infinity,
            height: 46,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              gradient: const LinearGradient(
                colors: [
                  AppColors.primaryContainer,
                  AppColors.amberGlow,
                ],
              ),
              boxShadow: [
                BoxShadow(
                  color: AppColors.primaryContainer.withOpacity(0.35),
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Material(
              color: Colors.transparent,
              borderRadius: BorderRadius.circular(12),
              child: InkWell(
                onTap: provider.isMuted ? null : _showCreateThreadDialog,
                borderRadius: BorderRadius.circular(12),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: const [
                    Icon(Icons.add_circle, color: AppColors.surfaceDeep, size: 20),
                    SizedBox(width: 6),
                    Text(
                      '+ BUAT TOPIK BARU',
                      style: TextStyle(
                        fontFamily: 'Outfit',
                        fontSize: 13.5,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.8,
                        color: AppColors.surfaceDeep,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ─── Live Tavern Showcase Card ───
  Widget _buildLiveTavernCard(CommunityProvider provider) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surfaceCard,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderPixel),
      ),
      child: Column(
        children: [
          // Banner Frame
          Container(
            height: 80,
            width: double.infinity,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(10),
              color: AppColors.surfaceDeep,
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
                  color: AppColors.surfaceDeep.withOpacity(0.65),
                ),
                Positioned(
                  top: 8,
                  left: 8,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: AppColors.surfaceDeep.withOpacity(0.85),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 6,
                          height: 6,
                          decoration: const BoxDecoration(
                            shape: BoxShape.circle,
                            color: AppColors.emerald,
                          ),
                        ),
                        const SizedBox(width: 6),
                        const Text(
                          'CASTLE COMMON ROOM • LIVE TAVERN',
                          style: TextStyle(
                            fontSize: 9,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 0.8,
                            color: AppColors.amberGlow,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 10),

          // Live stats row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(Icons.people_alt_outlined, size: 16, color: AppColors.manaCyan),
                  const SizedBox(width: 6),
                  Text(
                    '24 Petualang berkumpul',
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppColors.surfaceDeep,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.local_fire_department, size: 13, color: AppColors.manaCyan),
                    const SizedBox(width: 4),
                    Text(
                      '${provider.threads.length} Topik Aktif',
                      style: const TextStyle(
                        fontSize: 10.5,
                        fontWeight: FontWeight.w700,
                        color: AppColors.manaCyan,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // ─── Thread Card ───
  Widget _buildThreadCard(ForumThreadModel thread, CommunityProvider provider) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surfaceCard,
        borderRadius: BorderRadius.circular(16),
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
          // Row 1: Author info + Category Tag
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  AvatarWidget(
                    avatar: thread.author?.avatar,
                    avatarSeed: thread.author?.avatarSeed,
                    size: 32,
                  ),
                  const SizedBox(width: 8),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(
                            thread.author?.name ?? 'Anonim',
                            style: const TextStyle(
                              fontFamily: 'Outfit',
                              fontSize: 13,
                              fontWeight: FontWeight.w700,
                              color: AppColors.textPrimary,
                            ),
                          ),
                          const SizedBox(width: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
                            decoration: BoxDecoration(
                              color: AppColors.surfaceDeep,
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              thread.author?.studentClass ?? 'Siswa',
                              style: const TextStyle(
                                fontSize: 9,
                                fontWeight: FontWeight.w700,
                                color: AppColors.manaCyan,
                              ),
                            ),
                          ),
                        ],
                      ),
                      Text(
                        thread.createdAt,
                        style: const TextStyle(fontSize: 10, color: AppColors.textMuted),
                      ),
                    ],
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppColors.surfaceDeep,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  thread.category.toUpperCase(),
                  style: const TextStyle(
                    fontSize: 9.5,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 0.6,
                    color: AppColors.amberGlow,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),

          // Title
          InkWell(
            onTap: () {
              Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => ThreadDetailScreen(threadId: thread.id)),
              );
            },
            child: Text(
              thread.title,
              style: const TextStyle(
                fontFamily: 'Outfit',
                fontSize: 15,
                fontWeight: FontWeight.w700,
                color: AppColors.textPrimary,
              ),
            ),
          ),
          const SizedBox(height: 4),

          // Content preview
          Text(
            thread.body,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(
              fontSize: 12,
              color: AppColors.textMuted,
              height: 1.35,
            ),
          ),
          const SizedBox(height: 12),

          // Row 3: Interaction actions (Likes, comments, reply button)
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
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
                            size: 17,
                            color: thread.isLiked ? AppColors.ruby : AppColors.textMuted,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            '${thread.likesCount}',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                              color: thread.isLiked ? AppColors.ruby : AppColors.textMuted,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),

                  // Comment Count
                  Row(
                    children: [
                      const Icon(Icons.chat_bubble_outline, size: 16, color: AppColors.textMuted),
                      const SizedBox(width: 4),
                      Text(
                        '${thread.repliesCount} Balasan',
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textMuted,
                        ),
                      ),
                    ],
                  ),
                ],
              ),

              // Action button
              InkWell(
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(builder: (_) => ThreadDetailScreen(threadId: thread.id)),
                  );
                },
                borderRadius: BorderRadius.circular(8),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                  decoration: BoxDecoration(
                    color: AppColors.surfaceDeep,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: AppColors.borderPixel),
                  ),
                  child: Row(
                    children: const [
                      Text(
                        'Tanggapi',
                        style: TextStyle(
                          fontFamily: 'Outfit',
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: AppColors.manaCyan,
                        ),
                      ),
                      SizedBox(width: 3),
                      Icon(Icons.arrow_forward, size: 12, color: AppColors.manaCyan),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
