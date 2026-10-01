class SwapItem {
  final String id;
  final String title;
  final String status; // 'pending', 'approved', 'completed', 'cancelled'
  final DateTime? startDate;
  final DateTime? dueDate;
  final String postId;
  final String borrowerId;
  final String lenderId;
  final String otherPartyName;
  final String? otherPartyPhone;
  final String? otherPartyAvatar;
  final bool isBorrower; // true if current user is the one receiving help

  const SwapItem({
    required this.id,
    required this.title,
    required this.status,
    this.startDate,
    this.dueDate,
    required this.postId,
    required this.borrowerId,
    required this.lenderId,
    required this.otherPartyName,
    this.otherPartyPhone,
    this.otherPartyAvatar,
    required this.isBorrower,
  });

  bool get isPending => status == 'pending';
  bool get isApproved => status == 'approved' || status == 'in_progress';
  bool get isCompleted => status == 'completed';
  bool get isCancelled => status == 'cancelled';

  String get statusArabic {
    switch (status) {
      case 'approved':
      case 'in_progress':
        return 'قيد التنفيذ / مقبولة';
      case 'completed':
        return 'تمت بنجاح';
      case 'cancelled':
        return 'ملغاة';
      case 'pending':
      default:
        return 'قيد الانتظار';
    }
  }
}

class MySwapsGroup {
  final List<SwapItem> asBorrower;
  final List<SwapItem> asLender;

  const MySwapsGroup({
    this.asBorrower = const [],
    this.asLender = const [],
  });

  int get totalActive =>
      asBorrower.where((s) => !s.isCompleted && !s.isCancelled).length +
      asLender.where((s) => !s.isCompleted && !s.isCancelled).length;
}
