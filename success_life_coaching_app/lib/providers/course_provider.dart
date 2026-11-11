import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:success_life_coaching_app/services/api_service.dart';
import 'package:success_life_coaching_app/services/storage_service.dart';
import 'package:success_life_coaching_app/models/course_model.dart';

class CourseProvider extends ChangeNotifier {
  final ApiService _apiService = ApiService();
  final StorageService _storage = StorageService();

  List<Course> _courses = [];
  Course? _selectedCourse;
  bool _isLoading = false;
  String? _error;
  String? _message;

  List<Course> get courses => _courses;
  Course? get selectedCourse => _selectedCourse;
  bool get isLoading => _isLoading;
  String? get error => _error;

  /// Last success message from the server (e.g. after enrolling).
  String? get message => _message;

  CourseProvider() {
    _loadFromCache();
  }

  void _loadFromCache() {
    try {
      final raw = _storage.getString('cached_courses_catalog');
      if (raw != null && raw.isNotEmpty) {
        final decoded = jsonDecode(raw) as List;
        _courses = decoded
            .map((c) => Course.fromJson(Map<String, dynamic>.from(c as Map)))
            .toList();
      }
    } catch (_) {}
  }

  Future<void> getCourses() async {
    // If no courses yet, try reading from cache first for 0ms instant display.
    if (_courses.isEmpty) {
      _loadFromCache();
    }

    _isLoading = _courses.isEmpty;
    _error = null;
    notifyListeners();

    try {
      final fetched = await _apiService.getCourses();
      _courses = fetched;
      // Update cache in the background
      try {
        _storage.setString(
          'cached_courses_catalog',
          jsonEncode(fetched.map((c) => c.toJson()).toList()),
        );
      } catch (_) {}
    } catch (e) {
      // If we already have courses from cache, don't show blocking error
      if (_courses.isEmpty) {
        _error = e.toString();
      }
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> getCourseDetail(String courseId) async {
    _isLoading = true;
    _error = null;
    // Keep showing the same course while it refreshes; clear only when switching.
    if ('${_selectedCourse?.id}' != courseId) _selectedCourse = null;
    notifyListeners();

    try {
      _selectedCourse = await _apiService.getCourseDetail(courseId);
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Free courses only. Returns true when enrolled.
  Future<bool> enrollCourse(String courseId) async {
    _error = null;
    try {
      _message = await _apiService.enrollCourse(courseId);
      await getCourseDetail(courseId);
      return true;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }
}
