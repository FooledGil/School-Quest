import 'package:flutter/material.dart';
import '../core/constants/api_constants.dart';
import '../core/network/api_client.dart';
import '../models/leaderboard_model.dart';

enum LeaderboardTab { weekly, overall }

class LeaderboardProvider extends ChangeNotifier {
  final ApiClient _apiClient = ApiClient();

  bool _isLoading = false;
  String? _errorMessage;
  LeaderboardTab _activeTab = LeaderboardTab.weekly;

  List<LeaderboardEntryModel> _overallStudents = [];
  List<LeaderboardEntryModel> _weeklyStudents = [];
  MyRankModel? _myRank;
  ResetInfoModel? _resetInfo;

  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  LeaderboardTab get activeTab => _activeTab;
  List<LeaderboardEntryModel> get overallStudents => _overallStudents;
  List<LeaderboardEntryModel> get weeklyStudents => _weeklyStudents;
  List<LeaderboardEntryModel> get currentStudents =>
      _activeTab == LeaderboardTab.weekly ? _weeklyStudents : _overallStudents;
  MyRankModel? get myRank => _myRank;
  ResetInfoModel? get resetInfo => _resetInfo;

  void setTab(LeaderboardTab tab) {
    _activeTab = tab;
    notifyListeners();
  }

  Future<void> fetchLeaderboard() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiClient.get(ApiConstants.studentLeaderboard);
      if (response['status'] == 'success') {
        final data = response['data'];

        _overallStudents = (data['overall_students'] as List? ?? [])
            .map((s) => LeaderboardEntryModel.fromJson(s))
            .toList();

        _weeklyStudents = (data['weekly_students'] as List? ?? [])
            .map((s) => LeaderboardEntryModel.fromJson(s))
            .toList();

        if (data['my_rank'] != null) {
          _myRank = MyRankModel.fromJson(data['my_rank']);
        } else {
          _myRank = null;
        }

        if (data['reset_info'] != null) {
          _resetInfo = ResetInfoModel.fromJson(data['reset_info']);
        } else {
          _resetInfo = null;
        }
      }
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
