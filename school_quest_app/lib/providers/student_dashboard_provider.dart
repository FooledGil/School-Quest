import 'package:flutter/material.dart';
import '../core/constants/api_constants.dart';
import '../core/network/api_client.dart';
import '../models/achievement_model.dart';
import '../models/quest_model.dart';
import '../models/schedule_model.dart';
import '../models/user_model.dart';

class StudentDashboardProvider extends ChangeNotifier {
  final ApiClient _apiClient = ApiClient();

  bool _isLoading = false;
  String? _errorMessage;

  UserModel? _user;
  Map<String, dynamic>? _stats;
  List<ScheduleModel> _schedules = [];
  PiketScheduleModel? _piket;
  List<QuestModel> _recentQuests = [];
  List<AchievementModel> _achievements = [];
  Map<String, dynamic>? _activeSanction;

  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  UserModel? get user => _user;
  Map<String, dynamic>? get stats => _stats;
  List<ScheduleModel> get schedules => _schedules;
  PiketScheduleModel? get piket => _piket;
  List<QuestModel> get recentQuests => _recentQuests;
  List<AchievementModel> get achievements => _achievements;
  Map<String, dynamic>? get activeSanction => _activeSanction;

  Future<void> fetchDashboard() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiClient.get(ApiConstants.studentDashboard);
      if (response['status'] == 'success') {
        final data = response['data'];

        if (data['user'] != null) {
          _user = UserModel.fromJson(data['user']);
        }
        _stats = data['stats'];

        _schedules = (data['schedules'] as List? ?? [])
            .map((s) => ScheduleModel.fromJson(s))
            .toList();

        if (data['piket'] != null) {
          _piket = PiketScheduleModel.fromJson(data['piket']);
        } else {
          _piket = null;
        }

        _recentQuests = (data['recent_quests'] as List? ?? [])
            .map((q) => QuestModel.fromJson(q))
            .toList();

        _achievements = (data['achievements'] as List? ?? [])
            .map((a) => AchievementModel.fromJson(a))
            .toList();

        _activeSanction = data['active_sanction'];
      }
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> acknowledgeSanction(int sanctionId) async {
    try {
      await _apiClient.post('/student/sanctions/$sanctionId/acknowledge');
      _activeSanction = null;
      notifyListeners();
      return true;
    } catch (_) {
      return false;
    }
  }
}

class PiketScheduleModel {
  final int id;
  final String studentClass;
  final int dayOfWeek;
  final List<PiketMemberModel> members;

  PiketScheduleModel({
    required this.id,
    required this.studentClass,
    required this.dayOfWeek,
    required this.members,
  });

  factory PiketScheduleModel.fromJson(Map<String, dynamic> json) {
    return PiketScheduleModel(
      id: json['id'] ?? 0,
      studentClass: json['class'] ?? '',
      dayOfWeek: json['day_of_week'] ?? 1,
      members: (json['members'] as List? ?? [])
          .map((m) => PiketMemberModel.fromJson(m))
          .toList(),
    );
  }
}
