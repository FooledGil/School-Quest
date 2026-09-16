import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../models/community_model.dart';
import '../../providers/community_provider.dart';
import '../../widgets/avatar_widget.dart';
import '../../widgets/glass_card.dart';
import '../../widgets/rank_badge.dart';

class ThreadDetailScreen extends StatefulWidget {
  final int threadId;

  const ThreadDetailScreen({super.key, required this.threadId});

  @override
  State<ThreadDetailScreen> createState() => _ThreadDetailScreenState();
}

class _ThreadDetailScreenState extends State<ThreadDetailScreen> {
  final _replyController = TextEditingController();
  int? _replyingToParentId;
  String? _replyingToAuthorName;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<CommunityProvider>(context, listen: false).fetchThreadDetail(widget.threadId);
    });
  }

  @override
  void dispose() {
    _replyController.dispose();
    super.dispose();
  }

  void _showReportDialog(String type, int id) {
    String reason = 'spam';
    final detailsController = TextEditingController();

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) {
          return AlertDialog(
            backgroundColor: AppColors.bgCard,
            title: const Text('Laporkan Konten ke Moderator'),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                DropdownButtonFormField<String>(
                  value: reason,
                  dropdownColor: AppColors.bgCardLighter,
                  decoration: const InputDecoration(labelText: 'Alasan Laporan'),
                  items: const [
                    DropdownMenuItem(value: 'spam', child: Text('Spam / Iklan')),
                    DropdownMenuItem(value: 'offensive', child: Text('Kata Kasar / Tidak Pantas')),
                    DropdownMenuItem(value: 'harassment', child: Text('Perundungan / Pelecehan')),
                    DropdownMenuItem(value: 'cheating', child: Text('Kecurangan Tugas')),
                    DropdownMenuItem(value: 'other', child: Text('Lainnya')),
                  ],
                  onChanged: (val) {
                    if (val != null) setModalState(() => reason = val);
                  },
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: detailsController,
                  maxLines: 2,
                  decoration: const InputDecoration(
                    labelText: 'Detail Tambahan (Opsional)',
                  ),
                ),
              ],
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(ctx),
                child: const Text('Batal'),
              ),
              ElevatedButton(
                style: ElevatedButton.styleFrom(backgroundColor: AppColors.ruby),
                onPressed: () async {
                  final provider = Provider.of<CommunityProvider>(context, listen: false);
                  final success = await provider.reportContent(
                    type,
                    id,
                    reason,
                    details: detailsController.text.trim(),
                  );
                  if (mounted) {
                    Navigator.pop(ctx);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(success ? 'Laporan berhasil dikirim ke moderator!' : 'Gagal mengirim laporan.'),
                        backgroundColor: success ? AppColors.emerald : AppColors.ruby,
                      ),
                    );
                  }
                },
                child: const Text('Kirim Laporan'),
              ),
            ],
          );
        },
      ),
    );
  }

  Future<void> _handleSendReply() async {
    final text = _replyController.text.trim();
    if (text.isEmpty) return;

    final provider = Provider.of<CommunityProvider>(context, listen: false);
    final success = await provider.replyThread(
      widget.threadId,
      text,
      parentId: _replyingToParentId,
    );

    if (mounted && success) {
      _replyController.clear();
      setState(() {
        _replyingToParentId = null;
        _replyingToAuthorName = null;
      });
      FocusScope.of(context).unfocus();
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<CommunityProvider>(context);
    final thread = provider.currentThread;
    final replies = provider.currentReplies;

    return Scaffold(
      backgroundColor: AppColors.bgDark,
      appBar: AppBar(
        title: const Text('DISKUSI FORUM'),
        actions: [
          if (thread != null)
            IconButton(
              icon: const Icon(Icons.flag_outlined, color: AppColors.ruby),
              tooltip: 'Laporkan Thread',
              onPressed: () => _showReportDialog('thread', thread.id),
            ),
        ],
      ),
      body: provider.isDetailLoading && thread == null
          ? const Center(child: CircularProgressIndicator(color: AppColors.primaryLight))
          : thread == null
              ? const Center(child: Text('Thread tidak ditemukan.', style: TextStyle(color: AppColors.textMuted)))
              : Column(
                  children: [
                    Expanded(
                      child: SingleChildScrollView(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Main Thread Content
                            _buildThreadHeader(thread, provider),

                            const SizedBox(height: 20),

                            // Replies Header
                            Row(
                              children: [
                                const Icon(Icons.mode_comment, size: 16, color: AppColors.primaryLight),
                                const SizedBox(width: 8),
                                Text(
                                  'Balasan (${replies.length})',
                                  style: const TextStyle(
                                    fontSize: 15,
                                    fontWeight: FontWeight.bold,
                                    color: AppColors.textPrimary,
                                  ),
                                ),
                              ],
                            ),

                            const SizedBox(height: 12),

                            // Replies List
                            if (replies.isEmpty)
                              const Padding(
                                padding: EdgeInsets.symmetric(vertical: 24),
                                child: Center(
                                  child: Text(
                                    'Belum ada balasan. Berikan tanggapan pertamamu!',
                                    style: TextStyle(color: AppColors.textMuted, fontSize: 13),
                                  ),
                                ),
                              )
                            else
                              ListView.builder(
                                shrinkWrap: true,
                                physics: const NeverScrollableScrollPhysics(),
                                itemCount: replies.length,
                                itemBuilder: (context, index) {
                                  final reply = replies[index];
                                  return _buildReplyItem(reply, provider);
                                },
                              ),
                          ],
                        ),
                      ),
                    ),

                    // Reply Input Bar at Bottom
                    _buildBottomReplyBar(thread, provider),
                  ],
                ),
    );
  }

  Widget _buildThreadHeader(ForumThreadModel thread, CommunityProvider provider) {
    return GlassCard(
      padding: const EdgeInsets.all(18),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              AvatarWidget(
                avatar: thread.author?.avatar,
                avatarSeed: thread.author?.avatarSeed,
                size: 40,
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      thread.author?.name ?? 'Anonim',
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    Text(
                      '${thread.author?.studentClass ?? "Siswa"} • ${thread.createdAt}',
                      style: const TextStyle(fontSize: 11, color: AppColors.textMuted),
                    ),
                  ],
                ),
              ),
              if (thread.author != null)
                RankBadge(rank: thread.author!.rankName),
            ],
          ),

          const SizedBox(height: 14),

          Text(
            thread.title,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 8),

          Text(
            thread.body,
            style: const TextStyle(
              fontSize: 14,
              height: 1.5,
              color: AppColors.textSecondary,
            ),
          ),

          const SizedBox(height: 16),

          Row(
            children: [
              InkWell(
                onTap: () => provider.toggleLike('thread', thread.id),
                child: Row(
                  children: [
                    Icon(
                      thread.isLiked ? Icons.favorite : Icons.favorite_border,
                      color: thread.isLiked ? AppColors.ruby : AppColors.textMuted,
                      size: 20,
                    ),
                    const SizedBox(width: 6),
                    Text(
                      '${thread.likesCount} Suka',
                      style: TextStyle(
                        fontSize: 13,
                        color: thread.isLiked ? AppColors.ruby : AppColors.textMuted,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 18),
              Row(
                children: [
                  const Icon(Icons.remove_red_eye_outlined, size: 18, color: AppColors.textMuted),
                  const SizedBox(width: 6),
                  Text(
                    '${thread.viewsCount} Dilihat',
                    style: const TextStyle(fontSize: 13, color: AppColors.textMuted),
                  ),
                ],
              ),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppColors.bgCardLighter,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text('#${thread.category}', style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildReplyItem(ForumReplyModel reply, CommunityProvider provider) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Parent Reply Card
          GlassCard(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    AvatarWidget(
                      avatar: reply.author?.avatar,
                      avatarSeed: reply.author?.avatarSeed,
                      size: 28,
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            reply.author?.name ?? 'Anonim',
                            style: const TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: AppColors.textPrimary,
                            ),
                          ),
                          Text(
                            reply.createdAt,
                            style: const TextStyle(fontSize: 10, color: AppColors.textMuted),
                          ),
                        ],
                      ),
                    ),
                    if (reply.author != null)
                      RankBadge(rank: reply.author!.rankName, fontSize: 8),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  reply.body,
                  style: const TextStyle(fontSize: 13, color: AppColors.textSecondary),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    InkWell(
                      onTap: () => provider.toggleLike('reply', reply.id),
                      child: Row(
                        children: [
                          Icon(
                            reply.isLiked ? Icons.favorite : Icons.favorite_border,
                            size: 14,
                            color: reply.isLiked ? AppColors.ruby : AppColors.textMuted,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            '${reply.likesCount}',
                            style: const TextStyle(fontSize: 11, color: AppColors.textMuted),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 14),
                    InkWell(
                      onTap: () {
                        setState(() {
                          _replyingToParentId = reply.id;
                          _replyingToAuthorName = reply.author?.name;
                        });
                      },
                      child: const Row(
                        children: [
                          Icon(Icons.reply, size: 14, color: AppColors.primaryLight),
                          SizedBox(width: 4),
                          Text('Balas', style: TextStyle(fontSize: 11, color: AppColors.primaryLight)),
                        ],
                      ),
                    ),
                    const Spacer(),
                    InkWell(
                      onTap: () => _showReportDialog('reply', reply.id),
                      child: const Icon(Icons.flag_outlined, size: 14, color: AppColors.textMuted),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Nested Replies (if any)
          if (reply.replies.isNotEmpty)
            Padding(
              padding: const EdgeInsets.only(left: 24, top: 6),
              child: Column(
                children: reply.replies.map((child) {
                  return GlassCard(
                    margin: const EdgeInsets.only(bottom: 6),
                    backgroundColor: AppColors.bgSurface,
                    padding: const EdgeInsets.all(12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            AvatarWidget(
                              avatar: child.author?.avatar,
                              avatarSeed: child.author?.avatarSeed,
                              size: 24,
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                child.author?.name ?? 'Anonim',
                                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
                              ),
                            ),
                            Text(child.createdAt, style: const TextStyle(fontSize: 9, color: AppColors.textMuted)),
                          ],
                        ),
                        const SizedBox(height: 6),
                        Text(child.body, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                      ],
                    ),
                  );
                }).toList(),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildBottomReplyBar(ForumThreadModel thread, CommunityProvider provider) {
    if (thread.isLocked) {
      return Container(
        padding: const EdgeInsets.all(16),
        color: AppColors.bgCard,
        child: const Center(
          child: Text('Diskusi ini dikunci oleh moderator.', style: TextStyle(color: AppColors.ruby, fontSize: 13)),
        ),
      );
    }

    if (provider.isMuted) {
      return Container(
        padding: const EdgeInsets.all(16),
        color: AppColors.bgCard,
        child: Text(
          'Akun Anda sedang di-mute hingga ${provider.muteRemaining}.',
          style: const TextStyle(color: AppColors.ruby, fontSize: 13),
        ),
      );
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: const BoxDecoration(
        color: AppColors.bgCard,
        border: Border(top: BorderSide(color: AppColors.border)),
      ),
      child: SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (_replyingToParentId != null)
              Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.primary.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Row(
                  children: [
                    Text(
                      'Membalas $_replyingToAuthorName',
                      style: const TextStyle(fontSize: 11, color: AppColors.primaryLight),
                    ),
                    const Spacer(),
                    InkWell(
                      onTap: () {
                        setState(() {
                          _replyingToParentId = null;
                          _replyingToAuthorName = null;
                        });
                      },
                      child: const Icon(Icons.close, size: 14, color: AppColors.primaryLight),
                    ),
                  ],
                ),
              ),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _replyController,
                    decoration: InputDecoration(
                      hintText: _replyingToParentId != null ? 'Tulis balasanmu...' : 'Berikan pendapatmu...',
                      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                IconButton(
                  icon: const Icon(Icons.send, color: AppColors.primaryLight),
                  onPressed: _handleSendReply,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
