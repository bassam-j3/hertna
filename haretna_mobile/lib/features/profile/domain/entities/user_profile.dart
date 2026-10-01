class UserProfile {
  final String id;
  final String name;
  final String phone;
  final String? email;
  final String city;
  final String neighborhood;
  final String role;
  final String? avatarUrl;
  final int trustPoints;
  final int postsCount;
  final int givenRatingsCount;
  final int receivedRatingsCount;
  final DateTime? createdAt;

  const UserProfile({
    required this.id,
    required this.name,
    required this.phone,
    this.email,
    required this.city,
    required this.neighborhood,
    this.role = 'user',
    this.avatarUrl,
    this.trustPoints = 0,
    this.postsCount = 0,
    this.givenRatingsCount = 0,
    this.receivedRatingsCount = 0,
    this.createdAt,
  });

  bool get isAdmin => role == 'admin' || role == 'moderator';

  String get trustBadge {
    if (trustPoints >= 50) return 'جار ذهبي ⭐⭐⭐';
    if (trustPoints >= 20) return 'جار مميز ⭐⭐';
    if (trustPoints >= 5) return 'جار موثوق ⭐';
    return 'عضو جديد في الحارة 🌱';
  }
}
