import 'package:json_annotation/json_annotation.dart';

part 'complete_auth_input.g.dart';

@JsonSerializable()
class CompleteAuthInput {
  final String code;
  final String state;

  CompleteAuthInput({
    required this.code,
    required this.state,
  });

  factory CompleteAuthInput.fromJson(Map<String, dynamic> json) =>
      _$CompleteAuthInputFromJson(json);

  /// Connect the generated [_$CompleteAuthInputToJson] function to the `toJson` method.
  Map<String, dynamic> toJson() => _$CompleteAuthInputToJson(this);
}
