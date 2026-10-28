class SwapParty {
  final String id;
  final String name;
  final String? avatar;
  final String? phone;

  const SwapParty({
    required this.id,
    required this.name,
    this.avatar,
    this.phone,
  });
}

enum SwapStatus {
  pending('PENDING'),
  accepted('ACCEPTED'),
  active('ACTIVE'),
  completed('COMPLETED'),
  cancelled('CANCELLED');

  final String value;
  const SwapStatus(this.value);

  static SwapStatus fromString(String? value) {
    switch (value?.toUpperCase()) {
      case 'PENDING':
        return SwapStatus.pending;
      case 'ACCEPTED':
        return SwapStatus.accepted;
      case 'ACTIVE':
        return SwapStatus.active;
      case 'COMPLETED':
        return SwapStatus.completed;
      case 'CANCELLED':
        return SwapStatus.cancelled;
      default:
        return SwapStatus.pending;
    }
  }

  @override
  String toString() => value;
}

class SwapItemEntity {
  final String id;
  final String title;
  final SwapStatus status;
  final DateTime? startDate;
  final DateTime? dueDate;
  final String? postId;
  final String? postImage;
  final SwapParty? otherParty;
  final bool isLender; // true if I am providing the aid/tool, false if I am requesting

  const SwapItemEntity({
    required this.id,
    required this.title,
    required this.status,
    this.startDate,
    this.dueDate,
    this.postId,
    this.postImage,
    this.otherParty,
    required this.isLender,
  });

  bool get isPending => status == SwapStatus.pending;
  bool get isAccepted => status == SwapStatus.accepted;
  bool get isInUse => status == SwapStatus.active;
  bool get isCompleted => status == SwapStatus.completed;
  bool get isCancelled => status == SwapStatus.cancelled;

  String get statusArabic {
    switch (status) {
      case SwapStatus.pending:
        return 'بانتظار التأكيد';
      case SwapStatus.accepted:
        return 'تمت الموافقة';
      case SwapStatus.active:
        return 'قيد التبادل / الاستخدام';
      case SwapStatus.completed:
        return 'مكتمل بنجاح';
      case SwapStatus.cancelled:
        return 'ملغي';
    }
  }
}
