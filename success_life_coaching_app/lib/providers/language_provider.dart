import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Holds the selected app language (en, am, ti) and remembers it on the device.
class LanguageProvider extends ChangeNotifier {
  static const _prefsKey = 'language_code';
  static const supportedCodes = ['ti', 'am', 'en'];

  String _languageCode = 'en';

  String get languageCode => _languageCode;

  LanguageProvider() {
    _load();
  }

  Future<void> _load() async {
    final prefs = await SharedPreferences.getInstance();
    final saved = prefs.getString(_prefsKey);
    if (saved != null &&
        supportedCodes.contains(saved) &&
        saved != _languageCode) {
      _languageCode = saved;
      notifyListeners();
    }
  }

  Future<void> setLanguage(String code) async {
    if (!supportedCodes.contains(code) || code == _languageCode) return;
    _languageCode = code;
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_prefsKey, code);
  }
}
