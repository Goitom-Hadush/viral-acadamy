/// Laravel returns decimals as strings (e.g. "1500.00"); accept both.
double _toDouble(dynamic v) {
  if (v == null) return 0;
  if (v is num) return v.toDouble();
  return double.tryParse(v.toString()) ?? 0;
}

int _toInt(dynamic v) {
  if (v == null) return 0;
  if (v is int) return v;
  return int.tryParse(v.toString()) ?? 0;
}

class Lesson {
  final String id;
  final String title;
  final String? streamUrl; // only for enrolled students
  final int? durationSeconds;
  final int progressSeconds;
  final bool isCompleted;

  Lesson({
    required this.id,
    required this.title,
    this.streamUrl,
    this.durationSeconds,
    this.progressSeconds = 0,
    this.isCompleted = false,
  });

  factory Lesson.fromJson(Map<String, dynamic> json) => Lesson(
        id: '${json['id']}',
        title: (json['title'] ?? '').toString(),
        streamUrl: json['remoteUrl'] as String?,
        durationSeconds:
            json['duration'] == null ? null : _toInt(json['duration']),
        progressSeconds: _toInt(json['progressSeconds']),
        isCompleted: json['isCompleted'] == true,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'remoteUrl': streamUrl,
        'duration': durationSeconds,
        'progressSeconds': progressSeconds,
        'isCompleted': isCompleted,
      };

  /// "12:05" style duration.
  String? get durationLabel {
    final d = durationSeconds;
    if (d == null || d <= 0) return null;
    final m = d ~/ 60;
    final s = d % 60;
    return '$m:${s.toString().padLeft(2, '0')}';
  }
}

class Course {
  final int id;
  final String title;
  final String description;
  final String? thumbnail;
  final int? categoryId;
  final String? category;
  final double price;
  final String? instructorName;
  final int lessonsCount;
  final int reviewsCount;
  final double rating;
  final bool isPurchased;
  final bool hasPendingPayment;
  final List<Lesson> lessons;

  Course({
    required this.id,
    required this.title,
    required this.description,
    this.thumbnail,
    this.categoryId,
    this.category,
    required this.price,
    this.instructorName,
    this.lessonsCount = 0,
    this.reviewsCount = 0,
    this.rating = 0,
    this.isPurchased = false,
    this.hasPendingPayment = false,
    this.lessons = const [],
  });

  factory Course.fromJson(Map<String, dynamic> json) {
    final instructor = json['instructor'];
    final category = json['category'];
    return Course(
      id: _toInt(json['id']),
      title: (json['title'] ?? '').toString(),
      description: (json['description'] ?? '').toString(),
      thumbnail: json['thumbnail'] as String?,
      categoryId: category is Map
          ? _toInt(category['id'])
          : (json['category_id'] == null ? null : _toInt(json['category_id'])),
      category: category is Map ? category['name']?.toString() : null,
      price: _toDouble(json['price']),
      instructorName: instructor is Map ? instructor['name']?.toString() : null,
      lessonsCount: _toInt(json['videos_count']),
      reviewsCount: _toInt(json['reviews_count']),
      rating: _toDouble(json['rating']),
      isPurchased: json['is_purchased'] == true,
      hasPendingPayment: json['has_pending_payment'] == true,
      lessons: ((json['lessons'] as List?) ?? [])
          .map((l) => Lesson.fromJson(Map<String, dynamic>.from(l as Map)))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'description': description,
        'thumbnail': thumbnail,
        'category_id': categoryId,
        'category': category != null ? {'id': categoryId, 'name': category} : null,
        'price': price,
        'instructor': instructorName != null ? {'name': instructorName} : null,
        'videos_count': lessonsCount,
        'reviews_count': reviewsCount,
        'rating': rating,
        'is_purchased': isPurchased,
        'has_pending_payment': hasPendingPayment,
        'lessons': lessons.map((l) => l.toJson()).toList(),
      };

  bool get isFree => price <= 0;

  /// Progress calculations for student dashboard & learning
  int get completedLessonsCount => lessons.where((l) => l.isCompleted).length;
  double get progressPercentage =>
      lessonsCount > 0 ? (completedLessonsCount / lessonsCount).clamp(0.0, 1.0) : 0.0;
  int get progressPercentInt => (progressPercentage * 100).round();
}
