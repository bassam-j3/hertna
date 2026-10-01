abstract class Failure {
  final String message;
  const Failure(this.message);

  @override
  String toString() => message;
}

class ServerFailure extends Failure {
  final int? statusCode;
  const ServerFailure(super.message, {this.statusCode});
}

class NetworkFailure extends Failure {
  const NetworkFailure([super.message = 'تعذر الاتصال بالشبكة. تأكد من تفعيل الإنترنت.']);
}

class AuthFailure extends Failure {
  const AuthFailure([super.message = 'بيانات الدخول غير صحيحة.']);
}
