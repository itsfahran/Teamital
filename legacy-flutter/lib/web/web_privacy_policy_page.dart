import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:web_teamital/app_colors.dart';
import 'package:web_teamital/web/web_footer.dart';

/// Full GDPR privacy policy — https://teamital.com/privacy-policy
class WebPrivacyPolicyPage extends StatelessWidget {
  const WebPrivacyPolicyPage({super.key});

  static const _lastUpdated = '04/Oct/2026';
  static const _privacyEmail = 'contact@teamital.com';

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
            'Privacy Policy',
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
                            'Privacy Policy',
                            style: GoogleFonts.poppins(
                              fontSize: 34,
                              fontWeight: FontWeight.w800,
                              color: const Color(0xFF111827),
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Last Updated: $_lastUpdated',
                            style: GoogleFonts.poppins(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: AppColors.primary,
                            ),
                          ),
                          const SizedBox(height: 20),
                          _p(
                            'Teamital (“we”, “us”, “our”) respects your privacy and is committed to protecting personal data in accordance with the EU General Data Protection Regulation (GDPR) (Regulation (EU) 2016/679) and the Irish Data Protection Act 2018.',
                          ),
                          _p(
                            'This Privacy Policy explains how we collect, use, store, share and protect personal data when businesses, administrators, employees and authorised users use Teamital, our website, web dashboard, mobile application and related services.',
                          ),
                          _h('1. Company Information'),
                          _p('Company Name: Teamital'),
                          _p(
                            'Business Address: Kandoy House, 2 Fairview Strand, Clontarf West, Dublin, D03 R8P3, Ireland',
                          ),
                          _p('Privacy Email: $_privacyEmail'),
                          _p(
                            'Teamital is designed for business and workplace use. The platform helps organisations manage employee attendance, time tracking, GPS location tracking, geofencing, route history, leave management, shift scheduling, payroll reports, project management, task management, announcements, notifications and document uploads.',
                          ),
                          _h('2. Our Role Under GDPR'),
                          _p(
                            'In most cases, the employer or business using Teamital is the Data Controller. This means the employer decides why and how employee personal data is collected and used.',
                          ),
                          _p(
                            'Teamital usually acts as the Data Processor, meaning we process personal data on behalf of the employer according to their instructions.',
                          ),
                          _p(
                            'In limited situations, we may act as a Data Controller, for example when we process business account data, billing records, website analytics, support requests, security logs or legal compliance records.',
                          ),
                          _h('3. Personal Data We Collect'),
                          _p(
                            'Depending on how the employer configures the platform, we may process the following types of personal data:',
                          ),
                          _bullets(const [
                            'Name, email address, phone number and account details',
                            'Employee profile information',
                            'Login credentials and authentication data',
                            'Attendance records, clock-in and clock-out times',
                            'Face recognition attendance data, where enabled',
                            'PIN or fingerprint authentication data, where enabled',
                            'GPS location data',
                            'Live GPS tracking data',
                            'Route history',
                            'Geofence clock-in and geofence activity',
                            'Leave records and shift schedules',
                            'Payroll-ready reports and timesheets',
                            'Project and task management records',
                            'Announcements and notification records',
                            'Site photos, employee selfies and uploaded documents',
                            'Device information, IP address, browser type and app usage data',
                            'Crash reports and diagnostic information',
                            'Payment and subscription records',
                          ]),
                          _h('4. Attendance, GPS and Employee Monitoring Data'),
                          _p(
                            'Teamital may allow employers to monitor attendance, working hours, location, route history and work-related activity.',
                          ),
                          _p('This may include:'),
                          _bullets(const [
                            'Face recognition attendance',
                            'PIN-based attendance',
                            'Fingerprint authentication',
                            'Geofence clock-in',
                            'GPS tracking',
                            'Live employee location tracking',
                            'Route history',
                            'Site visit records',
                            'Employee selfies',
                            'Site photos',
                            'Uploaded work documents',
                          ]),
                          _p(
                            'Employers are responsible for ensuring that employee monitoring is lawful, fair, transparent and proportionate. Employers must inform employees before monitoring begins and must explain what data is collected, why it is collected, when tracking occurs and how long the data is kept.',
                          ),
                          _h('5. Camera, Location and Device Permissions'),
                          _p(
                            'Our mobile application may request the following permissions:',
                          ),
                          _bullets(const [
                            'Camera',
                            'Location',
                            'Background location',
                            'Notifications',
                            'Storage',
                          ]),
                          _p(
                            'Camera access may be used for employee selfies, face recognition, site photos and document capture.',
                          ),
                          _p(
                            'Location and background location permissions may be used for GPS tracking, geofencing, route history, attendance verification and field workforce management.',
                          ),
                          _p(
                            'Notifications may be used for attendance alerts, task updates, announcements, shift reminders and system messages.',
                          ),
                          _p(
                            'Storage access may be used to upload, access or manage documents, photos and files within the app.',
                          ),
                          _h('6. How We Use Personal Data'),
                          _p(
                            'We process personal data for the following purposes:',
                          ),
                          _bullets(const [
                            'To provide and operate Teamital',
                            'To create and manage business accounts',
                            'To enable employee login and authentication',
                            'To record attendance and working hours',
                            'To support GPS tracking, geofencing and route history',
                            'To manage shifts, leave, projects, tasks and payroll reports',
                            'To send announcements, reminders and notifications',
                            'To provide customer support',
                            'To process payments and subscriptions',
                            'To maintain platform security',
                            'To detect errors, crashes, misuse or unauthorised access',
                            'To improve the platform and user experience',
                            'To comply with legal, accounting and regulatory obligations',
                          ]),
                          _h('7. Lawful Basis for Processing'),
                          _p(
                            'Where GDPR applies, personal data is processed only where there is a lawful basis. Depending on the context, the lawful basis may include:',
                          ),
                          _bullets(const [
                            'Contract: where processing is necessary to provide the platform and services.',
                            'Legitimate Interests: where processing is necessary for platform security, business operations, service improvement, fraud prevention and customer support.',
                            'Legal Obligation: where processing is necessary to meet tax, accounting, regulatory or legal requirements.',
                            'Consent: where required, such as for certain cookies, analytics, permissions or optional features.',
                          ]),
                          _p(
                            'Employers using Teamital are responsible for determining the lawful basis for monitoring their employees, including attendance tracking, GPS tracking, geofencing and biometric-related features.',
                          ),
                          _h('8. Biometric and Face Recognition Data'),
                          _p(
                            'Teamital may support face recognition or fingerprint-based attendance features where enabled by the employer.',
                          ),
                          _p(
                            'Where biometric data is processed for identification or attendance verification, employers must ensure they have a valid lawful basis and meet any additional legal requirements under GDPR and applicable employment laws.',
                          ),
                          _p(
                            'Employers should provide clear notices to employees, explain how biometric-related data is used, and offer alternatives where legally required.',
                          ),
                          _h('9. Payments'),
                          _p(
                            'Payments may be processed through third-party payment providers, including Stripe and Revolut.',
                          ),
                          _p(
                            'We do not intentionally store full payment card details on our own systems. Payment providers may process payment information according to their own privacy and security policies.',
                          ),
                          _h('10. Third-Party Services'),
                          _p(
                            'We use trusted third-party services to operate, secure and improve Teamital. These may include:',
                          ),
                          _bullets(const [
                            'Amazon Web Services (AWS)',
                            'Supabase',
                            'Stripe',
                            'Revolut',
                            'Firebase',
                            'Google Maps',
                            'Google Analytics',
                            'Cloudflare',
                            'Resend',
                            'Firebase Crashlytics',
                          ]),
                          _p(
                            'These providers may process limited personal data where necessary to provide hosting, database services, payments, maps, analytics, crash reporting, email delivery, security and infrastructure support.',
                          ),
                          _h('11. Hosting and Data Storage'),
                          _p(
                            'Teamital is hosted using Amazon Web Services (AWS) with server infrastructure located in Ireland / Europe.',
                          ),
                          _p(
                            'We also use Supabase as part of our database infrastructure.',
                          ),
                          _p(
                            'We take reasonable steps to store personal data securely and to protect it from unauthorised access, loss, misuse, alteration or disclosure.',
                          ),
                          _h('12. Analytics and Crash Reporting'),
                          _p(
                            'We use Google Analytics to understand website and platform usage, improve performance and enhance user experience.',
                          ),
                          _p(
                            'We use Firebase Crashlytics to identify crashes, bugs and technical issues within the application.',
                          ),
                          _p(
                            'Analytics and crash reporting data may include device information, usage data, crash logs, app version, operating system and technical diagnostic information.',
                          ),
                          _h('13. Cookies and Similar Technologies'),
                          _p(
                            'Our website and platform may use cookies and similar technologies for:',
                          ),
                          _bullets(const [
                            'Essential website functionality',
                            'Login sessions',
                            'Security',
                            'Analytics',
                            'Performance improvement',
                            'User preferences',
                          ]),
                          _p(
                            'Where required by law, we will request consent before using non-essential cookies or analytics technologies.',
                          ),
                          _h('14. Data Security'),
                          _p(
                            'We use technical and organisational measures to protect personal data, including:',
                          ),
                          _bullets(const [
                            'HTTPS/TLS encryption',
                            'Database encryption',
                            'Password hashing',
                            'Role-based access control',
                            'Audit logs',
                            'Regular backups',
                            'Firewall protection',
                            'Multi-factor authentication for administrators',
                            'Secure hosting infrastructure',
                            'Restricted internal access',
                          ]),
                          _p(
                            'No online platform can guarantee absolute security. Users and customers are responsible for keeping account credentials confidential and notifying us if they suspect unauthorised access.',
                          ),
                          _h('15. Data Retention'),
                          _p(
                            'We retain personal data only for as long as necessary for the purposes described in this Privacy Policy, unless a longer period is required by law.',
                          ),
                          _p('Our retention approach includes:'),
                          _bullets(const [
                            'Employee records are stored securely.',
                            'Attendance logs are stored securely.',
                            'GPS history is stored securely.',
                            'Deleted accounts may be retained for a limited period as required by policy, legal obligations, backups, dispute resolution or fraud prevention.',
                            'Backups are maintained regularly and securely.',
                          ]),
                          _p(
                            'Business customers are responsible for defining appropriate retention periods for employee monitoring data where they act as Data Controller.',
                          ),
                          _h('16. International Data Transfers'),
                          _p(
                            'Our main hosting infrastructure is located in Ireland / Europe.',
                          ),
                          _p(
                            'Some third-party service providers may process data outside the European Economic Area. Where this happens, we rely on appropriate safeguards such as standard contractual clauses, adequacy decisions or other lawful transfer mechanisms required by GDPR.',
                          ),
                          _h('17. User Rights'),
                          _p(
                            'Under GDPR, individuals may have the following rights:',
                          ),
                          _bullets(const [
                            'Right to access personal data',
                            'Right to correct inaccurate data',
                            'Right to request deletion',
                            'Right to restrict processing',
                            'Right to object to processing',
                            'Right to data portability',
                            'Right to withdraw consent, where processing is based on consent',
                            'Right to lodge a complaint with a supervisory authority',
                          ]),
                          _p(
                            'Employees should normally contact their employer first because the employer is usually the Data Controller of workforce, attendance, GPS and monitoring records.',
                          ),
                          _p(
                            'Users may also contact us at $_privacyEmail.',
                          ),
                          _h('18. Data Export, Correction and Deletion'),
                          _p(
                            'Teamital supports user rights such as:',
                          ),
                          _bullets(const [
                            'Exporting data',
                            'Deleting accounts',
                            'Requesting correction of personal data',
                            'Downloading attendance reports',
                          ]),
                          _p(
                            'Requests may be subject to identity verification, legal obligations, backup limitations and the employer’s role as Data Controller.',
                          ),
                          _h('19. Children’s Privacy'),
                          _p(
                            'Teamital is intended only for business and workplace use.',
                          ),
                          _p(
                            'The minimum age to use the platform is 18 years. We do not knowingly provide the platform directly to children.',
                          ),
                          _h('20. Employer Responsibilities'),
                          _p(
                            'Employers using Teamital must:',
                          ),
                          _bullets(const [
                            'Use the platform lawfully and fairly',
                            'Inform employees before monitoring begins',
                            'Explain what data is collected and why',
                            'Avoid excessive or unnecessary monitoring',
                            'Limit GPS and background location tracking to legitimate business purposes',
                            'Maintain internal employee privacy and monitoring policies',
                            'Respond to employee data rights requests',
                            'Conduct a Data Protection Impact Assessment where required',
                            'Ensure appropriate access controls for managers and administrators',
                          ]),
                          _h('21. Data Breach Notification'),
                          _p(
                            'If we become aware of a personal data breach, we will investigate and take appropriate action.',
                          ),
                          _p(
                            'Where required by law, we will notify affected customers, individuals or regulators within applicable legal timeframes.',
                          ),
                          _p(
                            'Where we act as a Data Processor, we will notify the relevant customer without undue delay after becoming aware of a breach affecting their personal data.',
                          ),
                          _h('22. Data Protection Officer'),
                          _p(
                            'Teamital has not appointed a Data Protection Officer.',
                          ),
                          _p(
                            'Privacy questions and data protection enquiries may be sent to:',
                          ),
                          _p(_privacyEmail),
                          _h('23. Changes to This Privacy Policy'),
                          _p(
                            'We may update this Privacy Policy from time to time. When we make changes, we will update the “Last Updated” date at the top of this page.',
                          ),
                          _p(
                            'Material changes may also be communicated through the website, platform or email where appropriate.',
                          ),
                          _h('24. Contact Us'),
                          _p(
                            'If you have any questions about this Privacy Policy or how we handle personal data, please contact us:',
                          ),
                          _p('Teamital'),
                          _p(
                            'Kandoy House, 2 Fairview Strand,\nClontarf West, Dublin, D03 R8P3,\nIreland',
                          ),
                          _p('Email: $_privacyEmail'),
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
