import 'package:flutter_mobile/features/affinidi-login/data/models/complete_auth_input.dart';
import 'package:flutter_mobile/features/affinidi-login/data/models/init_auth_response.dart';

import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

part 'affinidi_auth_api.g.dart';

@RestApi()
abstract class AffinidiAuthApi {
  factory AffinidiAuthApi(Dio dio, {String baseUrl}) = _AffinidiAuthApi;

  @GET("/api/affinidi-auth/init")
  Future<InitAuthResponse> init();

  @POST("/api/affinidi-auth/complete")
  Future complete({
    @Body() required CompleteAuthInput input,
  });
}
