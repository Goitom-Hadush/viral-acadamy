class User {
  final int id;
  final String name;
  final String? email;
  final String? phone;
  final String? role;
  final String? avatar;
  final String? referralCode;

  User({
    required this.id,
    required this.name,
    this.email,
    this.phone,
    this.role,
    this.avatar,
    this.referralCode,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] is int ? json['id'] : int.tryParse('${json['id']}') ?? 0,
      name: (json['name'] ?? '').toString(),
      email: json['email'] as String?,
      phone: json['phone'] as String?,
      role: json['role'] as String?,
      avatar: json['avatar'] as String?,
      referralCode: json['referral_code'] as String?,
    );
  }

  String get firstName {
    final parts = name.trim().split(RegExp(r'\s+'));
    return parts.isEmpty ? name : parts.first;
  }
}
