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
  final String status; // 'pending', 'accepted', 'in_use', 'completed', 'cancelled', 'rejected'
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

  bool get isPending => status == 'pending';
  bool get isAccepted => status == 'accepted';
  bool get isInUse => status == 'in_use';
  bool get isCompleted => status == 'completed';
  bool get isCancelled => status == 'cancelled' || status == 'rejected';

  String get statusArabic {
    switch (status) {
      case 'pending':
        return 'بانتظار التأكيد';
      case 'accepted':
        return 'تمت الموافقة';
      case 'in_use':
        return 'قيد التبادل / الاستخدام';
      case 'completed':
        return 'مكتمل بنجاح';
      case 'rejected':
      case 'cancelled':
        return 'ملغي / مرفوض';
      default:
        return status;
    }
  }
}
