import 'package:flutter_mobile/features/affinidi-login/domain/repositories/affinidi_auth_repo.dart';
import 'package:flutter_mobile/features/affinidi-login/presentation/widgets/affinidi_login_button.widget.dart';
import 'package:flutter_mobile/service_registry.dart';
import 'package:flutter/material.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(
    BuildContext context,
  ) {
    return Scaffold(
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Container(
            height: 100,
            width: 150,
            alignment: Alignment.center,
            color: Colors.black87.withOpacity(0.1),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: <Widget>[
                const Icon(Icons.lock, size: 40, color: Colors.black87),
                const SizedBox(
                  height: 10,
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [1, 2, 3, 4].map((index) {
                    return Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: <Widget>[
                        Container(
                          height: 5,
                          width: 5,
                          decoration: const BoxDecoration(
                            color: Colors.black87,
                            borderRadius: BorderRadius.all(
                              Radius.circular(
                                5,
                              ),
                            ),
                          ),
                        ),
                        Container(
                          width: 5,
                        ),
                      ],
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: <Widget>[
              SizedBox(
                width: 320,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: <Widget>[
                    const SizedBox(
                      height: 50,
                    ),
                    const Text(
                      "Let’s get started",
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(
                      height: 50,
                    ),
                    AffinidiLoginButtonWidget(
                      affinidiAuthRepo: ServiceRegistry.get<AffinidiAuthRepo>(),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
