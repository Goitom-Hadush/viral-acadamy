import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:success_life_coaching_app/services/api_service.dart';
import 'package:success_life_coaching_app/services/storage_service.dart';
import 'package:success_life_coaching_app/models/seminar_model.dart';

class SeminarProvider extends ChangeNotifier {
  final ApiService _apiService = ApiService();
  final StorageService _storage = StorageService();

  List<Seminar> _seminars = [];
  Seminar? _selectedSeminar;
  bool _isLoading = false;
  String? _error;
  String? _message;
  String? _registrationCode;

  List<Seminar> get seminars => _seminars;
  Seminar? get selectedSeminar => _selectedSeminar;
  bool get isLoading => _isLoading;
  String? get error => _error;
  String? get message => _message;
  String? get registrationCode => _registrationCode;

  SeminarProvider() {
    _loadFromCache();
  }

  void _loadFromCache() {
    try {
      final raw = _storage.getString('cached_seminars_list');
      if (raw != null && raw.isNotEmpty) {
        final decoded = jsonDecode(raw) as List;
        _seminars = decoded
            .map((s) => Seminar.fromJson(Map<String, dynamic>.from(s as Map)))
            .toList();
      }
    } catch (_) {}
  }

  Future<void> getSeminars() async {
    if (_seminars.isEmpty) {
      _loadFromCache();
    }

    _isLoading = _seminars.isEmpty;
    _error = null;
    notifyListeners();

    try {
      final fetched = await _apiService.getSeminars();
      _seminars = fetched;
      try {
        _storage.setString(
          'cached_seminars_list',
          jsonEncode(fetched.map((s) => s.toJson()).toList()),
        );
      } catch (_) {}
    } catch (e) {
      if (_seminars.isEmpty) {
        _error = e.toString();
      }
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> getSeminarDetail(String seminarId) async {
    _isLoading = true;
    _error = null;
    if ('${_selectedSeminar?.id}' != seminarId) _selectedSeminar = null;
    notifyListeners();

    try {
      _selectedSeminar = await _apiService.getSeminarDetail(seminarId);
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> registerSeminar(String seminarId) async {
    _error = null;
    try {
      final (message, code) = await _apiService.registerSeminar(seminarId);
      _message = message;
      _registrationCode = code;
      return true;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }
}
