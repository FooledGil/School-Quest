import 'package:flutter/material.dart';
import '../core/constants/api_constants.dart';
import '../core/network/api_client.dart';
import '../models/community_model.dart';

class CommunityProvider extends ChangeNotifier {
  final ApiClient _apiClient = ApiClient();

  bool _isLoading = false;
  bool _isDetailLoading = false;
  String? _errorMessage;

  String _selectedCategory = 'all';
  String _selectedSort = 'latest';
  String _searchQuery = '';

  List<ForumThreadModel> _threads = [];
  Map<String, dynamic> _categoryCounts = {};
  List<dynamic> _topMembers = [];
  bool _isMuted = false;
  String? _muteRemaining;

  ForumThreadModel? _currentThread;
  List<ForumReplyModel> _currentReplies = [];

  bool get isLoading => _isLoading;
  bool get isDetailLoading => _isDetailLoading;
  String? get errorMessage => _errorMessage;
  String get selectedCategory => _selectedCategory;
  String get selectedSort => _selectedSort;
  String get searchQuery => _searchQuery;

  List<ForumThreadModel> get threads => _threads;
  Map<String, dynamic> get categoryCounts => _categoryCounts;
  List<dynamic> get topMembers => _topMembers;
  bool get isMuted => _isMuted;
  String? get muteRemaining => _muteRemaining;

  ForumThreadModel? get currentThread => _currentThread;
  List<ForumReplyModel> get currentReplies => _currentReplies;

  void setCategory(String cat) {
    _selectedCategory = cat;
    fetchThreads();
  }

  void setSort(String sort) {
    _selectedSort = sort;
    fetchThreads();
  }

  void setSearch(String query) {
    _searchQuery = query;
    fetchThreads();
  }

  Future<void> fetchThreads() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final endpoint = '${ApiConstants.studentCommunity}?category=$_selectedCategory&sort=$_selectedSort&search=${Uri.encodeComponent(_searchQuery)}';
      final response = await _apiClient.get(endpoint);

      if (response['status'] == 'success') {
        final data = response['data'];
        final threadsJson = data['threads']['data'] as List? ?? [];
        _threads = threadsJson.map((t) => ForumThreadModel.fromJson(t)).toList();
        _categoryCounts = data['category_counts'] ?? {};
        _topMembers = data['top_members'] ?? [];
        _isMuted = data['is_muted'] ?? false;
        _muteRemaining = data['mute_remaining'];
      }
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchThreadDetail(int threadId) async {
    _isDetailLoading = true;
    _currentThread = null;
    _currentReplies = [];
    notifyListeners();

    try {
      final response = await _apiClient.get('${ApiConstants.studentCommunity}/$threadId');
      if (response['status'] == 'success') {
        final data = response['data'];
        _currentThread = ForumThreadModel.fromJson(data['thread']);
        _currentReplies = (data['replies'] as List? ?? [])
            .map((r) => ForumReplyModel.fromJson(r))
            .toList();
      }
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isDetailLoading = false;
      notifyListeners();
    }
  }

  Future<bool> createThread(String title, String category, String body) async {
    try {
      final response = await _apiClient.post(ApiConstants.studentCommunity, body: {
        'title': title,
        'category': category,
        'body': body,
      });

      if (response['status'] == 'success') {
        await fetchThreads();
        return true;
      }
      return false;
    } catch (e) {
      _errorMessage = e.toString();
      notifyListeners();
      return false;
    }
  }

  Future<bool> replyThread(int threadId, String body, {int? parentId}) async {
    try {
      final response = await _apiClient.post('${ApiConstants.studentCommunity}/$threadId/reply', body: {
        'body': body,
        'parent_id': parentId,
      });

      if (response['status'] == 'success') {
        await fetchThreadDetail(threadId);
        return true;
      }
      return false;
    } catch (e) {
      _errorMessage = e.toString();
      notifyListeners();
      return false;
    }
  }

  Future<void> toggleLike(String type, int id) async {
    try {
      final response = await _apiClient.post('${ApiConstants.studentCommunity}/like', body: {
        'type': type,
        'id': id,
      });

      if (response['status'] == 'success') {
        final isLiked = response['data']['is_liked'] as bool;
        final count = response['data']['likes_count'] as int;

        if (type == 'thread') {
          if (_currentThread != null && _currentThread!.id == id) {
            _currentThread!.isLiked = isLiked;
            _currentThread!.likesCount = count;
          }
          final idx = _threads.indexWhere((t) => t.id == id);
          if (idx != -1) {
            _threads[idx].isLiked = isLiked;
            _threads[idx].likesCount = count;
          }
        } else {
          for (var r in _currentReplies) {
            if (r.id == id) {
              r.isLiked = isLiked;
            }
            for (var child in r.replies) {
              if (child.id == id) {
                child.isLiked = isLiked;
              }
            }
          }
        }
        notifyListeners();
      }
    } catch (_) {}
  }

  Future<bool> reportContent(String type, int id, String reason, {String? details}) async {
    try {
      final response = await _apiClient.post('${ApiConstants.studentCommunity}/report', body: {
        'type': type,
        'id': id,
        'reason': reason,
        'details': details,
      });
      return response['status'] == 'success';
    } catch (_) {
      return false;
    }
  }
}
