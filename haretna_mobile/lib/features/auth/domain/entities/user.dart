class User {
  final String id;
  final String name;
  final String phone;
  final String? email;
  final String? city;
  final String? neighborhood;
  final String role;
  final String? avatarUrl;
  final int trustPoints;

  const User({
    required this.id,
    required this.name,
    required this.phone,
    this.email,
    this.city,
    this.neighborhood,
    this.role = 'user',
    this.avatarUrl,
    this.trustPoints = 0,
  });

  bool get isAdmin => role == 'admin' || role == 'moderator';

  User copyWith({
    String? id,
    String? name,
    String? phone,
    String? email,
    String? city,
    String? neighborhood,
    String? role,
    String? avatarUrl,
    int? trustPoints,
  }) {
    return User(
      id: id ?? this.id,
      name: name ?? this.name,
      phone: phone ?? this.phone,
      email: email ?? this.email,
      city: city ?? this.city,
      neighborhood: neighborhood ?? this.neighborhood,
      role: role ?? this.role,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      trustPoints: trustPoints ?? this.trustPoints,
    );
  }
}
