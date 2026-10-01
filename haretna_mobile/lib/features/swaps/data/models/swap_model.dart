import '../../domain/entities/swap.dart';

class SwapPartyModel extends SwapParty {
  const SwapPartyModel({
    required super.id,
    required super.name,
    super.avatar,
    super.phone,
  });

  factory SwapPartyModel.fromJson(Map<String, dynamic> json) {
    return SwapPartyModel(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? 'أحد الجيران',
      avatar: json['avatar'] as String?,
      phone: json['phone'] as String?,
    );
  }
}

class SwapModel extends SwapItemEntity {
  const SwapModel({
    required super.id,
    required super.title,
    required super.status,
    super.startDate,
    super.dueDate,
    super.postId,
    super.postImage,
    super.otherParty,
    required super.isLender,
  });

  factory SwapModel.fromJson(Map<String, dynamic> json, {required bool isLender}) {
    DateTime? start;
    if (json['startDate'] != null) {
      start = DateTime.tryParse(json['startDate'].toString());
    }

    DateTime? due;
    if (json['dueDate'] != null) {
      due = DateTime.tryParse(json['dueDate'].toString());
    }

    SwapPartyModel? party;
    final partyJson = isLender ? json['borrower'] : json['lender'];
    if (partyJson is Map<String, dynamic>) {
      party = SwapPartyModel.fromJson(partyJson);
    }

    String? postImg;
    if (json['post'] is Map<String, dynamic>) {
      postImg = json['post']['image'] as String?;
    }

    return SwapModel(
      id: json['id'] as String? ?? '',
      title: json['title'] as String? ?? 'مبادلة مجتمعية',
      status: json['status'] as String? ?? 'pending',
      startDate: start,
      dueDate: due,
      postId: json['postId'] as String?,
      postImage: postImg,
      otherParty: party,
      isLender: isLender,
    );
  }
}
