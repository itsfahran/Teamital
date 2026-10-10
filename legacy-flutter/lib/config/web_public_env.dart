/// Public client config for Flutter **web** only.
///
/// Never put Stripe/Resend/OpenAI/Face++/service-role secrets here —
/// anything shipped to the browser is visible to users.
class WebPublicEnv {
  WebPublicEnv._();

  /// Contents loaded via [dotenv.loadFromString] so web does not need `/assets/.env`.
  static const dotenvContents = '''
SUPABASE_URL=https://eflactvgiuvuehpzkufy.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmbGFjdHZnaXV2dWVocHprdWZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMzY3NjksImV4cCI6MjA4ODcxMjc2OX0._6JMbwQfp9PIRFCq8hgtsELnQwZz5gKsa4deWjn1x0k
APP_NAME=Teamital
APP_PUBLIC_URL=https://teamital.com
APP_APP_URL=https://app.teamital.com
APP_MAIN_HOSTS=teamital.com,www.teamital.com
APP_APP_HOSTS=app.teamital.com
CONTACT_EMAIL=contact@teamital.com
RESEND_FROM_EMAIL=noreply@employeetracking.app
RESEND_FROM_NAME=Teamital
RESEND_REPLY_TO=contact@teamital.com
REVOLUT_PUBLIC_KEY=pk_K8V5wh0gES72eJTsLCXIMZPxeQ4EnUJcyW2OKRmKjs8qb
FACEPP_ACCEPT_CONFIDENCE=80
TRACKING_BASE_URL=https://web-production-0f5d1c.up.railway.app/api/tracking
GOOGLE_MAPS_API_KEY=AIzaSyDzAcj9cHXhNLMYWvwjt5sAeeQGBSiq0DA
''';
}
