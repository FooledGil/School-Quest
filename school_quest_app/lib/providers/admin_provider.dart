import 'package:flutter/material.dart';
import '../core/constants/api_constants.dart';
import '../core/network/api_client.dart';
import '../models/quest_model.dart';
import '../models/sanction_model.dart';

class AdminProvider extends ChangeNotifier {
  final ApiClient _apiClient = ApiClient();

  bool _isLoading = false;
  String? _errorMessage;
  String? _successMessage;

  // Dashboard state
  Map<String, dynamic>? _stats;
  List<dynamic> _topPerformers = [];
  List<dynamic> _recentCompletions = [];

  // Validations state
  List<ValidationSubmissionModel> _pendingSubmissions = [];
  List<dynamic> _validationHistory = [];

  // Quests state
  List<QuestModel> _adminQuests = [];

  // Moderation state
  List<dynamic> _reports = [];
  List<dynamic> _threads = [];
  List<dynamic> _sanctions = [];

  // Students state
  List<dynamic> _students = [];
  Map<String, dynamic>? _selectedStudentDetail;

  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  String? get successMessage => _successMessage;

  Map<String, dynamic>? get stats => _stats;
  List<dynamic> get topPerformers => _topPerformers;
  List<dynamic> get recentCompletions => _recentCompletions;

  List<ValidationSubmissionModel> get pendingSubmissions => _pendingSubmissions;
  List<dynamic> get validationHistory => _validationHistory;

  List<QuestModel> get adminQuests => _adminQuests;
  List<dynamic> get reports => _reports;
  List<dynamic> get threads => _threads;
  List<dynamic> get sanctions => _sanctions;

  List<dynamic> get students => _students;
  Map<String, dynamic>? get selectedStudentDetail => _selectedStudentDetail;

  Future<void> fetchDashboard() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiClient.get(ApiConstants.adminDashboard);
      if (response['status'] == 'success') {
        final data = response['data'];
        _stats = data['stats'];
        _topPerformers = data['top_performers'] ?? [];
        _recentCompletions = data['recent_completions'] ?? [];
      }
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchValidations() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiClient.get(ApiConstants.adminValidations);
      if (response['status'] == 'success') {
        final data = response['data'];
        _pendingSubmissions = (data['submissions'] as List? ?? [])
            .map((s) => ValidationSubmissionModel.fromJson(s))
            .toList();
        _validationHistory = data['history'] ?? [];
      }
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> approveValidation(int completionId) async {
    try {
      final response = await _apiClient.post('/admin/validations/$completionId/approve');
      if (response['status'] == 'success') {
        _successMessage = response['message'];
        await fetchValidations();
        return true;
      }
      return false;
    } catch (e) {
      _errorMessage = e.toString();
      notifyListeners();
      return false;
    }
  }

  Future<bool> rejectValidation(int completionId, String reason) async {
    try {
      final response = await _apiClient.post('/admin/validations/$completionId/reject', body: {
        'rejection_reason': reason,
      });
      if (response['status'] == 'success') {
        _successMessage = response['message'];
        await fetchValidations();
        return true;
      }
      return false;
    } catch (e) {
      _errorMessage = e.toString();
      notifyListeners();
      return false;
    }
  }

  Future<void> fetchAdminQuests() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiClient.get(ApiConstants.adminQuests);
      if (response['status'] == 'success') {
        _adminQuests = (response['data'] as List? ?? [])
            .map((q) => QuestModel.fromJson(q))
            .toList();
      }
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> createQuest(Map<String, dynamic> data) async {
    try {
      final response = await _apiClient.post(ApiConstants.adminQuests, body: data);
      if (response['status'] == 'success') {
        await fetchAdminQuests();
        return true;
      }
      return false;
    } catch (e) {
      _errorMessage = e.toString();
      notifyListeners();
      return false;
    }
  }

  Future<bool> deleteQuest(int questId) async {
    try {
      final response = await _apiClient.delete('/admin/quests/$questId');
      if (response['status'] == 'success') {
        await fetchAdminQuests();
        return true;
      }
      return false;
    } catch (e) {
      _errorMessage = e.toString();
      notifyListeners();
      return false;
    }
  }

  Future<void> fetchModeration({String? reportStatus}) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final endpoint = '${ApiConstants.adminCommunity}?report_status=${reportStatus ?? 'pending'}';
      final response = await _apiClient.get(endpoint);
      if (response['status'] == 'success') {
        final data = response['data'];
        _reports = data['reports'] ?? [];
        _threads = data['threads']['data'] ?? [];
        _sanctions = data['sanctions'] ?? [];
      }
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> resolveReport(int reportId, String action, {String? note}) async {
    try {
      final response = await _apiClient.post('/admin/community/report/$reportId/resolve', body: {
        'action': action,
        'action_taken': note,
      });
      if (response['status'] == 'success') {
        await fetchModeration();
        return true;
      }
      return false;
    } catch (e) {
      _errorMessage = e.toString();
      notifyListeners();
      return false;
    }
  }

  Future<bool> punishStudent(int userId, String type, String reason, {int? amount}) async {
    try {
      final response = await _apiClient.post('/admin/students/$userId/punish', body: {
        'type': type,
        'reason': reason,
        'amount': amount,
      });
      return response['status'] == 'success';
    } catch (e) {
      _errorMessage = e.toString();
      notifyListeners();
      return false;
    }
  }

  Future<void> fetchStudents({String? search, String? studentClass}) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final endpoint = '${ApiConstants.adminStudents}?search=${Uri.encodeComponent(search ?? '')}&class=${studentClass ?? 'all'}';
      final response = await _apiClient.get(endpoint);
      if (response['status'] == 'success') {
        _students = response['data'] ?? [];
      }
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchStudentDetail(int studentId) async {
    _isLoading = true;
    _selectedStudentDetail = null;
    notifyListeners();

    try {
      final response = await _apiClient.get('${ApiConstants.adminStudents}/$studentId');
      if (response['status'] == 'success') {
        _selectedStudentDetail = response['data'];
      }
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
