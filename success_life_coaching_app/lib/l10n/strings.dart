import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;
import 'package:flutter/widgets.dart';
import 'package:provider/provider.dart';
import 'package:success_life_coaching_app/providers/language_provider.dart';

/// App languages, in the same order as the website's LanguageSwitcher.
class AppLanguage {
  final String code;
  final String label; // native name
  final String hint; // English name
  final String flag;

  const AppLanguage(this.code, this.label, this.hint, this.flag);
}

const List<AppLanguage> appLanguages = [
  AppLanguage('ti', 'ትግርኛ', 'Tigrinya', '🇪🇹'),
  AppLanguage('am', 'አማርኛ', 'Amharic', '🇪🇹'),
  AppLanguage('en', 'English', 'English', '🇬🇧'),
];

AppLanguage languageFor(String code) => appLanguages
    .firstWhere((l) => l.code == code, orElse: () => appLanguages.last);

/// UI strings. Keys follow the website's lang/*.json naming (nav.*, lang.*).
const Map<String, Map<String, String>> _strings = {
  'en': {
    'app.name': 'Success Life Coaching',
    'app.academy': 'Academy',
    'menu.title': 'Menu',
    'menu.account': 'My Account',
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.courses': 'Courses',
    'nav.seminars': 'Seminars',
    'nav.reels': 'Reels',
    'nav.testimonials': 'Testimonials',
    'nav.live': 'Live',
    'nav.new': 'New',
    'nav.dashboard': 'My Dashboard',
    'nav.profile': 'Profile',
    'nav.logout': 'Log Out',
    'lang.label': 'Language',
    'common.see_all': 'See all',
    'common.retry': 'Try again',
    'common.load_failed': 'Could not load this page.',
    'home.welcome': 'Welcome',
    'home.subtitle': 'Continue your learning journey',
    'home.popular': 'Popular Courses',
    'home.seminars': 'Upcoming Seminars',
    'courses.empty': 'No courses available',
    'seminars.empty': 'No seminars available right now',
    'testimonials.empty': 'No testimonials yet',
    'reels.empty': 'No reels yet',
    'reels.view_course': 'View course',
    'layout.login': 'Login',
    'layout.join_free': 'Join Free',
    'layout.academy': 'Coaching Academy',
    'layout.public_menus': 'Public Menus',
    'layout.direct_payment': 'Direct Payment Support',
    'layout.go_dashboard': 'Go to My Dashboard',
    'layout.change_profile': 'Change Profile / Password',
    'tab.reviews': 'Reviews',
    'tab.menu': 'Menu',
  },
  'am': {
    'app.name': 'ሰክሰስ ላይፍ ኮቺንግ',
    'app.academy': 'አካዳሚ',
    'menu.title': 'ምናሌ',
    'menu.account': 'የእኔ መለያ',
    'nav.home': 'መነሻ',
    'nav.about': 'ስለ እኛ',
    'nav.courses': 'ኮርሶች',
    'nav.seminars': 'ሴሚናሮች',
    'nav.reels': 'ሪልስ',
    'nav.testimonials': 'ምስክርነቶች',
    'nav.live': 'ቀጥታ',
    'nav.new': 'አዲስ',
    'nav.dashboard': 'የእኔ ዳሽቦርድ',
    'nav.profile': 'መገለጫ',
    'nav.logout': 'ውጣ',
    'lang.label': 'ቋንቋ',
    'common.see_all': 'ሁሉንም ይመልከቱ',
    'common.retry': 'እንደገና ይሞክሩ',
    'common.load_failed': 'ገጹን መጫን አልተቻለም።',
    'home.welcome': 'እንኳን ደህና መጡ',
    'home.subtitle': 'የትምህርት ጉዞዎን ይቀጥሉ',
    'home.popular': 'ተወዳጅ ኮርሶች',
    'home.seminars': 'መጪ ሴሚናሮች',
    'courses.empty': 'ምንም ኮርስ የለም',
    'seminars.empty': 'በአሁኑ ጊዜ ሴሚናር የለም',
    'testimonials.empty': 'እስካሁን ምስክርነቶች የሉም',
    'reels.empty': 'እስካሁን ሪልስ የሉም',
    'reels.view_course': 'ኮርሱን ይመልከቱ',
    'layout.login': 'ግባ',
    'layout.join_free': 'በነጻ ይቀላቀሉ',
    'layout.academy': 'ኮቺንግ አካዳሚ',
    'layout.public_menus': 'ዋና ምናሌዎች',
    'layout.direct_payment': 'ቀጥታ የክፍያ ድጋፍ',
    'layout.go_dashboard': 'ወደ ዳሽቦርዴ ሂድ',
    'layout.change_profile': 'መገለጫ / የይለፍ ቃል ቀይር',
    'tab.reviews': 'ግምገማዎች',
    'tab.menu': 'ምናሌ',
  },
  'ti': {
    'app.name': 'ሰክሰስ ላይፍ ኮቺንግ',
    'app.academy': 'ኣካዳሚ',
    'menu.title': 'ዝርዝር',
    'menu.account': 'ሕሳበይ',
    'nav.home': 'መበገሲ',
    'nav.about': 'ብዛዕባና',
    'nav.courses': 'ኮርሳት',
    'nav.seminars': 'ሰሚናራት',
    'nav.reels': 'ሪልስ',
    'nav.testimonials': 'ምስክርነት',
    'nav.live': 'ቀጥታ',
    'nav.new': 'ሓድሽ',
    'nav.dashboard': 'ዳሽቦርደይ',
    'nav.profile': 'ፕሮፋይል',
    'nav.logout': 'ውጻእ',
    'lang.label': 'ቋንቋ',
    'common.see_all': 'ኩሉ ርአ',
    'common.retry': 'እንደገና ፈትን',
    'common.load_failed': 'እዚ ገጽ ክጽዓን ኣይከኣለን።',
    'home.welcome': 'እንቋዕ ብደሓን መጻእኩም',
    'home.subtitle': 'ጉዕዞ ትምህርትኹም ቀጽሉ',
    'home.popular': 'ተፈተውቲ ኮርሳት',
    'home.seminars': 'ዝመጹ ሰሚናራት',
    'courses.empty': 'ዝኾነ ኮርስ የለን',
    'seminars.empty': 'ኣብዚ እዋን ሰሚናር የለን',
    'testimonials.empty': 'ክሳብ ሕጂ ምስክርነት የለን',
    'reels.empty': 'ክሳብ ሕጂ ሪልስ የለን',
    'reels.view_course': 'ኮርስ ርአ',
    'layout.login': 'እቶ',
    'layout.join_free': 'ብነጻ ተጸንበሩ',
    'layout.academy': 'ኮቺንግ ኣካዳሚ',
    'layout.public_menus': 'ቀንዲ ዝርዝራት',
    'layout.direct_payment': 'ቀጥታ ደገፍ ክፍሊት',
    'layout.go_dashboard': 'ናብ ዳሽቦርደይ ኺድ',
    'layout.change_profile': 'ፕሮፋይል / ፓስዎርድ ቀይር',
    'tab.reviews': 'ርእይቶታት',
    'tab.menu': 'ዝርዝር',
  },
};

