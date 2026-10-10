import 'dart:convert';

import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import 'package:web_teamital/app_colors.dart';
import 'package:web_teamital/config/site_config.dart';
import 'package:web_teamital/web/web_aos.dart';
import 'package:web_teamital/web/web_footer.dart';
import 'package:web_teamital/web/web_marketing_chrome.dart';
import 'package:web_teamital/web/web_routes.dart';
import 'package:web_teamital/web/web_toast.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:url_launcher/url_launcher.dart';

/// Public contact page — redesigned form + nodemailer/Resend submit + footer.
class WebContactPage extends StatefulWidget {
  const WebContactPage({super.key});

  @override
  State<WebContactPage> createState() => _WebContactPageState();
}

class _WebContactPageState extends State<WebContactPage> {
  final _formKey = GlobalKey<FormState>();
  final _name = TextEditingController();
  final _email = TextEditingController();
  final _company = TextEditingController();
  final _message = TextEditingController();
  bool _sending = false;

  @override
  void dispose() {
    _name.dispose();
    _email.dispose();
    _company.dispose();
    _message.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _sending = true);

    final name = _name.text.trim();
    final email = _email.text.trim();
    final company = _company.text.trim();
    final message = _message.text.trim();

    try {
      // 1) Nodemailer / custom API (server-side — works from browser).
      final api = (dotenv.env['CONTACT_API_URL'] ?? '').trim();
      if (api.isNotEmpty) {
        try {
          final res = await http
              .post(
                Uri.parse(api),
                headers: {'Content-Type': 'application/json'},
                body: jsonEncode({
                  'name': name,
                  'email': email,
                  'company': company,
                  'message': message,
                }),
              )
              .timeout(const Duration(seconds: 4));
          if (res.statusCode >= 200 && res.statusCode < 300) {
            if (!mounted) return;
            _onSent();
            return;
          }
        } catch (_) {
          // API offline — try next channel.
        }
      }

      // 2) Supabase table (no CORS issue from browser).
      try {
        await Supabase.instance.client.from('contact_messages').insert({
          'name': name,
          'email': email,
          'company': company.isEmpty ? null : company,
          'message': message,
          'source': kIsWeb ? 'web' : 'app',
        });
        if (!mounted) return;
        _onSent();
        return;
      } catch (_) {
        // Table may not exist yet.
      }

      // 3) Web fallback: open mail client if Supabase insert failed.
      final to = SiteConfig.contactEmail;
      final subject = Uri.encodeComponent('Contact from $name — Teamital');
      final body = Uri.encodeComponent(
        'Name: $name\nEmail: $email\nCompany: ${company.isEmpty ? '-' : company}\n\n$message',
      );
      final mailto = Uri.parse('mailto:$to?subject=$subject&body=$body');
      final launched = await launchUrl(mailto);
      if (!mounted) return;
      if (launched) {
        WebToast.success(
          context,
          'Opening your email app — send to finish.',
        );
        _clearForm();
      } else {
        WebToast.error(
          context,
          'Could not send. Email us at $to',
        );
      }
    } catch (e) {
      if (!mounted) return;
      WebToast.error(
        context,
        e.toString().replaceFirst(RegExp(r'^Exception:\s*'), ''),
      );
    } finally {
      if (mounted) setState(() => _sending = false);
    }
  }

  void _onSent() {
    WebToast.success(context, 'Message sent — we will reply soon.');
    _clearForm();
  }

  void _clearForm() {
    _formKey.currentState?.reset();
    _name.clear();
    _email.clear();
    _company.clear();
    _message.clear();
  }

  InputDecoration _dec(String label, IconData icon, {int maxLines = 1}) {
    return InputDecoration(
      labelText: label,
      prefixIcon: maxLines > 1
          ? Padding(
              padding: const EdgeInsets.only(bottom: 64),
              child: Icon(icon, size: 20, color: AppColors.primary),
            )
          : Icon(icon, size: 20, color: AppColors.primary),
      filled: true,
      fillColor: Colors.white,
      labelStyle: GoogleFonts.poppins(color: const Color(0xFF6B7280)),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: Color(0xFFE5E7EB)),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: AppColors.masterPrimary, width: 1.5),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: AppColors.error),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: AppColors.error, width: 1.5),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final w = MediaQuery.sizeOf(context).width;
    final compact = w < 900;
    final contact = SiteConfig.contactEmail;

    return Theme(
      data: ThemeData(
        brightness: Brightness.light,
        scaffoldBackgroundColor: const Color(0xFFF5F7FA),
        colorScheme: ColorScheme.fromSeed(
          seedColor: AppColors.primary,
          brightness: Brightness.light,
        ),
        useMaterial3: true,
      ),
      child: Scaffold(
        backgroundColor: const Color(0xFFF5F7FA),
        body: Column(
          children: [
            WebMarketingHeader(
              current: WebMarketingPage.contact,
              compact: compact,
              onHome: () => WebRoutes.goHome(context),
              onPricing: () => WebRoutes.replace(context, WebRoutes.pricing),
              onContact: () {},
              onSignIn: () => WebRoutes.push(context, WebRoutes.signIn),
              onSignUp: () => WebRoutes.push(context, WebRoutes.signUp),
            ),
            Expanded(
              child: SingleChildScrollView(
                child: Column(
                  children: [
                    Padding(
                      padding: EdgeInsets.fromLTRB(
                          compact ? 20 : 48, 40, compact ? 20 : 48, 24),
                      child: Center(
                        child: ConstrainedBox(
                          constraints: const BoxConstraints(maxWidth: 1040),
                          child: compact
                              ? Column(
                                  children: [
                                    WebAos(child: _intro(contact)),
                                    const SizedBox(height: 28),
                                    WebAos(
                                      delay: const Duration(milliseconds: 100),
                                      child: _formCard(),
                                    ),
                                  ],
                                )
                              : Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Expanded(
                                      flex: 5,
                                      child: WebAos(
                                        fromLeft: true,
                                        child: Column(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          children: [
                                            _intro(contact),
                                            const SizedBox(height: 32),
                                            SvgPicture.asset(
                                              'assets/undraw_questions_52ic.svg',
                                              height: 220,
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 40),
                                    Expanded(
                                      flex: 6,
                                      child: WebAos(
                                        fromRight: true,
                                        delay:
                                            const Duration(milliseconds: 100),
                                        child: _formCard(),
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
          ],
        ),
      ),
    );
  }

  Widget _intro(String contact) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: const Color(0xFFDBEAFE),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Text(
            'Mail us',
            style: GoogleFonts.poppins(
              fontSize: 12,
              fontWeight: FontWeight.w700,
              color: AppColors.primary,
            ),
          ),
        ),
        const SizedBox(height: 14),
        Text(
          'Contact us',
          style: GoogleFonts.poppins(
            fontSize: 36,
            fontWeight: FontWeight.w800,
            color: const Color(0xFF111827),
          ),
        ),
        const SizedBox(height: 10),
        Text(
          'Questions about plans, demos, or onboarding? Send a message — we will reply shortly.',
          style: GoogleFonts.poppins(
            fontSize: 15,
            height: 1.5,
            color: const Color(0xFF6B7280),
          ),
        ),
        const SizedBox(height: 22),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: const Color(0xFFE5E7EB)),
          ),
          child: Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: const Color(0xFFDBEAFE),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(Icons.mail_outline_rounded,
                    color: AppColors.masterPrimary),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Email',
                        style: GoogleFonts.poppins(
                            fontSize: 12, color: const Color(0xFF6B7280))),
                    Text(
                      contact,
                      style: GoogleFonts.poppins(
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                        color: const Color(0xFF111827),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _formCard() {
    return Container(
      padding: const EdgeInsets.all(28),
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAFC),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFFE5E7EB)),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withValues(alpha: 0.08),
            blurRadius: 28,
            offset: const Offset(0, 12),
          ),
        ],
      ),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'Send a message',
              style: GoogleFonts.poppins(
                fontSize: 20,
                fontWeight: FontWeight.w800,
                color: const Color(0xFF111827),
              ),
            ),
            const SizedBox(height: 6),
            Text(
              'We typically respond within one business day.',
              style: GoogleFonts.poppins(
                  fontSize: 13, color: const Color(0xFF6B7280)),
            ),
            const SizedBox(height: 22),
            TextFormField(
              controller: _name,
              textInputAction: TextInputAction.next,
              decoration: _dec('Your name', Icons.person_outline_rounded),
              validator: (v) =>
                  (v == null || v.trim().isEmpty) ? 'Name is required' : null,
            ),
            const SizedBox(height: 14),
            TextFormField(
              controller: _email,
              keyboardType: TextInputType.emailAddress,
              textInputAction: TextInputAction.next,
              decoration: _dec('Work email', Icons.email_outlined),
              validator: (v) {
                if (v == null || v.trim().isEmpty) return 'Email is required';
                if (!v.contains('@')) return 'Enter a valid email';
                return null;
              },
            ),
            const SizedBox(height: 14),
            TextFormField(
              controller: _company,
              textInputAction: TextInputAction.next,
              decoration: _dec('Company', Icons.apartment_rounded),
            ),
            const SizedBox(height: 14),
            TextFormField(
              controller: _message,
              maxLines: 5,
              decoration:
                  _dec('Message', Icons.chat_bubble_outline_rounded, maxLines: 5)
                      .copyWith(alignLabelWithHint: true),
              validator: (v) => (v == null || v.trim().length < 8)
                  ? 'Please write a short message'
                  : null,
            ),
            const SizedBox(height: 22),
            SizedBox(
              height: 52,
              child: DecoratedBox(
                decoration: BoxDecoration(
                  gradient: AppColors.primaryGradient,
                  borderRadius: BorderRadius.circular(14),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.primary.withValues(alpha: 0.35),
                      blurRadius: 16,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: ElevatedButton(
                  onPressed: _sending ? null : _submit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.transparent,
                    shadowColor: Colors.transparent,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                  child: _sending
                      ? const SizedBox(
                          width: 22,
                          height: 22,
                          child: CircularProgressIndicator(
                              strokeWidth: 2, color: Colors.white),
                        )
                      : Text(
                          'Submit message',
                          style: GoogleFonts.poppins(
                            fontWeight: FontWeight.w700,
                            color: Colors.white,
                            fontSize: 15,
                          ),
                        ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
