import 'package:flutter/material.dart';
import 'package:success_life_coaching_app/services/api_service.dart';
import 'package:success_life_coaching_app/models/user_model.dart';
import 'package:success_life_coaching_app/config/api_config.dart';

class AuthProvider extends ChangeNotifier {
  final ApiService _apiService = ApiService();

  User? _user;
  bool _isLoading = false;
  String? _error;
  bool _isInitialized = false;

  User? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isLoggedIn => _user != null && ApiConfig.isAuthenticated();
  bool get isInitialized => _isInitialized;

  AuthProvider() {
    _initialize();
  }

  /// Restore a saved session on app start.
  Future<void> _initialize() async {
    if (ApiConfig.isAuthenticated()) {
      try {
        _user = await _apiService.getProfile();
      } on ApiException catch (e) {
        // Only drop the token if the server rejected it (not on network errors).
        if (e.statusCode == 401) ApiConfig.clearAuthToken();
      }
    }
    _isInitialized = true;
    notifyListeners();
  }

  Future<void> login(String login, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _user = await _apiService.login(login, password);
    } catch (e) {
      _error = e.toString();
      _user = null;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> register({
    required String name,
    required String phone,
    String? email,
    required String password,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _user = await _apiService.register(
        name: name,
        phone: phone,
        email: email,
        password: password,
      );
    } catch (e) {
      _error = e.toString();
      _user = null;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    await _apiService.logout();
    _user = null;
    _error = null;
    notifyListeners();
  }

  Future<void> refreshProfile() async {
    if (!isLoggedIn) return;
    try {
      _user = await _apiService.getProfile();
    } catch (_) {
      // Keep the cached user if refresh fails.
    }
    notifyListeners();
  }

  void clearError() {
    if (_error == null) return;
    _error = null;
    notifyListeners();
  }
}
