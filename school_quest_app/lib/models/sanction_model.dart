import '../core/constants/api_constants.dart';

class SanctionModel {
  final int id;
  final String type; // warning, mute, temp_ban, ban
  final String reason;
  final int? amount;
  final String? expiresAt;
  final bool isActive;
  final String? adminName;

  SanctionModel({
    required this.id,
    required this.type,
    required this.reason,
    this.amount,
    this.expiresAt,
    this.isActive = true,
    this.adminName,
  });

  factory SanctionModel.fromJson(Map<String, dynamic> json) {
    return SanctionModel(
      id: json['id'] ?? 0,
      type: json['type'] ?? 'warning',
      reason: json['reason'] ?? '',
      amount: json['amount'],
      expiresAt: json['expires_at'],
      isActive: json['is_active'] ?? true,
      adminName: json['admin_name'],
    );
  }
}

class ValidationSubmissionModel {
  final int id;
  final int? studentId;
  final String studentName;
  final String? studentNisn;
  final String? studentAvatar;
  final String? studentAvatarSeed;
  final int? questId;
  final String questTitle;
  final String questCategory;
  final String questDifficulty;
  final int expReward;
  final String? proofText;
  final String? proofImage;
  final String submittedAtHuman;

  ValidationSubmissionModel({
    required this.id,
    this.studentId,
    required this.studentName,
    this.studentNisn,
    this.studentAvatar,
    this.studentAvatarSeed,
    this.questId,
    required this.questTitle,
    required this.questCategory,
    required this.questDifficulty,
    required this.expReward,
    this.proofText,
    this.proofImage,
    required this.submittedAtHuman,
  });

  String get avatarDisplayUrl {
    if (studentAvatar != null && studentAvatar!.isNotEmpty) {
      return ApiConstants.resolveImageUrl(studentAvatar);
    }
    if (studentAvatarSeed != null && studentAvatarSeed!.isNotEmpty) {
      return ApiConstants.getDiceBearAvatar(studentAvatarSeed!);
    }
    return '';
  }

  String? get resolvedProofImageUrl {
    if (proofImage == null || proofImage!.isEmpty) return null;
    return ApiConstants.resolveImageUrl(proofImage);
  }

  factory ValidationSubmissionModel.fromJson(Map<String, dynamic> json) {
    return ValidationSubmissionModel(
      id: json['id'] ?? 0,
      studentId: json['student_id'],
      studentName: json['student_name'] ?? 'Siswa',
      studentNisn: json['student_nisn'],
      studentAvatar: json['student_avatar'],
      studentAvatarSeed: json['student_avatar_seed'],
      questId: json['quest_id'],
      questTitle: json['quest_title'] ?? 'Quest',
      questCategory: json['quest_category'] ?? 'Umum',
      questDifficulty: json['quest_difficulty'] ?? 'easy',
      expReward: json['exp_reward'] ?? 0,
      proofText: json['proof_text'],
      proofImage: json['proof_image'],
      submittedAtHuman: json['submitted_at_human'] ?? '',
    );
  }
}
