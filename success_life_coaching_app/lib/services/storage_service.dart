import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

class StorageService {
  static final StorageService _instance = StorageService._internal();
  late SharedPreferences _prefs;

  factory StorageService() {
    return _instance;
  }

  StorageService._internal();

  Future<void> initialize() async {
    _prefs = await SharedPreferences.getInstance();
  }

  // String operations
  Future<void> setString(String key, String value) async {
    await _prefs.setString(key, value);
  }

  String? getString(String key) {
    return _prefs.getString(key);
  }

  Future<void> removeString(String key) async {
    await _prefs.remove(key);
  }

  // Boolean operations
  Future<void> setBool(String key, bool value) async {
    await _prefs.setBool(key, value);
  }

  bool getBool(String key, {bool defaultValue = false}) {
    return _prefs.getBool(key) ?? defaultValue;
  }

  // Integer operations
  Future<void> setInt(String key, int value) async {
    await _prefs.setInt(key, value);
  }

  int getInt(String key, {int defaultValue = 0}) {
    return _prefs.getInt(key) ?? defaultValue;
  }

  // JSON operations
  Future<void> setJson(String key, Map<String, dynamic> json) async {
    await _prefs.setString(key, jsonEncode(json));
  }

  Map<String, dynamic>? getJson(String key) {
    final string = _prefs.getString(key);
    if (string == null) return null;
    try {
      return jsonDecode(string);
    } catch (e) {
      return null;
    }
  }

  // Cache management
  Future<void> clearCache() async {
    await _prefs.clear();
  }

  Future<void> removeKey(String key) async {
    await _prefs.remove(key);
  }

  // Check if key exists
  bool hasKey(String key) {
    return _prefs.containsKey(key);
  }

  // Get all keys
  Set<String> getAllKeys() {
    return _prefs.getKeys();
  }
}
