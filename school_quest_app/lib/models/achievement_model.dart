class AchievementModel {
  final int id;
  final String name;
  final String description;
  final String? badgeIcon;
  final int expReward;
  final bool isUnlocked;
  final String? unlockedAt;

  AchievementModel({
    required this.id,
    required this.name,
    required this.description,
    this.badgeIcon,
    this.expReward = 0,
    this.isUnlocked = false,
    this.unlockedAt,
  });

  factory AchievementModel.fromJson(Map<String, dynamic> json) {
    return AchievementModel(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      badgeIcon: json['badge_icon'],
      expReward: json['exp_reward'] ?? 0,
      isUnlocked: json['is_unlocked'] ?? false,
      unlockedAt: json['unlocked_at'],
    );
  }
}
