import '../../domain/entities/user.dart';

class UserModel extends User {
  const UserModel({
    required super.id,
    required super.name,
    required super.phone,
    super.email,
    super.city,
    super.neighborhood,
    super.role = 'user',
    super.avatarUrl,
    super.trustPoints = 0,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      phone: json['phone'] as String? ?? '',
      email: json['email'] as String?,
      city: json['city'] as String?,
      neighborhood: json['neighborhood'] as String?,
      role: json['role'] as String? ?? 'user',
      avatarUrl: (json['avatarUrl'] ?? json['avatar']) as String?,
      trustPoints: (json['trustPoints'] as num?)?.toInt() ?? 0,
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
      'avatarUrl': avatarUrl,
      'trustPoints': trustPoints,
    };
  }
}
