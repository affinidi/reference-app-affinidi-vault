import 'package:flutter_mobile/features/affinidi-login/domain/repositories/affinidi_auth_repo.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:url_launcher/url_launcher_string.dart';

class AffinidiLoginButtonWidget extends StatelessWidget {
  final AffinidiAuthRepo affinidiAuthRepo;
  const AffinidiLoginButtonWidget({
    super.key,
    required this.affinidiAuthRepo,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 188,
      height: 48,
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xff1d58fc),
          foregroundColor: Colors.white,
          textStyle: GoogleFonts.figtree(
            textStyle: const TextStyle(
              fontWeight: FontWeight.w600,
              letterSpacing: 0.6,
            ),
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(48),
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
            SizedBox(
              width: 30,
              child: SvgPicture.asset(
                'assets/affinidi_logo.svg',
                width: 30,
                height: 24,
              ),
            ),
            const Expanded(
              child: Center(
                child: Text("Affinidi Login"),
              ),
            ),
          ],
        ),
        onPressed: () async {
          final response = await affinidiAuthRepo.init();
          final String authUriString = response.authorizationUrl.toString();
          debugPrint("authUriString: $authUriString");
          await launchUrlString(authUriString, webOnlyWindowName: '_self');
        },
      ),
    );
  }
}
