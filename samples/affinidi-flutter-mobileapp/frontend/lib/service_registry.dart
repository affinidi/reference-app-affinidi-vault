import 'package:flutter_mobile/features/affinidi-login/data/data_sources/affinidi_auth_api.dart';
import 'package:flutter_mobile/features/affinidi-login/data/repositories/affinidi_auth_repo_impl.dart';
import 'package:flutter_mobile/features/affinidi-login/domain/repositories/affinidi_auth_repo.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:get_it/get_it.dart';
import 'package:dio/dio.dart';
import 'package:pretty_dio_logger/pretty_dio_logger.dart';

class ServiceRegistry {
  static registerAll() {
    final getIt = GetIt.instance;
    getIt.registerLazySingleton<AffinidiAuthApi>(
      () => AffinidiAuthApi(
        ServiceRegistry.get<Dio>(),
        baseUrl: dotenv.env["BACKEND_URL"]!,
      ),
    );

    getIt.registerLazySingleton<AffinidiAuthRepo>(
      () => RetrofitAffinidiAuthRepositoryImpl(
        remoteDataSource: ServiceRegistry.get<AffinidiAuthApi>(),
      ),
    );
    // External libraries
    final defaultdio = Dio(
      BaseOptions(
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );
    defaultdio.interceptors.add(PrettyDioLogger(
      requestHeader: true,
      requestBody: true,
      responseBody: true,
      responseHeader: false,
      compact: false,
    ));

    getIt.registerLazySingleton<Dio>(
      () => defaultdio,
    );
  }

  static T get<T extends Object>() {
    return GetIt.instance.get<T>();
  }
}
