import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:success_life_coaching_app/l10n/strings.dart';
import 'package:success_life_coaching_app/providers/auth_provider.dart';
import 'package:success_life_coaching_app/screens/auth/auth_shell.dart';
import 'package:success_life_coaching_app/theme/tw.dart';
import 'package:success_life_coaching_app/widgets/ui.dart';

/// Mirrors resources/js/Pages/Auth/Register.jsx.
class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _name = TextEditingController();
  final _phone = TextEditingController();
  final _email = TextEditingController();
  final _password = TextEditingController();
  final _confirm = TextEditingController();
  String? _localError;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance
        .addPostFrameCallback((_) => context.read<AuthProvider>().clearError());
  }

  @override
  void dispose() {
    for (final c in [_name, _phone, _email, _password, _confirm]) {
      c.dispose();
    }
    super.dispose();
  }

  Future<void> _submit() async {
    FocusScope.of(context).unfocus();
    if (_password.text != _confirm.text) {
      setState(() => _localError = context.tr('register.passwords_mismatch'));
      return;
    }
    setState(() => _localError = null);

    final auth = context.read<AuthProvider>();
    await auth.register(
      name: _name.text,
      phone: _phone.text,
      email: _email.text,
      password: _password.text,
    );
    if (mounted && auth.isLoggedIn) context.go('/dashboard');
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final error = _localError ?? auth.error;

    return AuthShell(
      currentRoute: '/register',
      child: AutofillGroup(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            AuthHeading(
              eyebrow: context.tr('register.create_account'),
              title: context.tr('register.journey_title'),
              subtitle: context.tr('register.journey_desc'),
            ),
            if (error != null) ...[
              const SizedBox(height: 20),
              ErrorBox([error]),
            ],
            const SizedBox(height: 28),
            AuthField(
              label: context.t('form.full_name', 'Full Name'),
              icon: Icons.person_outline,
              hint: context.tr('form.full_name'),
              controller: _name,
              textInputAction: TextInputAction.next,
              autofillHints: const [AutofillHints.name],
            ),
            const SizedBox(height: 16),
            AuthField(
              label: context.t('form.phone', 'Phone Number'),
              icon: Icons.phone_outlined,
              hint: '09XXXXXXXX',
              controller: _phone,
              keyboardType: TextInputType.phone,
              textInputAction: TextInputAction.next,
              autofillHints: const [AutofillHints.telephoneNumber],
            ),
            const SizedBox(height: 16),
            AuthField(
              label:
                  '${context.t('form.email', 'Email')} ${context.t('form.optional', '(optional)')}',
              icon: Icons.mail_outline,
              hint: 'you@example.com',
              controller: _email,
              keyboardType: TextInputType.emailAddress,
              textInputAction: TextInputAction.next,
              autofillHints: const [AutofillHints.email],
            ),
            const SizedBox(height: 16),
            AuthField(
              label: context.t('form.password', 'Password'),
              icon: Icons.lock_outline,
              hint: context.t('form.password_hint', 'At least 8 characters'),
              controller: _password,
              obscure: true,
              textInputAction: TextInputAction.next,
              autofillHints: const [AutofillHints.newPassword],
            ),
            const SizedBox(height: 16),
            AuthField(
              label: context.tr('register.reenter_password'),
              icon: Icons.lock_outline,
              hint: '••••••••',
              controller: _confirm,
              obscure: true,
              textInputAction: TextInputAction.done,
              onSubmitted: (_) => _submit(),
            ),
            const SizedBox(height: 24),
            AuthSubmitButton(
              label: auth.isLoading
                  ? context.tr('register.creating')
                  : context.tr('register.create_account'),
              loading: auth.isLoading,
              onPressed: _submit,
            ),
            const SizedBox(height: 24),
            Wrap(
              alignment: WrapAlignment.center,
              crossAxisAlignment: WrapCrossAlignment.center,
              children: [
                Text(context.tr('register.already_member'),
                    style: TwText.sans(14, color: Tw.slate500)),
                InkWell(
                  onTap: () => context.pushReplacement('/login'),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 6),
                    child: Text(context.tr('register.sign_in_instead'),
                        style: TwText.sans(14,
                            weight: FontWeight.w700, color: Tw.copper700)),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