/// Look up [key] for [languageCode], falling back to English, then the key.
String translate(String key, String languageCode) =>
    _strings[languageCode]?[key] ?? _strings['en']![key] ?? key;

/// The website's own translation files (lang/*.json, bundled in assets/lang).
final Map<String, Map<String, String>> _web = {};

/// Load the website translations. Call once at startup.
Future<void> loadWebsiteStrings() async {
  for (final code in const ['en', 'am', 'ti']) {
    try {
      final raw = await rootBundle.loadString('assets/lang/$code.json');
      final decoded = jsonDecode(raw) as Map<String, dynamic>;
      _web[code] = decoded.map((k, v) => MapEntry(k, '$v'));
    } catch (_) {
      _web[code] = const {};
    }
  }
}

/// Website-style `t(key, fallback)`: app override -> website lang file -> fallback.
String translateWeb(String key, String fallback, String languageCode) =>
    _strings[languageCode]?[key] ?? _web[languageCode]?[key] ?? fallback;

extension TranslateContext on BuildContext {
  /// Translate and rebuild this widget when the language changes.
  String tr(String key) =>
      translate(key, watch<LanguageProvider>().languageCode);

  /// Same as the website's useT(): `t('home.hero_title', 'Transform your...')`.
  String t(String key, String fallback) =>
      translateWeb(key, fallback, watch<LanguageProvider>().languageCode);
}
