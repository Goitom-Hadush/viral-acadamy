/// Admin-managed payment accounts (GET /api/payment-info, same as the website).
class PaymentInfo {
  final String bankName;
  final String bankNumber;
  final String bankOwner;
  final String telebirrPhone;
  final String telebirrName;
  final String? instructions;

  const PaymentInfo({
    required this.bankName,
    required this.bankNumber,
    required this.bankOwner,
    required this.telebirrPhone,
    required this.telebirrName,
    this.instructions,
  });

  factory PaymentInfo.fromJson(Map<String, dynamic> json) {
    final accounts = (json['accounts'] as List?) ?? const [];
    Map<String, dynamic> at(int i) =>
        i < accounts.length ? Map<String, dynamic>.from(accounts[i] as Map) : const {};
    final bank = at(0);
    final tele = at(1);
    return PaymentInfo(
      bankName: '${bank['bank'] ?? 'Commercial Bank of Ethiopia (CBE)'}',
      bankNumber: '${bank['account_number'] ?? ''}',
      bankOwner: '${bank['account_name'] ?? ''}',
      telebirrPhone: '${tele['account_number'] ?? ''}',
      telebirrName: '${tele['account_name'] ?? ''}',
      instructions: json['instructions'] as String?,
    );
  }
}

/// GET /api/courses/{id}/payment-status
class PaymentStatus {
  final String status; // none | pending | success | failed
  final bool isEnrolled;
  const PaymentStatus(this.status, this.isEnrolled);
}
