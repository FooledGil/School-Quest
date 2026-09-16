import '../core/constants/api_constants.dart';

class ForumAuthorModel {
  final int id;
  final String name;
  final String? studentClass;
  final int level;
  final String rankName;
  final String? avatar;
  final String? avatarSeed;

  ForumAuthorModel({
    required this.id,
    required this.name,
    this.studentClass,
    required this.level,
    required this.rankName,
    this.avatar,
    this.avatarSeed,
  });

  String get avatarDisplayUrl {
    if (avatar != null && avatar!.isNotEmpty) {
      return ApiConstants.resolveImageUrl(avatar);
    }
    if (avatarSeed != null && avatarSeed!.isNotEmpty) {
      return ApiConstants.getDiceBearAvatar(avatarSeed!);
    }
    return '';
  }

  factory ForumAuthorModel.fromJson(Map<String, dynamic> json) {
    return ForumAuthorModel(
      id: json['id'] ?? 0,
      name: json['name'] ?? 'Anonim',
      studentClass: json['class'],
      level: json['level'] ?? 1,
      rankName: json['rank_name'] ?? 'Novice',
      avatar: json['avatar'],
      avatarSeed: json['avatar_seed'],
    );
  }
}

class ForumReplyModel {
  final int id;
  final int forumThreadId;
  final int? parentId;
  final String body;
  final int likesCount;
  bool isLiked;
  final String createdAt;
  final ForumAuthorModel? author;
  final List<ForumReplyModel> replies;

  ForumReplyModel({
    required this.id,
    required this.forumThreadId,
    this.parentId,
    required this.body,
    required this.likesCount,
    this.isLiked = false,
    required this.createdAt,
    this.author,
    this.replies = const [],
  });

  factory ForumReplyModel.fromJson(Map<String, dynamic> json) {
    return ForumReplyModel(
      id: json['id'] ?? 0,
      forumThreadId: json['forum_thread_id'] ?? 0,
      parentId: json['parent_id'],
      body: json['body'] ?? '',
      likesCount: json['likes_count'] ?? 0,
      isLiked: json['is_liked'] ?? false,
      createdAt: json['created_at'] ?? '',
      author: json['user'] != null ? ForumAuthorModel.fromJson(json['user']) : null,
      replies: (json['replies'] as List? ?? [])
          .map((r) => ForumReplyModel.fromJson(r))
          .toList(),
    );
  }
}

class ForumThreadModel {
  final int id;
  final String title;
  final String body;
  final String category;
  final bool isPinned;
  final bool isLocked;
  final int viewsCount;
  final int repliesCount;
  int likesCount;
  bool isLiked;
  final String createdAt;
  final ForumAuthorModel? author;

  ForumThreadModel({
    required this.id,
    required this.title,
    required this.body,
    required this.category,
    this.isPinned = false,
    this.isLocked = false,
    this.viewsCount = 0,
    this.repliesCount = 0,
    this.likesCount = 0,
    this.isLiked = false,
    required this.createdAt,
    this.author,
  });

  factory ForumThreadModel.fromJson(Map<String, dynamic> json) {
    return ForumThreadModel(
      id: json['id'] ?? 0,
      title: json['title'] ?? '',
      body: json['body'] ?? '',
      category: json['category'] ?? 'umum',
      isPinned: json['is_pinned'] == 1 || json['is_pinned'] == true,
      isLocked: json['is_locked'] == 1 || json['is_locked'] == true,
      viewsCount: json['views_count'] ?? 0,
      repliesCount: json['all_replies_count'] ?? json['replies_count'] ?? 0,
      likesCount: json['likes_count'] ?? 0,
      isLiked: json['is_liked'] ?? false,
      createdAt: json['created_at'] ?? '',
      author: json['user'] != null ? ForumAuthorModel.fromJson(json['user']) : null,
    );
  }
}
