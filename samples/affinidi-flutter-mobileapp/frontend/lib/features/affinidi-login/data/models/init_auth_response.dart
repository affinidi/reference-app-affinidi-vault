import 'package:json_annotation/json_annotation.dart';

part 'init_auth_response.g.dart';

@JsonSerializable()
class InitAuthResponse {
  final String authorizationUrl;

  InitAuthResponse({
    required this.authorizationUrl,
  });

  factory InitAuthResponse.fromJson(Map<String, dynamic> json) =>
      _$InitAuthResponseFromJson(json);

  /// Connect the generated [_$InitAuthResponseToJson] function to the `toJson` method.
  Map<String, dynamic> toJson() => _$InitAuthResponseToJson(this);
}
