import '../../domain/entities/swap.dart';

class SwapModel extends SwapItem {
  const SwapModel({
    required super.id,
    required super.title,
    required super.status,
    super.startDate,
    super.dueDate,
    required super.postId,
    required super.borrowerId,
    required super.lenderId,
    required super.otherPartyName,
    super.otherPartyPhone,
    super.otherPartyAvatar,
    required super.isBorrower,
  });

  factory SwapModel.fromJson(Map<String, dynamic> json, {required bool isBorrower}) {
    DateTime? start;
    if (json['startDate'] != null) {
      start = DateTime.tryParse(json['startDate'].toString());
    }

    DateTime? due;
    if (json['dueDate'] != null) {
      due = DateTime.tryParse(json['dueDate'].toString());
    }

    // If current user is borrower, the other party is the lender, and vice-versa
    String otherName = 'أحد الجيران';
    String? otherPhone;
    String? otherAvatar;

    final partyObj = isBorrower ? json['lender'] : json['borrower'];
    if (partyObj is Map<String, dynamic>) {
      otherName = partyObj['name'] as String? ?? otherName;
      otherPhone = partyObj['phone'] as String?;
      otherAvatar = partyObj['avatar'] as String?;
    }

    return SwapModel(
      id: json['id'] as String? ?? '',
      title: json['title'] as String? ?? 'مبادلة / مساعدة',
      status: json['status'] as String? ?? 'pending',
      startDate: start,
      dueDate: due,
      postId: json['postId'] as String? ?? '',
      borrowerId: json['borrowerId'] as String? ?? '',
      lenderId: json['lenderId'] as String? ?? '',
      otherPartyName: otherName,
      otherPartyPhone: otherPhone,
      otherPartyAvatar: otherAvatar,
      isBorrower: isBorrower,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'status': status,
      'startDate': startDate?.toIso8601String(),
      'dueDate': dueDate?.toIso8601String(),
      'postId': postId,
      'borrowerId': borrowerId,
      'lenderId': lenderId,
      'isBorrower': isBorrower,
    };
  }
}
