import 'dart:io';
import 'package:flutter/material.dart';
import '../core/constants/api_constants.dart';
import '../core/network/api_client.dart';
import '../models/quest_model.dart';

class QuestsProvider extends ChangeNotifier {
  final ApiClient _apiClient = ApiClient();

  bool _isLoading = false;
  bool _isSubmitting = false;
  String? _errorMessage;
  String? _successMessage;

  List<QuestModel> _mainQuests = [];
  List<QuestModel> _additionalQuests = [];

  bool get isLoading => _isLoading;
  bool get isSubmitting => _isSubmitting;
  String? get errorMessage => _errorMessage;
  String? get successMessage => _successMessage;
  List<QuestModel> get mainQuests => _mainQuests;
  List<QuestModel> get additionalQuests => _additionalQuests;

  Future<void> fetchQuests() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiClient.get(ApiConstants.studentQuests);
      if (response['status'] == 'success') {
        final data = response['data'];
        _mainQuests = (data['main_quests'] as List? ?? [])
            .map((q) => QuestModel.fromJson(q))
            .toList();
        _additionalQuests = (data['additional_quests'] as List? ?? [])
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

  Future<bool> submitQuest(int questId, {String? proofText, File? proofImage}) async {
    _isSubmitting = true;
    _errorMessage = null;
    _successMessage = null;
    notifyListeners();

    try {
      final fields = <String, String>{};
      if (proofText != null && proofText.trim().isNotEmpty) {
        fields['proof_text'] = proofText.trim();
      }

      final response = await _apiClient.multipart(
        '/student/quests/$questId/complete',
        fields: fields,
        fileField: proofImage != null ? 'proof_image' : null,
        file: proofImage,
      );

      if (response['status'] == 'success') {
        _successMessage = response['message'] ?? 'Bukti pengerjaan berhasil dikirim!';
        await fetchQuests(); // Refresh list to reflect pending state
        return true;
      } else {
        _errorMessage = response['message'] ?? 'Pengiriman gagal.';
        return false;
      }
    } catch (e) {
      _errorMessage = e.toString();
      return false;
    } finally {
      _isSubmitting = false;
      notifyListeners();
    }
  }
}
