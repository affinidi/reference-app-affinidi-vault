// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'complete_auth_input.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CompleteAuthInput _$CompleteAuthInputFromJson(Map<String, dynamic> json) =>
    CompleteAuthInput(
      code: json['code'] as String,
      state: json['state'] as String,
    );

Map<String, dynamic> _$CompleteAuthInputToJson(CompleteAuthInput instance) =>
    <String, dynamic>{
      'code': instance.code,
      'state': instance.state,
    };
