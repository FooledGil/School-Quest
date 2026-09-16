import '../core/constants/api_constants.dart';

class LeaderboardEntryModel {
  final int id;
  final String name;
  final String studentClass;
  final int level;
  final int exp;
  final int weeklyExp;
  final int rankNumber;
  final String rankName;
  final String? avatar;
  final String? avatarSeed;

  LeaderboardEntryModel({
    required this.id,
    required this.name,
    required this.studentClass,
    required this.level,
    required this.exp,
    required this.weeklyExp,
    required this.rankNumber,
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

  factory LeaderboardEntryModel.fromJson(Map<String, dynamic> json) {
    return LeaderboardEntryModel(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      studentClass: json['class'] ?? 'Siswa',
      level: json['level'] ?? 1,
      exp: json['exp'] ?? 0,
      weeklyExp: json['weekly_exp'] ?? 0,
      rankNumber: json['rank_number'] ?? 0,
      rankName: json['rank_name'] ?? 'Novice',
      avatar: json['avatar'],
      avatarSeed: json['avatar_seed'],
    );
  }
}

class MyRankModel {
  final int id;
  final String name;
  final String studentClass;
  final int level;
  final int exp;
  final int weeklyExp;
  final int overallRank;
  final int weeklyRank;
  final String? nextAheadName;
  final int nextAheadGap;
  final double catchUpMultiplier;
  final String catchUpTitle;

  MyRankModel({
    required this.id,
    required this.name,
    required this.studentClass,
    required this.level,
    required this.exp,
    required this.weeklyExp,
    required this.overallRank,
    required this.weeklyRank,
    this.nextAheadName,
    required this.nextAheadGap,
    required this.catchUpMultiplier,
    required this.catchUpTitle,
  });

  factory MyRankModel.fromJson(Map<String, dynamic> json) {
    final catchUp = json['catch_up'] ?? {};
    return MyRankModel(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      studentClass: json['class'] ?? 'Siswa',
      level: json['level'] ?? 1,
      exp: json['exp'] ?? 0,
      weeklyExp: json['weekly_exp'] ?? 0,
      overallRank: json['overall_rank'] ?? 1,
      weeklyRank: json['weekly_rank'] ?? 1,
      nextAheadName: json['next_ahead_name'],
      nextAheadGap: json['next_ahead_gap'] ?? 0,
      catchUpMultiplier: (catchUp['multiplier'] as num?)?.toDouble() ?? 1.0,
      catchUpTitle: catchUp['title'] ?? '',
    );
  }
}

class ResetInfoModel {
  final String nextResetAt;
  final String formattedSchedule;
  final int daysRemaining;
  final int hoursRemaining;
  final int totalSecondsRemaining;

  ResetInfoModel({
    required this.nextResetAt,
    required this.formattedSchedule,
    required this.daysRemaining,
    required this.hoursRemaining,
    required this.totalSecondsRemaining,
  });

  factory ResetInfoModel.fromJson(Map<String, dynamic> json) {
    return ResetInfoModel(
      nextResetAt: json['next_reset_at'] ?? '',
      formattedSchedule: json['formatted_schedule'] ?? 'Setiap Senin, 00:00 WIB',
      daysRemaining: json['days_remaining'] ?? 0,
      hoursRemaining: json['hours_remaining'] ?? 0,
      totalSecondsRemaining: json['total_seconds_remaining'] ?? 0,
    );
  }
}
