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

class SwapItemEntity {
  final String id;
  final String title;
  final String status; // 'PENDING', 'ACCEPTED', 'ACTIVE', 'COMPLETED', 'CANCELLED'
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

  bool get isPending => status == 'PENDING';
  bool get isAccepted => status == 'ACCEPTED';
  bool get isInUse => status == 'ACTIVE';
  bool get isCompleted => status == 'COMPLETED';
  bool get isCancelled => status == 'CANCELLED';

  String get statusArabic {
    switch (status) {
      case 'PENDING':
        return 'بانتظار التأكيد';
      case 'ACCEPTED':
        return 'تمت الموافقة';
      case 'ACTIVE':
        return 'قيد التبادل / الاستخدام';
      case 'COMPLETED':
        return 'مكتمل بنجاح';
      case 'CANCELLED':
        return 'ملغي';
      default:
        return status;
    }
  }
}
