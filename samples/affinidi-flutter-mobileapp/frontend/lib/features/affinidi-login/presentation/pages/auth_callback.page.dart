import 'package:flutter_mobile/features/affinidi-login/domain/repositories/affinidi_auth_repo.dart';
import 'package:flutter_mobile/service_registry.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'dart:convert';

class AuthCallbackPage extends StatelessWidget {
  const AuthCallbackPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Auth Callback"),
      ),
      body: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
            FutureBuilder(
                future: ServiceRegistry.get<AffinidiAuthRepo>()
                    .handleOAuthRedirectWeb(GoRouterState.of(context).uri),
                builder: (BuildContext context, AsyncSnapshot ss) {
                  if (ss.hasError) {
                    return Text("error: ${ss.error!.toString()}");
                  } else {
                    if (ss.hasData) {
                      Map<String, dynamic> user =
                          ss.data as Map<String, dynamic>;
                      // if (tokens.idToken != null) {
                      Future.delayed(const Duration(milliseconds: 300))
                          .then((_) {
                        context.go(Uri(
                            path: '/onboarding',
                            queryParameters: {'user': user}).toString());
                      });
                      return Container();
                    } else {
                      return const CircularProgressIndicator();
                    }
                  }
                }),
          ]
          // queryParameters.entries.map<Widget>((entry) {
          //   return Padding(
          //     padding: const EdgeInsets.all(6.0),
          //     child: Row(
          //       children: [
          //         SizedBox(
          //           width: 100,
          //           child: Text(entry.key),
          //         ),
          //         Expanded(
          //           child: StyledText(
          //             text: entry.value,
          //           ),
          //         ),
          //       ],
          //     ),
          //   );
          // }).toList(),
          ),
    );
  }
}
