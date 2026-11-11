import 'package:shared_preferences/shared_preferences.dart';

class ApiConfig {
  /// Base URL of the Laravel API.
  ///
  /// Default `10.0.2.2` is how the Android emulator reaches `127.0.0.1` on your PC
  /// (where `php artisan serve` runs). For a real phone or production, build with:
  ///   flutter run --dart-define=API_BASE_URL=https://your-domain.com/api
  static const String baseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://10.0.2.2:8000/api',
  );

  static const Duration timeout = Duration(seconds: 30);

  static late SharedPreferences _prefs;
  static String? _authToken;

  static Future<void> initialize() async {
    _prefs = await SharedPreferences.getInstance();
    _authToken = _prefs.getString('auth_token');
  }

  static Uri uri(String endpoint) => Uri.parse('$baseUrl$endpoint');

  /// Server origin, e.g. http://10.0.2.2:8000 (baseUrl without "/api").
  static Uri get _origin {
    final u = Uri.parse(baseUrl);
    return Uri(scheme: u.scheme, host: u.host, port: u.hasPort ? u.port : null);
  }

  /// Make a media link from Laravel usable on the device:
  /// - bare storage paths ("about/x.jpg") become {origin}/media/about/x.jpg
  /// - links built with APP_URL=127.0.0.1/localhost are pointed at [baseUrl]'s host.
  static String? mediaUrl(String? value) {
    if (value == null || value.trim().isEmpty) return null;
    final v = value.trim();
    final origin = _origin;

    if (!v.startsWith('http://') && !v.startsWith('https://')) {
      final path = v.startsWith('/') ? v : '/media/$v';
      return origin.replace(path: path).toString();
    }

    final u = Uri.parse(v);
    if (u.host == '127.0.0.1' || u.host == 'localhost') {
      return u
          .replace(scheme: origin.scheme, host: origin.host, port: origin.port)
          .toString();
    }
    return v;
  }

  static Map<String, String> getHeaders() {
    final headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (_authToken != null) {
      headers['Authorization'] = 'Bearer $_authToken';
    }
    return headers;
  }

  static void setAuthToken(String token) {
    _authToken = token;
    _prefs.setString('auth_token', token);
  }

  static void clearAuthToken() {
    _authToken = null;
    _prefs.remove('auth_token');
  }

  static String? getAuthToken() => _authToken;

  static bool isAuthenticated() => _authToken != null;

  // Endpoints (match routes/api.php in the Laravel app)
  static const String loginEndpoint = '/login';
  static const String registerEndpoint = '/register';
  static const String profileEndpoint = '/user';
  static const String logoutEndpoint = '/logout';
  static const String coursesEndpoint = '/courses';
  static const String seminarsEndpoint = '/seminars';
}
