import 'package:flutter_mobile/features/affinidi-login/data/models/complete_auth_input.dart';
import 'package:flutter_mobile/features/affinidi-login/data/models/init_auth_response.dart';

abstract class AffinidiAuthRepo {
  Future<InitAuthResponse> init();

  Future<Map<String, dynamic>> handleOAuthRedirectWeb(
    Uri authCodeRedirectUri,
  );
}
