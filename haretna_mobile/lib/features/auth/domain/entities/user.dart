class User {
  final String id;
  final String name;
  final String phone;
  final String? email;
  final String? city;
  final String? neighborhood;
  final String role;
  final String? avatarUrl;

  const User({
    required this.id,
    required this.name,
    required this.phone,
    this.email,
    this.city,
    this.neighborhood,
    this.role = 'user',
    this.avatarUrl,
  });

  bool get isAdmin => role == 'admin' || role == 'moderator';
}
