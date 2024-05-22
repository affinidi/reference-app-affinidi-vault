import 'package:flutter_mobile/features/affinidi-login/data/data_sources/affinidi_auth_api.dart';
import 'package:flutter_mobile/features/affinidi-login/data/models/complete_auth_input.dart';
import 'package:flutter_mobile/features/affinidi-login/data/models/init_auth_response.dart';
import 'package:flutter_mobile/features/affinidi-login/domain/repositories/affinidi_auth_repo.dart';
import 'package:flutter/foundation.dart';

class RetrofitAffinidiAuthRepositoryImpl implements AffinidiAuthRepo {
  final AffinidiAuthApi remoteDataSource;

  RetrofitAffinidiAuthRepositoryImpl({
    required this.remoteDataSource,
  });

  @override
  Future<Map<String, dynamic>> handleOAuthRedirectWeb(
    Uri authCodeRedirectUri,
  ) async {
    debugPrint("authCodeRedirectUri: ${authCodeRedirectUri.toString()}");
    final input = CompleteAuthInput(
      code: authCodeRedirectUri.queryParameters["code"]!,
      state: authCodeRedirectUri.queryParameters["state"]!,
    );
    final result = await remoteDataSource.complete(input: input);
    return ((result as Map<String, dynamic>)["user"] as Map<String, dynamic>);
  }

  @override
  Future<InitAuthResponse> init() {
    return remoteDataSource.init();
  }
}
