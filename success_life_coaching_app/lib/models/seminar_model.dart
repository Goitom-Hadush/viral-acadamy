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

String? _str(dynamic v) {
  if (v == null) return null;
  final s = v.toString().trim();
  return s.isEmpty ? null : s;
}

class Seminar {
  final int id;
  final String title;
  final String? tagline;
  final String description;
  final String? image;
  final String? badge;
  final String? speakerName;
  final String? speakerTitle;
  final String? speakerInitials;
  final String? dateString;
  final String? timeString;
  final String? venueName;
  final String? venueCity;
  final String? locationType; // in_person | virtual | hybrid
  final String? onlineLink;
  final String? priceLabelText;
  final double entranceFee;
  final int capacity;
  final int registeredCount;
  final List<String> topics;

  Seminar({
    required this.id,
    required this.title,
    this.tagline,
    required this.description,
    this.image,
    this.badge,
    this.speakerName,
    this.speakerTitle,
    this.speakerInitials,
    this.dateString,
    this.timeString,
    this.venueName,
    this.venueCity,
    this.locationType,
    this.onlineLink,
    this.priceLabelText,
    this.entranceFee = 0,
    this.capacity = 0,
    this.registeredCount = 0,
    this.topics = const [],
  });

  factory Seminar.fromJson(Map<String, dynamic> json) {
    return Seminar(
      id: _toInt(json['id']),
      title: (json['title'] ?? '').toString(),
      tagline: _str(json['tagline']),
      description: (json['description'] ?? '').toString(),
      image: _str(json['image']),
      badge: _str(json['badge']),
      speakerName: _str(json['speaker_name']),
      speakerTitle: _str(json['speaker_title']),
      speakerInitials: _str(json['speaker_initials']),
      dateString: _str(json['date_string']),
      timeString: _str(json['time_string']),
      venueName: _str(json['venue_name']),
      venueCity: _str(json['venue_city']),
      locationType: _str(json['location_type']),
      onlineLink: _str(json['online_link']),
      priceLabelText: _str(json['price_label']),
      entranceFee: _toDouble(json['entrance_fee']),
      capacity: _toInt(json['capacity']),
      registeredCount: _toInt(json['registered_count']),
      topics: ((json['topics'] as List?) ?? []).map((t) => '$t').toList(),
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'tagline': tagline,
        'description': description,
        'image': image,
        'badge': badge,
        'speaker_name': speakerName,
        'speaker_title': speakerTitle,
        'speaker_initials': speakerInitials,
        'date_string': dateString,
        'time_string': timeString,
        'venue_name': venueName,
        'venue_city': venueCity,
        'location_type': locationType,
        'online_link': onlineLink,
        'price_label': priceLabelText,
        'entrance_fee': entranceFee,
        'capacity': capacity,
        'registered_count': registeredCount,
        'topics': topics,
      };

  bool get isFree => entranceFee <= 0;
  bool get isVirtual => locationType == 'virtual';
  bool get isHybrid => locationType == 'hybrid';

  /// "Dec 12, 2026 • 9:00 AM" (free text entered by the admin).
  String get dateLabel {
    final parts = [dateString, timeString].whereType<String>().toList();
    return parts.isEmpty ? 'Date to be announced' : parts.join(' • ');
  }

  String get location {
    if (isVirtual) return venueName ?? 'Virtual Live Stream';
    final parts = [venueName, venueCity].whereType<String>().toList();
    return parts.isEmpty ? 'TBA' : parts.join(', ');
  }

  /// Same rules as Seminars.jsx `displayPrice`.
  String get priceLabel {
    if (isFree) {
      final l = priceLabelText?.toLowerCase() ?? '';
      if (priceLabelText != null &&
          !l.contains('etb 0') &&
          !l.contains('0 etb')) return priceLabelText!;
      return 'Free';
    }
    return priceLabelText ?? 'ETB ${entranceFee.toStringAsFixed(0)}';
  }

  /// capacity 0 means unlimited.
  bool get hasCapacity => capacity > 0;
  int get availableSeats =>
      hasCapacity ? (capacity - registeredCount).clamp(0, capacity) : 0;
  bool get isFull => hasCapacity && registeredCount >= capacity;
  double get fill =>
      hasCapacity ? (registeredCount / capacity).clamp(0, 1).toDouble() : 0;
}
