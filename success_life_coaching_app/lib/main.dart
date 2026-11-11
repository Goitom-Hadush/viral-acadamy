import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'config/api_config.dart';
import 'theme/tw.dart';
import 'l10n/strings.dart';
import 'providers/auth_provider.dart';
import 'providers/language_provider.dart';
import 'providers/course_provider.dart';
import 'providers/seminar_provider.dart';
import 'screens/splash_screen.dart';
import 'screens/auth/login_screen.dart';
import 'screens/auth/register_screen.dart';
import 'screens/home/home_screen.dart';
import 'screens/courses/courses_list_screen.dart';
import 'screens/courses/course_detail_screen.dart';
import 'screens/courses/learn_screen.dart';
import 'screens/seminars/seminars_list_screen.dart';
import 'screens/seminars/seminar_detail_screen.dart';
import 'screens/dashboard/student_dashboard_screen.dart';
import 'screens/profile/profile_screen.dart';
import 'screens/content/about_screen.dart';
import 'screens/content/reels_screen.dart';
import 'screens/content/testimonials_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await ApiConfig.initialize();
  await loadWebsiteStrings();
  runApp(const MyApp());
}

/// Root widget: only creates the providers.
/// The MaterialApp lives in a child widget so it can read them.
class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => LanguageProvider()),
        ChangeNotifierProvider(create: (_) => CourseProvider()),
        ChangeNotifierProvider(create: (_) => SeminarProvider()),
      ],
      child: const AppView(),
    );
  }
}

class AppView extends StatefulWidget {
  const AppView({super.key});

  @override
  State<AppView> createState() => _AppViewState();
}

class _AppViewState extends State<AppView> {
  late final GoRouter _router;

  @override
  void initState() {
    super.initState();
    // Build the router once; re-run redirects whenever auth state changes.
    _router = _buildRouter(context.read<AuthProvider>());
  }

  @override
  void dispose() {
    _router.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // App text is translated by lib/l10n/strings.dart (context.tr). The
    // framework locale stays English because Flutter has no Tigrinya
    // MaterialLocalizations; setting it to 'ti' would break built-in widgets.
    return MaterialApp.router(
      title: 'Success Life Coaching',
      debugShowCheckedModeBanner: false,
      theme: buildAppTheme(),
      routerConfig: _router,
    );
  }

  /// Pages that need a logged-in student (everything else is public, like the website).
  static bool _needsLogin(String location) =>
      location == '/dashboard' ||
      location == '/profile' ||
      location.endsWith('/learn');

  GoRouter _buildRouter(AuthProvider auth) {
    return GoRouter(
      initialLocation: '/splash',
      refreshListenable: auth,
      routes: [
        GoRoute(
            path: '/splash', builder: (context, state) => const SplashScreen()),
        GoRoute(
          path: '/login',
          builder: (context, state) =>
              LoginScreen(from: state.uri.queryParameters['from']),
        ),
        GoRoute(
            path: '/register',
            builder: (context, state) => const RegisterScreen()),
        GoRoute(path: '/home', builder: (context, state) => const HomeScreen()),
        GoRoute(
            path: '/about', builder: (context, state) => const AboutScreen()),
        GoRoute(
            path: '/courses',
            builder: (context, state) => const CoursesListScreen()),
        GoRoute(
          path: '/courses/:id',
          builder: (context, state) =>
              CourseDetailScreen(courseId: state.pathParameters['id']!),
        ),
        GoRoute(
          path: '/courses/:id/learn',
          builder: (context, state) =>
              LearnScreen(courseId: state.pathParameters['id']!),
        ),
        GoRoute(
            path: '/seminars',
            builder: (context, state) => const SeminarsListScreen()),
        GoRoute(
          path: '/seminars/:id',
          builder: (context, state) =>
              SeminarDetailScreen(seminarId: state.pathParameters['id']!),
        ),
        GoRoute(
            path: '/reels', builder: (context, state) => const ReelsScreen()),
        GoRoute(
            path: '/testimonials',
            builder: (context, state) => const TestimonialsScreen()),
        GoRoute(
            path: '/dashboard',
            builder: (context, state) => const StudentDashboardScreen()),
        GoRoute(
            path: '/profile',
            builder: (context, state) => const ProfileScreen()),
      ],
      redirect: (context, state) {
        final location = state.matchedLocation;
        final onSplash = location == '/splash';
        final onAuthPage = location == '/login' || location == '/register';

        // Stay on splash until the saved session has been checked.
        if (!auth.isInitialized) return onSplash ? null : '/splash';
        if (onSplash) return '/home';

        if (!auth.isLoggedIn && _needsLogin(location)) {
          return Uri(
              path: '/login',
              queryParameters: {'from': state.uri.toString()}).toString();
        }

        if (auth.isLoggedIn && onAuthPage) {
          final from = state.uri.queryParameters['from'];
          return (from != null && from.startsWith('/')) ? from : '/dashboard';
        }

        return null;
      },
    );
  }
}
