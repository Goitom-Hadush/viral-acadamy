import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:success_life_coaching_app/config/api_config.dart';
import 'package:success_life_coaching_app/l10n/strings.dart';
import 'package:success_life_coaching_app/providers/auth_provider.dart';
import 'package:success_life_coaching_app/screens/auth/auth_shell.dart';
import 'package:success_life_coaching_app/theme/tw.dart';
import 'package:success_life_coaching_app/widgets/ui.dart';

/// Mirrors resources/js/Pages/Auth/Login.jsx.
class LoginScreen extends StatefulWidget {
  /// Where to return after login (e.g. the course the user was viewing)
  final String? from;
  const LoginScreen({super.key, this.from});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _login = TextEditingController();
  final _password = TextEditingController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance
        .addPostFrameCallback((_) => context.read<AuthProvider>().clearError());
  }

  @override
  void dispose() {
    _login.dispose();
    _password.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    FocusScope.of(context).unfocus();
    final auth = context.read<AuthProvider>();
    await auth.login(_login.text, _password.text);
    if (!mounted || !auth.isLoggedIn) return;
    final from = widget.from;
    context.go(from != null && from.startsWith('/') ? from : '/dashboard');
  }

  Future<void> _forgotPassword() async {
    final api = Uri.parse(ApiConfig.baseUrl);
    final url = api.replace(path: '/forgot-password');
    await launchUrl(url, mode: LaunchMode.externalApplication);
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    return AuthShell(
      currentRoute: '/login',
      child: AutofillGroup(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            AuthHeading(
              eyebrow: context.tr('login.welcome_back'),
              title: context.tr('login.subtitle'),
              subtitle: context.tr('login.desc'),
            ),
            if (auth.error != null) ...[
              const SizedBox(height: 20),
              ErrorBox([auth.error!]),
            ],
            const SizedBox(height: 28),
            AuthField(
              label: context.tr('login.email_or_phone'),
              icon: Icons.person_outline,
              hint: 'you@example.com',
              controller: _login,
              keyboardType: TextInputType.emailAddress,
              textInputAction: TextInputAction.next,
              autofillHints: const [
                AutofillHints.email,
                AutofillHints.telephoneNumber
              ],
            ),
            const SizedBox(height: 16),
            AuthField(
              label: context.t('form.password', 'Password'),
              icon: Icons.lock_outline,
              hint: '••••••••',
              controller: _password,
              obscure: true,
              textInputAction: TextInputAction.done,
              onSubmitted: (_) => _submit(),
              autofillHints: const [AutofillHints.password],
            ),
            Align(
              alignment: Alignment.centerRight,
              child: TextButton(
                onPressed: _forgotPassword,
                child: Text(context.tr('login.forgot_password'),
                    style: TwText.sans(14,
                        weight: FontWeight.w600, color: Tw.copper600)),
              ),
            ),
            const SizedBox(height: 8),
            AuthSubmitButton(
              label: auth.isLoading
                  ? context.tr('login.signing_in')
                  : context.t('auth.login', 'Log in'),
              loading: auth.isLoading,
              onPressed: _submit,
            ),
            const SizedBox(height: 24),
            Wrap(
              alignment: WrapAlignment.center,
              crossAxisAlignment: WrapCrossAlignment.center,
              children: [
                Text(context.tr('login.new_user'),
                    style: TwText.sans(14, color: Tw.slate500)),
                InkWell(
                  onTap: () => context.pushReplacement('/register'),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 6),
                    child: Text(context.tr('login.create_free'),
                        style: TwText.sans(14,
                            weight: FontWeight.w700, color: Tw.copper700)),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            const _TrustRow(),
          ],
        ),
      ),
    );
  }
}

class _TrustRow extends StatelessWidget {
  const _TrustRow();

  @override
  Widget build(BuildContext context) {
    final style = TwText.sans(12, color: Tw.slate400);
    return Wrap(
      alignment: WrapAlignment.center,
      spacing: 16,
      runSpacing: 6,
      children: [
        Row(mainAxisSize: MainAxisSize.min, children: [
          const Icon(Icons.shield_outlined, size: 16, color: Tw.slate400),
          const SizedBox(width: 4),
          Text(context.tr('trust.secure_login'), style: style),
        ]),
        Row(mainAxisSize: MainAxisSize.min, children: [
          const Icon(Icons.school_outlined, size: 16, color: Tw.slate400),
          const SizedBox(width: 4),
          Text(context.tr('trust.progress_saved'), style: style),
        ]),
      ],
    );
  }
}
