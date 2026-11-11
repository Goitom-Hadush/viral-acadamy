// Models for the public website pages served by Api\ContentController.

String? _str(dynamic v) {
  if (v == null) return null;
  final s = v.toString().trim();
  return s.isEmpty ? null : s;
}

/// Shared header text of a ContentPage (about, testimonials, ...).
class PageInfo {
  final String? eyebrow;
  final String? headline;
  final String? intro;
  final String? bannerTitle;
  final String? bannerBody;
  final String? sectionTitle;
  final String? heroImage;
  final String? bannerImage;

  const PageInfo({
    this.eyebrow,
    this.headline,
    this.intro,
    this.bannerTitle,
    this.bannerBody,
    this.sectionTitle,
    this.heroImage,
    this.bannerImage,
  });

  factory PageInfo.fromJson(Map<String, dynamic>? json) {
    if (json == null) return const PageInfo();
    final heroImages = json['hero_images'];
    return PageInfo(
      eyebrow: _str(json['eyebrow']),
      headline: _str(json['headline']),
      intro: _str(json['intro']),
      bannerTitle: _str(json['banner_title']),
      bannerBody: _str(json['banner_body']),
      sectionTitle: _str(json['section_title']),
      heroImage: _str(json['hero_image_path']) ??
          (heroImages is List && heroImages.isNotEmpty
              ? _str(heroImages.first)
              : null),
      bannerImage: _str(json['banner_image_path']),
    );
  }
}

class AboutHighlight {
  final String title;
  final String body;
  final String? image;

  AboutHighlight({required this.title, required this.body, this.image});

  factory AboutHighlight.fromJson(Map<String, dynamic> json) => AboutHighlight(
        title: _str(json['title']) ?? '',
        body: _str(json['body']) ?? '',
        image: _str(json['image_path']),
      );
}

class AboutContent {
  final PageInfo page;
  final List<AboutHighlight> highlights;

  AboutContent({required this.page, required this.highlights});

  factory AboutContent.fromJson(Map<String, dynamic> json) => AboutContent(
        page: PageInfo.fromJson(json['page'] as Map<String, dynamic>?),
        highlights: ((json['highlights'] as List?) ?? [])
            .map((h) => AboutHighlight.fromJson(h as Map<String, dynamic>))
            .toList(),
      );
}

class Testimonial {
  final String name;
  final String? role;
  final String quote;

  Testimonial({required this.name, this.role, required this.quote});

  factory Testimonial.fromJson(Map<String, dynamic> json) => Testimonial(
        name: _str(json['name']) ?? '',
        role: _str(json['role']),
        quote: _str(json['quote']) ?? '',
      );

  /// "Sara K." -> "SK"
  String get initials {
    final parts = name.split(RegExp(r'\s+')).where((p) => p.isNotEmpty);
    return parts
        .take(2)
        .map((p) => String.fromCharCode(p.runes.first))
        .join()
        .toUpperCase();
  }
}

class TestimonialsContent {
  final PageInfo page;
  final List<Testimonial> testimonials;

  TestimonialsContent({required this.page, required this.testimonials});

  factory TestimonialsContent.fromJson(Map<String, dynamic> json) =>
      TestimonialsContent(
        page: PageInfo.fromJson(json['page'] as Map<String, dynamic>?),
        testimonials: ((json['testimonials'] as List?) ?? [])
            .map((t) => Testimonial.fromJson(t as Map<String, dynamic>))
            .toList(),
      );
}

class Reel {
  final int id;
  final String mediaType; // "video" or "image"
  final String? mediaUrl;
  final String? caption;
  final int? courseId;
  final String? courseTitle;
  final String? courseThumbnail;

  Reel({
    required this.id,
    required this.mediaType,
    this.mediaUrl,
    this.caption,
    this.courseId,
    this.courseTitle,
    this.courseThumbnail,
  });

  bool get isVideo => mediaType == 'video';

  factory Reel.fromJson(Map<String, dynamic> json) {
    final course = json['course'];
    return Reel(
      id: json['id'] is int ? json['id'] : int.tryParse('${json['id']}') ?? 0,
      mediaType: _str(json['media_type']) ?? 'video',
      mediaUrl: _str(json['media_url']),
      caption: _str(json['caption']),
      courseId:
          course is Map ? course['id'] as int? : json['course_id'] as int?,
      courseTitle: course is Map ? _str(course['title']) : null,
      courseThumbnail: course is Map ? _str(course['thumbnail']) : null,
    );
  }
}
