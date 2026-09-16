import '../core/constants/api_constants.dart';

class UserModel {
  final int id;
  final String name;
  final String? email;
  final String? nisn;
  final String role;
  final String? studentClass;
  final int level;
  final int exp;
  final int weeklyExp;
  final int streakDays;
  final String? avatar;
  final String? avatarSeed;
  final String rankName;
  final bool hasCompletedOnboarding;
  final bool isMuted;
  final String? mutedUntil;
  final String? muteRemainingHuman;
  final bool isBanned;

  // Level Progression Breakdown
  final int? nextLevelExp;
  final int? currentLevelBaseExp;
  final int? expInLevel;
  final int? expNeededInLevel;
  final double? expPercentage;
  final int? expRemaining;

  UserModel({
    required this.id,
    required this.name,
    this.email,
    this.nisn,
    required this.role,
    this.studentClass,
    required this.level,
    required this.exp,
    required this.weeklyExp,
    required this.streakDays,
    this.avatar,
    this.avatarSeed,
    required this.rankName,
    this.hasCompletedOnboarding = true,
    this.isMuted = false,
    this.mutedUntil,
    this.muteRemainingHuman,
    this.isBanned = false,
    this.nextLevelExp,
    this.currentLevelBaseExp,
    this.expInLevel,
    this.expNeededInLevel,
    this.expPercentage,
    this.expRemaining,
  });

  bool get isAdmin => role == 'admin';
  bool get isStudent => role == 'student';

  String get avatarDisplayUrl {
    if (avatar != null && avatar!.isNotEmpty) {
      return ApiConstants.resolveImageUrl(avatar);
    }
    if (avatarSeed != null && avatarSeed!.isNotEmpty) {
      return ApiConstants.getDiceBearAvatar(avatarSeed!);
    }
    return '';
  }

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      email: json['email'],
      nisn: json['nisn'],
      role: json['role'] ?? 'student',
      studentClass: json['class'],
      level: json['level'] ?? 1,
      exp: json['exp'] ?? 0,
      weeklyExp: json['weekly_exp'] ?? 0,
      streakDays: json['streak_days'] ?? 0,
      avatar: json['avatar'],
      avatarSeed: json['avatar_seed'],
      rankName: json['rank_name'] ?? 'Novice',
      hasCompletedOnboarding: json['has_completed_onboarding'] ?? true,
      isMuted: json['is_muted'] ?? false,
      mutedUntil: json['muted_until'],
      muteRemainingHuman: json['mute_remaining_human'],
      isBanned: json['is_banned'] ?? false,
      nextLevelExp: json['next_level_exp'],
      currentLevelBaseExp: json['current_level_base_exp'],
      expInLevel: json['exp_in_level'],
      expNeededInLevel: json['exp_needed_in_level'],
      expPercentage: json['exp_percentage'] != null
          ? (json['exp_percentage'] as num).toDouble()
          : null,
      expRemaining: json['exp_remaining'],
    );
  }
}
