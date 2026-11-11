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
  AppLanguage('ti', 'ትግርኛ', 'Tigrinya', '🇪🇷'),
  AppLanguage('am', 'አማርኛ', 'Amharic', '🇪🇹'),
  AppLanguage('en', 'English', 'English', '🇬🇧'),
];

AppLanguage languageFor(String code) => appLanguages
    .firstWhere((l) => l.code == code, orElse: () => appLanguages.last);

/// UI strings. Keys follow the website's lang/*.json naming (nav.*, lang.*).
const Map<String, Map<String, String>> _strings = {
  'en': {
    // ── App / nav ────────────────────────────────────────────────────────────
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
    // ── Common ───────────────────────────────────────────────────────────────
    'common.see_all': 'See all',
    'common.retry': 'Try again',
    'common.load_failed': 'Could not load this page.',
    // ── Home ─────────────────────────────────────────────────────────────────
    'home.welcome': 'Welcome',
    'home.subtitle': 'Continue your learning journey',
    'home.popular': 'Popular Courses',
    'home.seminars': 'Upcoming Seminars',
    'home.badge': "ETHIOPIA'S PREMIER LEADERSHIP & COACHING ACADEMY",
    'home.hero_title':
        'Transform your mindset, master high-value skills & build real success.',
    'home.hero_sub':
        'Learn from accredited mentors through focused, high-definition video masterclasses. Designed for ambitious professionals, creators, and leaders across Ethiopia.',
    'home.explore_courses': 'Explore All Courses →',
    'home.reserve_seminar': 'Live Seminars',
    'home.search_placeholder': 'Search programs, topics, coaches...',
    'home.all_programs': 'All Programs',
    'home.why_choose': 'Why ambitious people learn here',
    'home.faq_title': 'Frequently Asked Questions',
    // ── Courses section ───────────────────────────────────────────────────────
    'courses.empty': 'No courses available',
    'courses.section_eyebrow': 'Academy catalog',
    'courses.section_title': 'Featured coaching programs',
    'courses.section_sub':
        'High-impact video programs with lessons you can use the same day.',
    'no_match_title': 'No programs match your search',
    'no_match_sub':
        'Try adjusting your keyword or switch category filters.',
    'reset_filters': 'Reset Filters',
    // ── Seminars ─────────────────────────────────────────────────────────────
    'seminars.empty': 'No seminars available right now',
    // ── Value pillars ─────────────────────────────────────────────────────────
    'pillars.eyebrow': 'The academy advantage',
    'pillars.title': 'Why ambitious people learn here',
    // ── How it works ──────────────────────────────────────────────────────────
    'how.eyebrow': 'Three calm steps',
    'how.title': 'From payment to a verified certificate',
    // ── Testimonials ──────────────────────────────────────────────────────────
    'testimonials.empty': 'No testimonials yet',
    'testimonials.eyebrow': 'Student stories',
    'testimonials.title': 'Loved by learners across Ethiopia',
    'testimonials.sub':
        'Graduates who changed their confidence, career, and income.',
    // ── Reels ─────────────────────────────────────────────────────────────────
    'reels.empty': 'No reels yet',
    'reels.view_course': 'View course',
    // ── Layout ───────────────────────────────────────────────────────────────
    'layout.login': 'Login',
    'layout.join_free': 'Join Free',
    'layout.academy': 'Coaching Academy',
    'layout.public_menus': 'Public Menus',
    'layout.direct_payment': 'Direct Payment Support',
    'layout.go_dashboard': 'Go to My Dashboard',
    'layout.change_profile': 'Change Profile / Password',
    // ── Tabs ─────────────────────────────────────────────────────────────────
    'tab.reviews': 'Reviews',
    'tab.menu': 'Menu',
    // ── CTA / Final ───────────────────────────────────────────────────────────
    'cta.begin_transformation': 'BEGIN YOUR TRANSFORMATION',
    'cta.ready_title':
        'Ready to build real success and unlock your potential?',
    'cta.ready_sub':
        'Join graduates across Ethiopia who are mastering high-income skills and a stronger executive mindset.',
    'cta.get_started': 'Get started free →',
    // ── Quick resume ─────────────────────────────────────────────────────────
    'continue_learning': 'CONTINUE LEARNING',
    'pick_up_where': 'Pick up where you left off',
    'lessons_count': 'lessons •',
    'resume': 'Resume →',
    // ── Featured masterclass card ─────────────────────────────────────────────
    'featured_masterclass': 'FEATURED MASTERCLASS',
    'featured_title': 'Empowering Leaders & Creators',
    'featured_desc':
        "Master personal discipline, earn online income, and build lasting success with Ethiopia's premier coaching team.",
    'featured_cbe': '✓ Instant CBE & Telebirr',
    'featured_access': '✓ 100% Lifetime Access',
    // ── Stats ─────────────────────────────────────────────────────────────────
    'stat.rating': 'Student rating',
    'stat.graduates': 'Graduates',
    'stat.access': 'Full access',
    // ── Footer ───────────────────────────────────────────────────────────────
    'footer.platform_nav': 'PLATFORM NAVIGATION',
    'footer.about': 'About Success Life',
    'footer.courses_link': 'Courses & Masterclasses',
    'footer.seminars_link': '🏛️ Live Seminars & Summits',
    'footer.reels_link': 'Video Reels',
    'footer.testimonials_link': 'Student Testimonials',
    'footer.developed_by': 'Developed by',
    'footer.about_text':
        "Ethiopia's premier coaching and online learning platform. Empowering ambitious individuals with transformative mindset, leadership, and income-generating skills.",
    'footer.rights': 'All rights reserved.',
    'footer.motto':
        'Empowering Minds, Transforming Futures in Ethiopia & Beyond.',
    // ── Auth ─────────────────────────────────────────────────────────────────
    'auth.login': 'Log In',
    'auth.register': 'Register',
    'auth.create_account': 'Create Free Account',
    'login.welcome_back': 'Welcome back',
    'login.subtitle': 'Log in to continue learning',
    'login.desc':
        'Access your coaching programs, lessons, and progress from your personal dashboard.',
    'login.email_or_phone': 'Email or Phone Number',
    'login.forgot_password': 'Forgot your password?',
    'login.new_user': 'New to Success Life Coaching? ',
    'login.create_free': 'Create a free account',
    'login.signing_in': 'Signing in…',
    'register.create_account': 'Create account',
    'register.journey_title': 'Start your personal growth journey',
    'register.journey_desc':
        'Join Success Life Coaching to unlock premium masterclasses, track milestones, and access your personal dashboard.',
    'register.reenter_password': 'Re-enter your password',
    'register.already_member': 'Already a member? ',
    'register.sign_in_instead': 'Sign in instead',
    'register.creating': 'Creating account…',
    'register.passwords_mismatch': 'Passwords do not match.',
    'back_to_home': '← Back to homepage',
    // ── Trust row ────────────────────────────────────────────────────────────
    'trust.secure_login': 'Secure login',
    'trust.progress_saved': 'Your progress is saved',
    // ── Splash ───────────────────────────────────────────────────────────────
    'splash.tagline': 'Transforming Minds • Building Futures',
    // ── Form labels ──────────────────────────────────────────────────────────
    'form.full_name': 'Full Name',
    'form.phone': 'Phone Number',
    'form.email': 'Email',
    'form.password': 'Password',
    'form.password_hint': 'At least 8 characters',
    'form.optional': '(optional)',
    'form.confirm_password': 'Confirm Password',
    // ── Sponsors ─────────────────────────────────────────────────────────────
    'sponsors.trusted': 'TRUSTED BY LEADING ETHIOPIAN INSTITUTIONS & PARTNERS',
    // ── FAQ ──────────────────────────────────────────────────────────────────
    'faq.eyebrow': 'Questions',
    'faq.how_access.q':
        'How do I access my coaching courses after payment?',
    'faq.how_access.a':
        'Once you transfer the course tuition via CBE or Telebirr and upload your payment receipt screenshot, our system approves your enrollment and unlocks immediate 6-month access to all lessons in your student dashboard.',
    'faq.mobile.q': 'Can I watch lessons on my mobile phone?',
    'faq.mobile.a':
        'Yes! The entire platform is built mobile-first for Ethiopia. You can stream seamlessly on mobile browsers with data-optimized video playback, or download our official Android app directly.',
    'faq.duration.q': 'How long do I get access to the courses I purchase?',
    'faq.duration.a':
        'All course enrollments include full 6-month streaming access from the moment of purchase approval. You can watch anytime, learn at your own pace, and re-watch key lessons.',
    'faq.cert.q': 'Do I receive a certificate of completion?',
    'faq.cert.a':
        'Yes! Upon completing all lessons in a course, you will be issued a verified Success Life Coaching completion certificate to showcase on your CV, portfolio, or LinkedIn.',
    'faq.app.q': 'How do I download the Android app?',
    'faq.app.a':
        'Tap the "Android" button on the banner at the top of the homepage or use the download link in the footer to get the official APK directly onto your phone.',
  },

  'am': {
    // ── App / nav ────────────────────────────────────────────────────────────
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
    // ── Common ───────────────────────────────────────────────────────────────
    'common.see_all': 'ሁሉንም ይመልከቱ',
    'common.retry': 'እንደገና ይሞክሩ',
    'common.load_failed': 'ገጹን መጫን አልተቻለም።',
    // ── Home ─────────────────────────────────────────────────────────────────
    'home.welcome': 'እንኳን ደህና መጡ',
    'home.subtitle': 'የትምህርት ጉዞዎን ይቀጥሉ',
    'home.popular': 'ተወዳጅ ኮርሶች',
    'home.seminars': 'መጪ ሴሚናሮች',
    'home.badge': 'የኢትዮጵያ ቀዳሚ የሪደርሺፕ እና ኮቺንግ አካዳሚ',
    'home.hero_title':
        'አስተሳሰብዎን ይቀይሩ፣ ከፍተኛ ዋጋ ያላቸው ክህሎቶችን ያካብዱ፣ እውነተኛ ስኬት ይፍጠሩ።',
    'home.hero_sub':
        'ጥቅሙን ከሚያስረዱ አሰልጣኞች፣ ትኩረት ያላቸው ከፍተኛ-ጥራት ያለው ቪዲዮ ማስተርክላሶች ይማሩ። ለኢትዮጵያ ምኞት ያላቸው ባለሙያዎች፣ ፈጣሪዎች እና መሪዎች የተዘጋጀ።',
    'home.explore_courses': 'ሁሉንም ኮርሶች ያስሱ →',
    'home.reserve_seminar': 'ቀጥታ ሴሚናሮች',
    'home.search_placeholder': 'ፕሮግራሞችን፣ ርዕሰ-ጉዳዮችን፣ አሰልጣኞችን ይፈልጉ...',
    'home.all_programs': 'ሁሉም ፕሮግራሞች',
    'home.why_choose': 'ምኞት ያላቸው ሰዎች ለምን እዚህ ይማሩ',
    'home.faq_title': 'ብዙ ጊዜ የሚጠየቁ ጥያቄዎች',
    // ── Courses section ───────────────────────────────────────────────────────
    'courses.empty': 'ምንም ኮርስ የለም',
    'courses.section_eyebrow': 'የአካዳሚ ካታሎግ',
    'courses.section_title': 'ተለዩ ኮቺንግ ፕሮግራሞች',
    'courses.section_sub': 'ተጽዕኖ ፈጣሪ ቪዲዮ ፕሮግራሞች ትምህርቶቻቸውን ወዲያው ሊጠቀሙ ይችላሉ።',
    'no_match_title': 'ምንም ፕሮግራሞች ፍለጋዎን አያሟሉም',
    'no_match_sub': 'ቁልፍ ቃሉን ያስተካክሉ ወይም የምድብ ማጣሪያ ቀይሩ።',
    'reset_filters': 'ማጣሪያዎችን ዳግም ያስጀምሩ',
    // ── Seminars ─────────────────────────────────────────────────────────────
    'seminars.empty': 'በአሁኑ ጊዜ ሴሚናር የለም',
    // ── Value pillars ─────────────────────────────────────────────────────────
    'pillars.eyebrow': 'የአካዳሚ ጥቅም',
    'pillars.title': 'ምኞት ያላቸው ሰዎች ለምን እዚህ ይማሩ',
    // ── How it works ──────────────────────────────────────────────────────────
    'how.eyebrow': 'ሦስት ቀላል ደረጃዎች',
    'how.title': 'ከክፍያ እስከ የተረጋገጠ ሰርተፊኬት',
    // ── Testimonials ──────────────────────────────────────────────────────────
    'testimonials.empty': 'እስካሁን ምስክርነቶች የሉም',
    'testimonials.eyebrow': 'የተማሪ ታሪኮች',
    'testimonials.title': 'በኢትዮጵያ ሁሉ ያሉ ተማሪዎች ወደዳቸው',
    'testimonials.sub': 'እምነታቸውን፣ ሙያቸውን እና ገቢያቸውን የቀየሩ ተመራቂዎች።',
    // ── Reels ─────────────────────────────────────────────────────────────────
    'reels.empty': 'እስካሁን ሪልስ የሉም',
    'reels.view_course': 'ኮርሱን ይመልከቱ',
    // ── Layout ───────────────────────────────────────────────────────────────
    'layout.login': 'ግባ',
    'layout.join_free': 'በነጻ ይቀላቀሉ',
    'layout.academy': 'ኮቺንግ አካዳሚ',
    'layout.public_menus': 'ዋና ምናሌዎች',
    'layout.direct_payment': 'ቀጥታ የክፍያ ድጋፍ',
    'layout.go_dashboard': 'ወደ ዳሽቦርዴ ሂድ',
    'layout.change_profile': 'መገለጫ / የይለፍ ቃል ቀይር',
    // ── Tabs ─────────────────────────────────────────────────────────────────
    'tab.reviews': 'ግምገማዎች',
    'tab.menu': 'ምናሌ',
    // ── CTA ──────────────────────────────────────────────────────────────────
    'cta.begin_transformation': 'ለውጥዎን ይጀምሩ',
    'cta.ready_title': 'እውነተኛ ስኬት ለመፍጠር እና ፍላጎትዎን ለማሟላት ዝግጁ ነዎት?',
    'cta.ready_sub':
        'ከፍተኛ ገቢ ያለው ክህሎቶችን እና ጠንካራ ሥራ-አስፈጻሚ አስተሳሰብ የሚጠናቀቁ በኢትዮጵያ ያሉ ተመራቂዎችን ይቀላቀሉ።',
    'cta.get_started': 'ነጻ ይጀምሩ →',
    // ── Quick resume ─────────────────────────────────────────────────────────
    'continue_learning': 'መማርን ቀጥሉ',
    'pick_up_where': 'ከቆሙበት ቀጥሉ',
    'lessons_count': 'ትምህርቶች •',
    'resume': 'ቀጥሉ →',
    // ── Featured masterclass card ─────────────────────────────────────────────
    'featured_masterclass': 'ዋና ማስተርክላስ',
    'featured_title': 'መሪዎችን እና ፈጣሪዎችን ማብቃት',
    'featured_desc':
        'የግል ዲሲፕሊን ያካብዱ፣ ኦንላይን ገቢ ያስገኙ፣ ከኢትዮጵያ ቀዳሚ ኮቺንግ ቡድን ጋር ዘላቂ ስኬት ይፍጠሩ።',
    'featured_cbe': '✓ ፈጣን CBE እና ቴሌብር',
    'featured_access': '✓ 100% ዕድሜ ልክ ዝውውር',
    // ── Stats ─────────────────────────────────────────────────────────────────
    'stat.rating': 'የተማሪ ደረጃ',
    'stat.graduates': 'ተመራቂዎች',
    'stat.access': 'ሙሉ ዝውውር',
    // ── Footer ───────────────────────────────────────────────────────────────
    'footer.platform_nav': 'ዋና ምናሌ',
    'footer.about': 'ስለ ሰክሰስ ላይፍ',
    'footer.courses_link': 'ኮርሶች እና ማስተርክላሶች',
    'footer.seminars_link': '🏛️ ቀጥታ ሴሚናሮች እና ጉባኤዎች',
    'footer.reels_link': 'ቪዲዮ ሪልስ',
    'footer.testimonials_link': 'የተማሪ ምስክርነቶች',
    'footer.developed_by': 'የተሰራ በ',
    'footer.about_text':
        'የኢትዮጵያ ቀዳሚ ኮቺንግ እና ኦንላይን ትምህርት መድረክ። ምኞት ያላቸው ሰዎችን ለውጥ አምጪ አስተሳሰብ፣ ሪደርሺፕ እና ገቢ ፈጣሪ ክህሎቶች ያብቃቸዋል።',
    'footer.rights': 'መብቶቹ ሁሉ የተጠበቁ ናቸው።',
    'footer.motto': 'አዕምሮዎን ያብቁ፣ ወደፊቱን ይቀይሩ — በኢትዮጵያ እና ከዚያ ባሻገር።',
    // ── Auth ─────────────────────────────────────────────────────────────────
    'auth.login': 'ግባ',
    'auth.register': 'ተመዝገብ',
    'auth.create_account': 'ነጻ መለያ ፍጠር',
    'login.welcome_back': 'እንኳን ደህና ተመለሱ',
    'login.subtitle': 'ለመማር ቀጥሉ ይግቡ',
    'login.desc': 'ከግል ዳሽቦርድዎ ኮቺንግ ፕሮግራሞችዎን፣ ትምህርቶቻቸውን እና እድገትዎን ያድርሱ።',
    'login.email_or_phone': 'ኢሜይል ወይም ስልክ ቁጥር',
    'login.forgot_password': 'የይለፍ ቃልዎን ረሱ?',
    'login.new_user': 'ለSuccess Life Coaching አዲስ ነዎት? ',
    'login.create_free': 'ነጻ መለያ ፍጠሩ',
    'login.signing_in': 'እየገቡ ነው…',
    'register.create_account': 'መለያ ፍጠሩ',
    'register.journey_title': 'የግል እድገት ጉዞዎን ይጀምሩ',
    'register.journey_desc':
        'ፕሪሚየም ማስተርክላሶችን ለማግኘት፣ ምዕራፎቻቸውን ለመከታተል እና ወደ ግል ዳሽቦርድዎ ለመድረስ Success Life Coaching ይቀላቀሉ።',
    'register.reenter_password': 'የይለፍ ቃሉን ደጋግሙ ያስገቡ',
    'register.already_member': 'አስቀድሞ አባል ነዎት? ',
    'register.sign_in_instead': 'ይግቡ',
    'register.creating': 'መለያ እየተፈጠረ ነው…',
    'register.passwords_mismatch': 'የይለፍ ቃሎቹ አይዛመዱም።',
    'back_to_home': '← ወደ መነሻ ገጽ ተመለሱ',
    // ── Trust row ────────────────────────────────────────────────────────────
    'trust.secure_login': 'ደህንነቱ የተጠበቀ ግባ',
    'trust.progress_saved': 'እድገትዎ ተቀምጧል',
    // ── Splash ───────────────────────────────────────────────────────────────
    'splash.tagline': 'አዕምሮ ማብቀል • ወደፊት መፍጠር',
    // ── Form labels ──────────────────────────────────────────────────────────
    'form.full_name': 'ሙሉ ስም',
    'form.phone': 'ስልክ ቁጥር',
    'form.email': 'ኢሜይል',
    'form.password': 'የይለፍ ቃል',
    'form.optional': '(አማራጭ)',
    'form.confirm_password': 'የይለፍ ቃሉን ያረጋግጡ',
    // ── Sponsors ─────────────────────────────────────────────────────────────
    'sponsors.trusted': 'ቀዳሚ የኢትዮጵያ ተቋማት ያምናሉ',
    // ── FAQ ──────────────────────────────────────────────────────────────────
    'faq.eyebrow': 'ጥያቄዎች',
    'faq.how_access.q': 'ከክፍያ በኋላ ኮቺንግ ኮርሶቼን እንዴት ማግኘት እችላለሁ?',
    'faq.how_access.a':
        'ዲፖዚት ሲያስተላልፉ እና ደረሰኙ ስክሪንሾት ሲያስስቀሉ ወዲያው 6 ወር ዝውውር ይሰጥዎታል።',
    'faq.mobile.q': 'ትምህርቶቹን በሞባይሌ ስልክ ማየት እችላለሁ?',
    'faq.mobile.a':
        'አዎ! ጠቅላላው መድረክ ለኢትዮጵያ ሞባይሌ የተሰራ ነው። ዳታ ቆጣቢ ቪዲዮ ወይም ኦፊሴላዊ ኤንድሮይድ ኣፑን ያውርዱ።',
    'faq.duration.q': 'ለሚገዙዋቸው ኮርሶች ምን ያህል ጊዜ ዝውውር አለኝ?',
    'faq.duration.a':
        'ሁሉም ምዝገባዎች ከዝዉዉር ፈቃድ ቀን ጀምሮ ሙሉ 6 ወር ዝውውር ያካትታሉ።',
    'faq.cert.q': 'የማጠናቀቂያ ሰርተፊኬት እቀበላለሁ?',
    'faq.cert.a':
        'አዎ! ሁሉንም ትምህርቶቻቸውን ሲጨርሱ ሊረጋገጥ የሚችል Success Life Coaching ሰርተፊኬት ይሰጥዎታል።',
    'faq.app.q': 'ኤንድሮይድ ኣፑን እንዴት ማውረድ እችላለሁ?',
    'faq.app.a':
        'ወደ መነሻ ገጽ ሄደው "ኤንድሮይድ" ቁልፍ ይጫኑ ወይም ፉትሮ ውስጥ ያለውን የማውረድ ሊንክ ይጠቀሙ።',
  },

  'ti': {
    // ── App / nav ────────────────────────────────────────────────────────────
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
    // ── Common ───────────────────────────────────────────────────────────────
    'common.see_all': 'ኩሉ ርአ',
    'common.retry': 'እንደገና ፈትን',
    'common.load_failed': 'እዚ ገጽ ክጽዓን ኣይከኣለን።',
    // ── Home ─────────────────────────────────────────────────────────────────
    'home.welcome': 'እንቋዕ ብደሓን መጻእኩም',
    'home.subtitle': 'ጉዕዞ ትምህርትኹም ቀጽሉ',
    'home.popular': 'ተፈተውቲ ኮርሳት',
    'home.seminars': 'ዝመጹ ሰሚናራት',
    'home.badge': 'ናይ ኢትዮጵያ ቀዳማይ ኣካዳሚ ሪደርሺፕን ኮቺንግን',
    'home.hero_title':
        'ኣተሓሳስባኹም ቀይሩ፣ ዝለዓለ ዋጋ ዘለዎ ክእለት ኣካብዱ፣ ሓቀኛ ዕዉትነት ህነጹ።',
    'home.hero_sub':
        'ካብ ኣረጋጊጽካ ዝተሰልጠኑ ኣሰልጣኒ፣ ዝኸዶ ዘሎ ዋና ማስተርክላሳት ብቪዲዮ ተምሃሩ። ንኢትዮጵያ ምኞት ዘለዎም ሞያውያን፣ ፈጠርቲ፣ ምራሕቲ ዝዓለመ።',
    'home.explore_courses': 'ኩሎም ኮርሳት ዑደት ግበሩ →',
    'home.reserve_seminar': 'ቀጥታ ሰሚናራት',
    'home.search_placeholder': 'ፕሮግራማት፣ ርእሰ-ሓሳባት፣ ኣሰልጣኒ ድለዩ...',
    'home.all_programs': 'ኩሎም ፕሮግራማት',
    'home.why_choose': 'ምኞት ዘለዎም ሰባት ስለምንታይ ኣብዚ ይምሃሩ',
    'home.faq_title': 'ብተደጋጋሚ ዝሕተቱ ሕቶታት',
    // ── Courses section ───────────────────────────────────────────────────────
    'courses.empty': 'ዝኾነ ኮርስ የለን',
    'courses.section_eyebrow': 'ካታሎጋት ኣካዳሚ',
    'courses.section_title': 'ዝተፈለዩ ኮቺንግ ፕሮግራማት',
    'courses.section_sub': 'ዳሩ ፈጢሩ ቪዲዮ ፕሮግራማት ትምህርቶምን ወዲያው ሊጥቀሙ ይኽእሉ።',
    'no_match_title': 'ዝኾነ ፕሮግራም ምድላይኩምን ዘሳምር ኣይኮነን',
    'no_match_sub': 'ቁልፊ ቃሉ ኣስተካክሉ ወይ ናይ ምድብ ማጠሪያ ቀይሩ።',
    'reset_filters': 'ማጠሪያታት ደጊም ኣስጀምሩ',
    // ── Seminars ─────────────────────────────────────────────────────────────
    'seminars.empty': 'ኣብዚ እዋን ሰሚናር የለን',
    // ── Value pillars ─────────────────────────────────────────────────────────
    'pillars.eyebrow': 'ምምሕዳር ኣካዳሚ',
    'pillars.title': 'ምኞት ዘለዎም ሰባት ስለምንታይ ኣብዚ ይምሃሩ',
    // ── How it works ──────────────────────────────────────────────────────────
    'how.eyebrow': 'ሰለስተ ቀሊል ስጉምቲ',
    'how.title': 'ካብ ክፍሊት ናብ ዝተረጋገጸ ሰርቲፊኬት',
    // ── Testimonials ──────────────────────────────────────────────────────────
    'testimonials.empty': 'ክሳብ ሕጂ ምስክርነት የለን',
    'testimonials.eyebrow': 'ታሪኻት ተምሃሮ',
    'testimonials.title': 'ብተምሃሮ ኢትዮጵያ ዝፍቀሩ',
    'testimonials.sub': 'እምነቶም፣ ሞያኦምን ኣታዊኦምን ዝቐየሩ ተምሃሮ።',
    // ── Reels ─────────────────────────────────────────────────────────────────
    'reels.empty': 'ክሳብ ሕጂ ሪልስ የለን',
    'reels.view_course': 'ኮርስ ርአ',
    // ── Layout ───────────────────────────────────────────────────────────────
    'layout.login': 'እቶ',
    'layout.join_free': 'ብነጻ ተጸንበሩ',
    'layout.academy': 'ኮቺንግ ኣካዳሚ',
    'layout.public_menus': 'ቀንዲ ዝርዝራት',
    'layout.direct_payment': 'ቀጥታ ደገፍ ክፍሊት',
    'layout.go_dashboard': 'ናብ ዳሽቦርደይ ኺድ',
    'layout.change_profile': 'ፕሮፋይል / ፓስዎርድ ቀይር',
    // ── Tabs ─────────────────────────────────────────────────────────────────
    'tab.reviews': 'ርእይቶታት',
    'tab.menu': 'ዝርዝር',
    // ── CTA ──────────────────────────────────────────────────────────────────
    'cta.begin_transformation': 'ለውጥኹም ጀምሩ',
    'cta.ready_title': 'ሓቀኛ ዕዉትነት ንምህናጽ ፍቓደኛ ዲኹም?',
    'cta.ready_sub':
        'ዝለዓለ ኣታዊ ዘለዎ ክእለትን ጠንካራ ናይ ስራሕ ኣእምሮን ዝቐስሙ ኣብ ኢትዮጵያ ዘለዉ ተምሃሮ ምስኦም ተሓወሱ።',
    'cta.get_started': 'ብነጻ ጀምሩ →',
    // ── Quick resume ─────────────────────────────────────────────────────────
    'continue_learning': 'ምምሃር ቀጽሉ',
    'pick_up_where': 'ካብ ዘቋረጽኩምሉ ቀጽሉ',
    'lessons_count': 'ትምህርቲ •',
    'resume': 'ቀጽሉ →',
    // ── Featured masterclass card ─────────────────────────────────────────────
    'featured_masterclass': 'ቀዳማይ ማስተርክላስ',
    'featured_title': 'ምራሕቲን ፈጠርቲን ምብቃዕ',
    'featured_desc':
        'ናይ ውልቂ ዲሲፕሊን ኣካብዱ፣ ብኦንላይን ኣታዊ ሃቡ፣ ምስ ቀዳማይ ናይ ኢትዮጵያ ኮቺንግ ቡድን ዘላቒ ዕዉትነት ህነጹ።',
    'featured_cbe': '✓ ቅጡዕ CBE ን ቴሌብርን',
    'featured_access': '✓ 100% ናይ ዕድሜ ዳሳሰ',
    // ── Stats ─────────────────────────────────────────────────────────────────
    'stat.rating': 'ደረጃ ተምሃሮ',
    'stat.graduates': 'ተምሃሮ',
    'stat.access': 'ሙሉእ ዳሳሰ',
    // ── Footer ───────────────────────────────────────────────────────────────
    'footer.platform_nav': 'ቀንዲ ዝርዝር',
    'footer.about': 'ብዛዕባ ሰክሰስ ላይፍ',
    'footer.courses_link': 'ኮርሳትን ማስተርክላሳትን',
    'footer.seminars_link': '🏛️ ቀጥታ ሰሚናራትን ጉባኤታትን',
    'footer.reels_link': 'ቪዲዮ ሪልስ',
    'footer.testimonials_link': 'ምስክርነት ተምሃሮ',
    'footer.developed_by': 'ዝሰርሐ',
    'footer.about_text':
        'ቀዳማይ ናይ ኢትዮጵያ ኮቺንግ ን ኦንላይን ትምህርቲ ፕላትፎርም። ምኞት ዘለዎም ሰባት ለዋጢ ኣተሓሳስባ፣ ሪደርሺፕን ኣታዊ ፈጣሪ ክእለትን ይብቅዕ።',
    'footer.rights': 'ሁሉ ዝናታት ተሓሊዎ።',
    'footer.motto': 'ኣእምሮ ምብቃዕ፣ ወደፊት ምቕያር — ኣብ ኢትዮጵያን ካብኡ ንላዕልን።',
    // ── Auth ─────────────────────────────────────────────────────────────────
    'auth.login': 'እቶ',
    'auth.register': 'ተመዝገብ',
    'auth.create_account': 'ናጻ ኣካውንት ፍጠር',
    'login.welcome_back': 'እንቋዕ ብደሓን ተመሊስኩም',
    'login.subtitle': 'ምምሃር ንምቕጻል እቶ',
    'login.desc': 'ካብ ናይ ውልቂ ዳሽቦርድኹም ናይ ኮቺንግ ፕሮግራምን ትምህርቲን ምምሕዳርን ኣድሕሱ።',
    'login.email_or_phone': 'ኢሜይል ወይ ስልኪ ቁጥሪ',
    'login.forgot_password': 'ፓስዎርድኩም ረሲዕኩም?',
    'login.new_user': 'ን Success Life Coaching ሓዲሽ ዲኹም? ',
    'login.create_free': 'ናጻ ኣካውንት ፍጠሩ',
    'login.signing_in': 'እናወሐሱ ኣሎ…',
    'register.create_account': 'ኣካውንት ፍጠሩ',
    'register.journey_title': 'ናይ ውልቂ ዕቤት ጉዕዞ ጀምሩ',
    'register.journey_desc':
        'ፕሪሚየም ማስተርክላሳት ንምርካብ፣ ምዕቡላት ንምክትታልን ናይ ውልቂ ዳሽቦርድ ንምብጻሕን Success Life Coaching ተሓወሱ።',
    'register.reenter_password': 'ፓስዎርዱ ደጋጊምኩም ኣስገቡ',
    'register.already_member': 'ቀደምሲ ኣባል ዲኹም? ',
    'register.sign_in_instead': 'እቶ',
    'register.creating': 'ኣካውንት ይፍጠር ኣሎ…',
    'register.passwords_mismatch': 'ፓስዎርዳት ኣይሳዕምኑን።',
    'back_to_home': '← ናብ ቀዳምሲ ገጽ ተመለሱ',
    // ── Trust row ────────────────────────────────────────────────────────────
    'trust.secure_login': 'ድሑን ምእታው',
    'trust.progress_saved': 'ምምሕዳርኩም ተቀምጡ',
    // ── Splash ───────────────────────────────────────────────────────────────
    'splash.tagline': 'ኣእምሮ ምብቃዕ • ወደፊት ምህናጽ',
    // ── Form labels ──────────────────────────────────────────────────────────
    'form.full_name': 'ምሉእ ስም',
    'form.phone': 'ቁጽሪ ስልኪ',
    'form.email': 'ኢሜይል',
    'form.password': 'ፓስዎርድ',
    'form.optional': '(ምርጫ)',
    'form.confirm_password': 'ፓስዎርዱ ኣረጋግጹ',
    // ── Sponsors ─────────────────────────────────────────────────────────────
    'sponsors.trusted': 'ቀዳሞት ትካላት ኢትዮጵያ ይኣምኑ',
    // ── FAQ ──────────────────────────────────────────────────────────────────
    'faq.eyebrow': 'ሕቶታት',
    'faq.how_access.q': 'ድሕሪ ክፍሊት ናይ ኮቺንግ ኮርሳተይ ብኸመይ ክረክቦ እኽእል?',
    'faq.how_access.a':
        'ቀይሶ ምስ ኣሰጋገርኩምን ስክሪንሾት ደረሰኝ ምስ ሓጸዮምን ወዲያው 6 ወርሒ ዳሳሰ ትቕበሉ።',
    'faq.mobile.q': 'ትምህርቲ ኣብ ሞባይለይ ምክትታል ይከኣል ዶ?',
    'faq.mobile.a':
        'እወ! ጠቕሊሉ ዘሎ ፕላትፎርም ንኢትዮጵያ ሞባይሌ-ቀዳምሲ ዝተሰርሐ እዩ። ዲታ ቆጣቢ ቪዲዮ ወይ ወግዓዊ ኣንድሮይድ ኣፕ ኣውርዱ።',
    'faq.duration.q': 'ንዝዕድጉዎም ኮርሳት ክንደይ ዳሳሰ ኣለኒ?',
    'faq.duration.a':
        'ኩሎም ምዝገባ ካብ ዕለት ፍቓድ ጀሚሩ ሙሉእ 6 ወርሒ ቀጥታ ዳሳሰ ይሓዝ።',
    'faq.cert.q': 'ሰርቲፊኬት ምፍጻም ክቕበል ዶ?',
    'faq.cert.a':
        'እወ! ኩሎም ትምህርቲ ምስ ወዳእኩም ሊረጋገጽ ዝኽእል Success Life Coaching ሰርቲፊኬት ክወሃበኩም እዩ።',
    'faq.app.q': 'ናይ ኣንድሮይድ ኣፑ ብኸመይ ክወርዶ እኽእል?',
    'faq.app.a':
        'ናብ ቀዳምሲ ገጽ ኼዶም "ኣንድሮይድ" ቁልፊ ጸቕጡ ወይ ፉተር ዝርከብ ናይ ምውራድ ሊንክ ተጠቀሙ።',
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
