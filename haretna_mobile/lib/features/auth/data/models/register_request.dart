class RegisterRequest {
  final String name;
  final String phone;
  final String password;
  final String city;
  final String neighborhood;
  final String? userType;

  const RegisterRequest({
    required this.name,
    required this.phone,
    required this.password,
    required this.city,
    required this.neighborhood,
    this.userType = 'resident',
  });

  Map<String, dynamic> toJson() {
    return {
      'name': name.trim(),
      'phone': phone.trim(),
      'password': password,
      'city': city.trim(),
      'neighborhood': neighborhood.trim(),
      'userType': userType ?? 'resident',
    };
  }
}
