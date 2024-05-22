import 'package:flutter/material.dart';

// Map<String, dynamic> parseJwt(String token) {
//   final parts = token.split('.');
//   if (parts.length != 3) {
//     throw Exception('invalid token');
//   }

//   final payload = _decodeBase64(parts[1]);
//   final payloadMap = json.decode(payload);
//   if (payloadMap is! Map<String, dynamic>) {
//     throw Exception('invalid payload');
//   }

//   return payloadMap;
// }

// String _decodeBase64(String str) {
//   String output = str.replaceAll('-', '+').replaceAll('_', '/');

//   switch (output.length % 4) {
//     case 0:
//       break;
//     case 2:
//       output += '==';
//       break;
//     case 3:
//       output += '=';
//       break;
//     default:
//       throw Exception('Illegal base64url string!"');
//   }

//   return utf8.decode(base64Url.decode(output));
// }

class OnboaringPage extends StatelessWidget {
  // final String idToken;
  final String userEmail;
  const OnboaringPage({
    super.key,
    // required this.idToken,
    required this.userEmail,
  });

  @override
  Widget build(BuildContext context) {
    // final Map<String, dynamic> jwtMap = parseJwt(idToken);
    // debugPrint("parsed Token Params:");
    // debugPrint(jsonEncode(jwtMap));
    return SafeArea(
      child: Scaffold(
        body: Column(
          children: <Widget>[
            Container(
              height: 150,
              color: Colors.black87,
              alignment: Alignment.bottomLeft,
              child: const Padding(
                padding: EdgeInsets.only(
                  left: 10,
                  bottom: 20,
                  right: 0,
                  top: 0,
                ),
                child: Text(
                  "Welcome",
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
            Expanded(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Padding(
                    padding: const EdgeInsets.all(10),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        const Text(
                          "Email",
                          style: TextStyle(
                            color: Colors.black54,
                            fontSize: 12,
                          ),
                        ),
                        Text(userEmail),
                      ],
                    ),

                    //   ((jwtMap["email"] != null) ||
                    //           (jwtMap["custom"][1]["email"] != null))
                    //       ? Column(
                    //           mainAxisAlignment: MainAxisAlignment.center,
                    //           crossAxisAlignment: CrossAxisAlignment.start,
                    //           children: <Widget>[
                    //             const Text(
                    //               "Email",
                    //               style: TextStyle(
                    //                 color: Colors.black54,
                    //                 fontSize: 12,
                    //               ),
                    //             ),
                    //             Text((jwtMap["email"] != null)
                    //                 ? jwtMap["email"]
                    //                 : jwtMap["custom"][1]["email"]),
                    //           ],
                    //         )
                    //       : const Text("Email Unavailable"),
                  ),

                  // Row(
                  //   mainAxisAlignment: MainAxisAlignment.start,
                  //   crossAxisAlignment: CrossAxisAlignment.start,
                  //   children: <Widget>[
                  //     Expanded(
                  //       child: Padding(
                  //         padding: const EdgeInsets.all(10),
                  //         child: Column(
                  //           mainAxisAlignment: MainAxisAlignment.center,
                  //           crossAxisAlignment: CrossAxisAlignment.start,
                  //           children: <Widget>[
                  //             const Text(
                  //               "First Name",
                  //               style: TextStyle(
                  //                 color: Colors.black54,
                  //                 fontSize: 12,
                  //               ),
                  //             ),
                  //             Text((jwtMap["given_name"] != null)
                  //                 ? jwtMap["given_name"]
                  //                 : "Unavailable"),
                  //           ],
                  //         ),
                  //       ),
                  //     ),
                  //     Expanded(
                  //       child: Padding(
                  //         padding: const EdgeInsets.all(10),
                  //         child: Column(
                  //           mainAxisAlignment: MainAxisAlignment.center,
                  //           crossAxisAlignment: CrossAxisAlignment.start,
                  //           children: <Widget>[
                  //             const Text(
                  //               "Last Name",
                  //               style: TextStyle(
                  //                 color: Colors.black54,
                  //                 fontSize: 12,
                  //               ),
                  //             ),
                  //             Text((jwtMap["family_name"] != null)
                  //                 ? jwtMap["family_name"]
                  //                 : "Unavailable"),
                  //           ],
                  //         ),
                  //       ),
                  //     ),
                  //   ],
                  // ),
                  // Padding(
                  //   padding: const EdgeInsets.all(10),
                  //   child: Column(
                  //     mainAxisAlignment: MainAxisAlignment.center,
                  //     crossAxisAlignment: CrossAxisAlignment.start,
                  //     children: <Widget>[
                  //       const Text(
                  //         "Gender",
                  //         style: TextStyle(
                  //           color: Colors.black54,
                  //           fontSize: 12,
                  //         ),
                  //       ),
                  //       Text((jwtMap["gender"] != null)
                  //           ? jwtMap["gender"]
                  //           : "unavailable"),
                  //     ],
                  //   ),
                  // ),

                  // Padding(
                  //   padding: const EdgeInsets.all(10),
                  //   child: Column(
                  //     mainAxisAlignment: MainAxisAlignment.center,
                  //     crossAxisAlignment: CrossAxisAlignment.start,
                  //     children: <Widget>[
                  //       const Text(
                  //         "Email",
                  //         style: TextStyle(
                  //           color: Colors.black54,
                  //           fontSize: 12,
                  //         ),
                  //       ),
                  //       Text(jwtMap["email"]),
                  //     ],
                  //   ),
                  // ),
                ],
              ),
            ),
            Container(
                height: 80,
                color: Colors.black87,
                alignment: Alignment.topCenter,
                child: ElevatedButton(
                    child: const Text("Get Started"), onPressed: () {}))
          ],
        ),
      ),
    );
  }
}
