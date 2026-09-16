import 'package:flutter/material.dart';
import '../core/constants/api_constants.dart';
import '../core/network/api_client.dart';
import '../models/user_model.dart';

enum AuthStatus { initial, authenticating, authenticated, unauthenticated, error }

class AuthProvider extends ChangeNotifier {
  final ApiClient _apiClient = ApiClient();

  AuthStatus _status = AuthStatus.initial;
  UserModel? _user;
  String? _errorMessage;

  AuthStatus get status => _status;
  UserModel? get user => _user;
  String? get errorMessage => _errorMessage;
  bool get isAuthenticated => _status == AuthStatus.authenticated && _user != null;
  bool get isAdmin => _user?.isAdmin ?? false;
  bool get isStudent => _user?.isStudent ?? false;

  Future<void> checkAuth() async {
    _status = AuthStatus.authenticating;
    notifyListeners();

    await _apiClient.init();

    if (!_apiClient.isAuthenticated) {
      _status = AuthStatus.unauthenticated;
      notifyListeners();
      return;
    }

    try {
      final response = await _apiClient.get(ApiConstants.me);
      if (response['status'] == 'success' && response['user'] != null) {
        _user = UserModel.fromJson(response['user']);
        _status = AuthStatus.authenticated;
      } else {
        await _apiClient.setToken(null);
        _status = AuthStatus.unauthenticated;
      }
    } catch (e) {
      await _apiClient.setToken(null);
      _status = AuthStatus.unauthenticated;
    }

    notifyListeners();
  }

  Future<bool> login(String loginInput, String password) async {
    _status = AuthStatus.authenticating;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiClient.post(ApiConstants.login, body: {
        'login': loginInput.trim(),
        'password': password,
      });

      if (response['status'] == 'success') {
        final token = response['token'];
        await _apiClient.setToken(token);

        _user = UserModel.fromJson(response['user']);
        _status = AuthStatus.authenticated;
        notifyListeners();
        return true;
      } else {
        _errorMessage = response['message'] ?? 'Login gagal.';
        _status = AuthStatus.error;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _errorMessage = e.toString();
      _status = AuthStatus.error;
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    try {
      await _apiClient.post(ApiConstants.logout);
    } catch (_) {}
    await _apiClient.setToken(null);
    _user = null;
    _status = AuthStatus.unauthenticated;
    notifyListeners();
  }

  void updateUser(UserModel updatedUser) {
    _user = updatedUser;
    notifyListeners();
  }
}
