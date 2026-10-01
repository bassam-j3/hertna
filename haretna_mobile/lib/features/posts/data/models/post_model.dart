import '../../domain/entities/post.dart';

class PostUserModel extends PostUser {
  const PostUserModel({
    required super.id,
    required super.name,
    super.avatar,
    super.neighborhood,
    super.trustPoints = 0,
    super.phone,
  });

  factory PostUserModel.fromJson(Map<String, dynamic> json) {
    return PostUserModel(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? 'أحد الجيران',
      avatar: json['avatar'] as String?,
      neighborhood: json['neighborhood'] as String?,
      trustPoints: (json['trustPoints'] as num?)?.toInt() ?? 0,
      phone: json['phone'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'avatar': avatar,
      'neighborhood': neighborhood,
      'trustPoints': trustPoints,
      'phone': phone,
    };
  }
}

class PostModel extends Post {
  const PostModel({
    required super.id,
    required super.title,
    required super.description,
    required super.category,
    required super.type,
    super.urgent = false,
    required super.location,
    super.image,
    super.isAnonymous = false,
    super.tags = const [],
    required super.createdAt,
    required super.userId,
    super.user,
  });

  factory PostModel.fromJson(Map<String, dynamic> json) {
    DateTime parsedDate;
    if (json['createdAt'] != null) {
      parsedDate = DateTime.tryParse(json['createdAt'].toString()) ?? DateTime.now();
    } else {
      parsedDate = DateTime.now();
    }

    PostUserModel? userModel;
    if (json['user'] is Map<String, dynamic>) {
      userModel = PostUserModel.fromJson(json['user'] as Map<String, dynamic>);
    }

    List<String> tagsList = [];
    if (json['tags'] is List) {
      tagsList = (json['tags'] as List).map((e) => e.toString()).toList();
    }

    return PostModel(
      id: json['id'] as String? ?? '',
      title: json['title'] as String? ?? '',
      description: json['description'] as String? ?? '',
      category: json['category'] as String? ?? 'أخرى',
      type: json['type'] as String? ?? 'REQUEST',
      urgent: json['urgent'] as bool? ?? false,
      location: json['location'] as String? ?? 'سوريا',
      image: json['image'] as String?,
      isAnonymous: json['isAnonymous'] as bool? ?? false,
      tags: tagsList,
      createdAt: parsedDate,
      userId: json['userId'] as String? ?? '',
      user: userModel,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'category': category,
      'type': type,
      'urgent': urgent,
      'location': location,
      'image': image,
      'isAnonymous': isAnonymous,
      'tags': tags,
      'createdAt': createdAt.toIso8601String(),
      'userId': userId,
      if (user != null && user is PostUserModel)
        'user': (user as PostUserModel).toJson(),
    };
  }
}
