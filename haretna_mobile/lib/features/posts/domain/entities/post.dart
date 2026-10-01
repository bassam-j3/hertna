class PostUser {
  final String id;
  final String name;
  final String? avatar;
  final String? neighborhood;
  final int trustPoints;
  final String? phone;

  const PostUser({
    required this.id,
    required this.name,
    this.avatar,
    this.neighborhood,
    this.trustPoints = 0,
    this.phone,
  });
}

class Post {
  final String id;
  final String title;
  final String description;
  final String category;
  final String type; // 'OFFER' or 'REQUEST'
  final bool urgent;
  final String location;
  final String? image;
  final bool isAnonymous;
  final List<String> tags;
  final DateTime createdAt;
  final String userId;
  final PostUser? user;

  const Post({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.type,
    this.urgent = false,
    required this.location,
    this.image,
    this.isAnonymous = false,
    this.tags = const [],
    required this.createdAt,
    required this.userId,
    this.user,
  });

  bool get isOffer => type.toUpperCase() == 'OFFER';
  bool get isRequest => type.toUpperCase() == 'REQUEST';
}
