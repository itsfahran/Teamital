import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:web_teamital/app_colors.dart';
import 'package:web_teamital/web/web_footer.dart';
import 'package:url_launcher/url_launcher.dart';

/// Account deletion instructions — https://teamital.com/delete-account
class WebDeleteAccountPage extends StatelessWidget {
  const WebDeleteAccountPage({super.key});

  static const _supportEmail = 'contact@teamital.com';
  static const _contactEmail = 'contact@teamital.com';

  Future<void> _mail(String email) async {
    final uri = Uri(
      scheme: 'mailto',
      path: email,
      queryParameters: {
        'subject': 'Teamital — Account deletion request',
      },
    );
    await launchUrl(uri);
  }

  @override
  Widget build(BuildContext context) {
    final w = MediaQuery.sizeOf(context).width;
    final pad = w < 700 ? 20.0 : 48.0;

    return Theme(
      data: ThemeData(
        brightness: Brightness.light,
        scaffoldBackgroundColor: const Color(0xFFF5F7FA),
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: AppColors.primary,
          brightness: Brightness.light,
        ),
      ),
      child: Scaffold(
        backgroundColor: const Color(0xFFF5F7FA),
        appBar: AppBar(
          backgroundColor: Colors.white,
          foregroundColor: const Color(0xFF111827),
          elevation: 0,
          title: Text(
            'Delete account',
            style: GoogleFonts.poppins(fontWeight: FontWeight.w700),
          ),
        ),
        body: SingleChildScrollView(
          child: Column(
            children: [
              Padding(
                padding: EdgeInsets.fromLTRB(pad, 32, pad, 40),
                child: Center(
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 860),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Delete Your Teamital Account',
                          style: GoogleFonts.poppins(
                            fontSize: 30,
                            fontWeight: FontWeight.w800,
                            color: const Color(0xFF111827),
                            height: 1.25,
                          ),
                        ),
                        const SizedBox(height: 16),
                        _p(
                          'If you would like to delete your Teamital account and associated personal data, you can submit a deletion request using the instructions below.',
                        ),
                        _h('How to request account deletion'),
                        _p(
                          'Please contact us using the email address associated with your Teamital account and request that your account be deleted.',
                        ),
                        const SizedBox(height: 8),
                        Wrap(
                          crossAxisAlignment: WrapCrossAlignment.center,
                          children: [
                            Text(
                              'Email: ',
                              style: GoogleFonts.poppins(
                                fontSize: 15,
                                height: 1.65,
                                fontWeight: FontWeight.w600,
                                color: const Color(0xFF374151),
                              ),
                            ),
                            InkWell(
                              onTap: () => _mail(_supportEmail),
                              child: Text(
                                _supportEmail,
                                style: GoogleFonts.poppins(
                                  fontSize: 15,
                                  height: 1.65,
                                  fontWeight: FontWeight.w700,
                                  color: AppColors.primary,
                                  decoration: TextDecoration.underline,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        _p('Please include:'),
                        _bullets(const [
                          'Your registered email address or username',
                          'Your request to delete your Teamital account',
                        ]),
                        _p(
                          'We may ask you to verify your identity before processing the request.',
                        ),
                        _h('What happens when your account is deleted?'),
                        _p(
                          'When your account deletion request is processed:',
                        ),
                        _bullets(const [
                          'Your Teamital account will be permanently deleted.',
                          'Personal information associated with your account will be deleted.',
                          'Employee/profile information associated with your account will be deleted.',
                          'Any other data that is not required to be retained for legitimate legal or security purposes will be deleted.',
                        ]),
                        _p(
                          'Some information may be retained for a limited period when required by law, for fraud prevention, security, accounting, or other legitimate legal purposes. Any retained information will be securely stored and deleted when the applicable retention requirement expires.',
                        ),
                        _h('Account deletion is permanent'),
                        _p(
                          'Account deletion is permanent and cannot be undone. Once your account and associated data have been deleted, they cannot be recovered.',
                        ),
                        _p(
                          'If you have questions about account deletion or your data, please contact us at:',
                        ),
                        InkWell(
                          onTap: () => _mail(_contactEmail),
                          child: Text(
                            _contactEmail,
                            style: GoogleFonts.poppins(
                              fontSize: 15,
                              height: 1.65,
                              fontWeight: FontWeight.w700,
                              color: AppColors.primary,
                              decoration: TextDecoration.underline,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const WebMarketingFooter(),
            ],
          ),
        ),
      ),
    );
  }

  static Widget _h(String text) {
    return Padding(
      padding: const EdgeInsets.only(top: 28, bottom: 12),
      child: Text(
        text,
        style: GoogleFonts.poppins(
          fontSize: 20,
          fontWeight: FontWeight.w700,
          color: const Color(0xFF111827),
        ),
      ),
    );
  }

  static Widget _p(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Text(
        text,
        style: GoogleFonts.poppins(
          fontSize: 15,
          height: 1.65,
          color: const Color(0xFF374151),
        ),
      ),
    );
  }

  static Widget _bullets(List<String> items) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12, left: 4),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          for (final item in items)
            Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.only(top: 7),
                    child: Container(
                      width: 6,
                      height: 6,
                      decoration: const BoxDecoration(
                        color: AppColors.masterPrimary,
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      item,
                      style: GoogleFonts.poppins(
                        fontSize: 15,
                        height: 1.6,
                        color: const Color(0xFF374151),
                      ),
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
