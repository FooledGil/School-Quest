import '../core/constants/api_constants.dart';

class QuestModel {
  final int id;
  final String title;
  final String description;
  final String category;
  final int expReward;
  final String difficulty; // easy, medium, hard
  final String type; // main, additional
  final String? availableDate;
  final String? studentClass;
  final bool isActive;
  final bool completed;
  final String? submissionStatus; // pending, approved, rejected
  final String? rejectionReason;
  final String? submittedProofText;
  final String? submittedProofImage;

  QuestModel({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.expReward,
    required this.difficulty,
    required this.type,
    this.availableDate,
    this.studentClass,
    this.isActive = true,
    this.completed = false,
    this.submissionStatus,
    this.rejectionReason,
    this.submittedProofText,
    this.submittedProofImage,
  });

  bool get isPending => submissionStatus == 'pending';
  bool get isApproved => submissionStatus == 'approved';
  bool get isRejected => submissionStatus == 'rejected';

  String? get resolvedProofImageUrl {
    if (submittedProofImage == null || submittedProofImage!.isEmpty) return null;
    return ApiConstants.resolveImageUrl(submittedProofImage);
  }

  factory QuestModel.fromJson(Map<String, dynamic> json) {
    return QuestModel(
      id: json['id'] ?? 0,
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      category: json['category'] ?? 'Umum',
      expReward: json['exp_reward'] ?? 0,
      difficulty: json['difficulty'] ?? 'easy',
      type: json['type'] ?? 'main',
      availableDate: json['available_date'],
      studentClass: json['class'],
      isActive: json['is_active'] == 1 || json['is_active'] == true,
      completed: json['completed'] ?? false,
      submissionStatus: json['submission_status'],
      rejectionReason: json['rejection_reason'],
      submittedProofText: json['submitted_proof_text'],
      submittedProofImage: json['submitted_proof_image'],
    );
  }
}
