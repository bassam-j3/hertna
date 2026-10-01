class ServerException implements Exception {
  final String message;
  final int? statusCode;

  const ServerException({
    required this.message,
    this.statusCode,
  });

  @override
  String toString() => 'ServerException(code: $statusCode, message: $message)';
}

class NetworkException implements Exception {
  final String message;

  const NetworkException({
    this.message = 'تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.',
  });

  @override
  String toString() => 'NetworkException($message)';
}

class UnauthorizedException implements Exception {
  final String message;

  const UnauthorizedException({
    this.message = 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً.',
  });

  @override
  String toString() => 'UnauthorizedException($message)';
}
