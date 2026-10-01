import '../../domain/entities/user_profile.dart';

class UserProfileModel extends UserProfile {
  const UserProfileModel({
    required super.id,
    required super.name,
    required super.phone,
    super.email,
    required super.city,
    required super.neighborhood,
    super.role = 'user',
    super.avatarUrl,
    super.trustPoints = 0,
    super.postsCount = 0,
    super.givenRatingsCount = 0,
    super.receivedRatingsCount = 0,
    super.createdAt,
  });

  factory UserProfileModel.fromJson(Map<String, dynamic> json) {
    int posts = 0;
    int given = 0;
    int received = 0;

    if (json['_count'] is Map<String, dynamic>) {
      final counts = json['_count'] as Map<String, dynamic>;
      posts = (counts['posts'] as num?)?.toInt() ?? 0;
      given = (counts['givenRatings'] as num?)?.toInt() ?? 0;
      received = (counts['receivedRatings'] as num?)?.toInt() ?? 0;
    }

    DateTime? createdDate;
    if (json['createdAt'] != null) {
      createdDate = DateTime.tryParse(json['createdAt'].toString());
    }

    return UserProfileModel(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      phone: json['phone'] as String? ?? '',
      email: json['email'] as String?,
      city: json['city'] as String? ?? 'دمشق',
      neighborhood: json['neighborhood'] as String? ?? 'حي الميدان',
      role: json['role'] as String? ?? 'user',
      avatarUrl: (json['avatar'] ?? json['avatarUrl']) as String?,
      trustPoints: (json['trustPoints'] as num?)?.toInt() ?? 0,
      postsCount: posts,
      givenRatingsCount: given,
      receivedRatingsCount: received,
      createdAt: createdDate,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'phone': phone,
      'email': email,
      'city': city,
      'neighborhood': neighborhood,
      'role': role,
      'avatar': avatarUrl,
      'trustPoints': trustPoints,
    };
  }
}
