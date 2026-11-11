import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:success_life_coaching_app/config/api_config.dart';
import 'package:success_life_coaching_app/models/user_model.dart';
import 'package:success_life_coaching_app/models/course_model.dart';
import 'package:success_life_coaching_app/models/seminar_model.dart';
import 'package:success_life_coaching_app/models/content_models.dart';
import 'package:success_life_coaching_app/models/payment_info.dart';

/// Error with a user-friendly message taken from the Laravel response.
class ApiException implements Exception {
  final String message;
  final int? statusCode;

  ApiException(this.message, {this.statusCode});

  @override
  String toString() => message;
}

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  // ── Low-level helpers ──────────────────────────────────────────────────────

  Future<dynamic> _send(
    Future<http.Response> Function() request, {
    List<int> okStatuses = const [200, 201],
  }) async {
    http.Response response;
    try {
      response = await request().timeout(ApiConfig.timeout);
    } on SocketException {
      throw ApiException(
          'Cannot reach the server. Check your internet connection and try again.');
    } on TimeoutException {
      throw ApiException(
          'The server took too long to respond. Please try again.');
    } on http.ClientException {
      throw ApiException(
          'Cannot reach the server. Check your internet connection and try again.');
    }

    dynamic body;
    try {
      body = response.body.isEmpty ? null : jsonDecode(response.body);
    } catch (_) {
      body = null;
    }

    if (okStatuses.contains(response.statusCode)) {
      return body;
    }

    throw ApiException(_extractMessage(body, response.statusCode),
        statusCode: response.statusCode);
  }

  /// Laravel validation errors look like {message, errors: {field: [msg]}}.
  String _extractMessage(dynamic body, int status) {
    if (body is Map) {
      final errors = body['errors'];
      if (errors is Map && errors.isNotEmpty) {
        final first = errors.values.first;
        if (first is List && first.isNotEmpty) return first.first.toString();
      }
      final message = body['message'];
      if (message is String && message.isNotEmpty) return message;
    }
    if (status == 401) return 'Your session has expired. Please log in again.';
    if (status >= 500) return 'Server error. Please try again later.';
    return 'Something went wrong. Please try again.';
  }

  Future<dynamic> _get(String endpoint) => _send(
      () => http.get(ApiConfig.uri(endpoint), headers: ApiConfig.getHeaders()));

  Future<dynamic> _post(String endpoint, [Map<String, dynamic>? data]) => _send(
        () => http.post(
          ApiConfig.uri(endpoint),
          headers: ApiConfig.getHeaders(),
          body: jsonEncode(data ?? {}),
        ),
      );

  // ── Auth ───────────────────────────────────────────────────────────────────

  /// [login] can be an email address or a phone number.
  Future<User> login(String login, String password) async {
    final data = await _post(ApiConfig.loginEndpoint, {
      'email': login.trim(),
      'password': password,
    });
    ApiConfig.setAuthToken(data['token']);
    return User.fromJson(data['user']);
  }

  Future<User> register({
    required String name,
    required String phone,
    String? email,
    required String password,
  }) async {
    final data = await _post(ApiConfig.registerEndpoint, {
      'name': name.trim(),
      'phone': phone.trim(),
      if (email != null && email.trim().isNotEmpty) 'email': email.trim(),
      'password': password,
      'password_confirmation': password,
    });
    ApiConfig.setAuthToken(data['token']);
    return User.fromJson(data['user']);
  }

  Future<User> getProfile() async {
    final data = await _get(ApiConfig.profileEndpoint);
    return User.fromJson(data['data']);
  }

  Future<void> logout() async {
    try {
      await _post(ApiConfig.logoutEndpoint);
    } catch (_) {
      // Token may already be invalid; clear it locally either way.
    } finally {
      ApiConfig.clearAuthToken();
    }
  }

  // ── Courses ────────────────────────────────────────────────────────────────

  Future<List<Course>> getCourses() async {
    final data = await _get(ApiConfig.coursesEndpoint);
    return (data['data'] as List).map((c) => Course.fromJson(c)).toList();
  }

  Future<Course> getCourseDetail(String courseId) async {
    final data = await _get('${ApiConfig.coursesEndpoint}/$courseId');
    return Course.fromJson(data['data']);
  }

  /// Free courses enroll instantly. Paid courses return 402 with a payment message.
  Future<String> enrollCourse(String courseId) async {
    final data = await _post('${ApiConfig.coursesEndpoint}/$courseId/enroll');
    return (data?['message'] ?? 'Enrolled successfully.').toString();
  }

  /// Courses the logged-in student has purchased (GET /api/student/courses).
  Future<List<Course>> getMyCourses() async {
    final data = await _get('/student/courses');
    return ((data['data'] as List?) ?? [])
        .map((c) => Course.fromJson(Map<String, dynamic>.from(c as Map)))
        .toList();
  }

  // ── Payments (manual receipt, same flow as the website) ────────────────────

  Future<PaymentInfo>? _paymentInfo;

  /// Admin-managed bank / Telebirr accounts. Cached for the session.
  Future<PaymentInfo> getPaymentInfo() {
    return _paymentInfo ??= _get('/payment-info')
        .then((data) =>
            PaymentInfo.fromJson(Map<String, dynamic>.from(data as Map)))
        .catchError((Object e) {
      _paymentInfo = null; // allow retry
      throw e;
    });
  }

  Future<PaymentStatus> getPaymentStatus(int courseId) async {
    final data =
        await _get('${ApiConfig.coursesEndpoint}/$courseId/payment-status');
    return PaymentStatus(
        '${data['status'] ?? 'none'}', data['is_enrolled'] == true);
  }

  /// Upload a payment receipt photo (POST /api/courses/{id}/pay, multipart).
  Future<String> uploadReceipt(int courseId, File receipt) async {
    final request = http.MultipartRequest(
      'POST',
      ApiConfig.uri('${ApiConfig.coursesEndpoint}/$courseId/pay'),
    )
      ..headers.addAll(Map.of(ApiConfig.getHeaders())..remove('Content-Type'))
      ..files.add(await http.MultipartFile.fromPath('receipt', receipt.path));

    final data =
        await _send(() async => http.Response.fromStream(await request.send()));
    return (data?['message'] ??
            'Receipt uploaded. Waiting for admin verification.')
        .toString();
  }

  /// Save watch progress (POST /api/progress).
  Future<void> syncProgress(
      String lessonId, int seconds, bool completed) async {
    await _post('/progress', {
      'updates': [
        {
          'lessonId': lessonId,
          'progressSeconds': seconds,
          'completed': completed
        },
      ],
    });
  }

  // ── Website pages (public) ─────────────────────────────────────────────────

  Future<AboutContent> getAbout() async {
    final data = await _get('/content/about');
    return AboutContent.fromJson(data['data'] as Map<String, dynamic>);
  }

  Future<TestimonialsContent> getTestimonials() async {
    final data = await _get('/content/testimonials');
    return TestimonialsContent.fromJson(data['data'] as Map<String, dynamic>);
  }

  Future<List<Reel>> getReels() async {
    final data = await _get('/content/reels');
    return ((data['data'] as List?) ?? [])
        .map((r) => Reel.fromJson(r as Map<String, dynamic>))
        .toList();
  }

  // ── Seminars ───────────────────────────────────────────────────────────────

  Future<List<Seminar>> getSeminars() async {
    final data = await _get(ApiConfig.seminarsEndpoint);
    return (data['data'] as List).map((s) => Seminar.fromJson(s)).toList();
  }

  Future<Seminar> getSeminarDetail(String seminarId) async {
    final data = await _get('${ApiConfig.seminarsEndpoint}/$seminarId');
    return Seminar.fromJson(data['data']);
  }

  /// Returns (message, registration code).
  Future<(String, String?)> registerSeminar(String seminarId) async {
    final data =
        await _post('${ApiConfig.seminarsEndpoint}/$seminarId/register');
    return (
      (data?['message'] ?? 'Registered successfully.').toString(),
      data?['registration_code'] as String?,
    );
  }
}
