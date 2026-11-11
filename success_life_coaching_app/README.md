# Success Life Coaching Academy - Flutter Android App

A production-ready Flutter mobile application for Success Life Coaching Academy with authentication, course enrollment, seminars, and multi-language support.

## ✨ Features

- **User Authentication** - Login, registration, password management
- **Course Catalog** - Browse, search, and enroll in courses
- **Seminars** - Upcoming seminars, registration, capacity tracking
- **User Dashboard** - Profile management, enrollment history
- **Multi-Language** - English, Amharic, Tigrinya
- **Mobile-First Design** - Optimized for 99% mobile user base
- **Offline Support** - Local caching with SharedPreferences
- **Push Notifications** - Firebase Cloud Messaging support

## 🚀 Quick Start

### Prerequisites
- Flutter 3.0+
- Android SDK 12+
- Git

### Installation
```bash
# Clone the repository
git clone <your-repo>
cd success_life_coaching_app

# Install dependencies
flutter pub get

# Run on device/emulator
flutter run

# Build release APK
flutter build apk --release
```

### Configuration
Edit `lib/config/api_config.dart`:
```dart
static const String baseUrl = 'https://your-api.com/api';
```

## 📁 Project Structure

- `lib/config/` - API config and constants
- `lib/models/` - Data models (User, Course, Seminar)
- `lib/services/` - API and storage services
- `lib/providers/` - State management (Provider)
- `lib/screens/` - UI screens and pages

## 🏗️ Architecture

- **State Management**: Provider pattern
- **Navigation**: GoRouter
- **Local Storage**: SharedPreferences
- **Networking**: HTTP with error handling
- **Localization**: Multi-language support (en, am, ti)

## 📱 Screens

1. **Splash Screen** - App initialization
2. **Login/Register** - Authentication
3. **Home Screen** - Featured courses & seminars
4. **Courses List** - Browse all courses
5. **Course Detail** - Enrollment page
6. **Seminars List** - Filter upcoming/past
7. **Seminar Detail** - Registration page
8. **Dashboard** - User profile & stats
9. **Profile** - Settings & language switch

## 🔐 API Endpoints

### Auth
- `POST /auth/login` - User login
- `POST /auth/register` - New user registration
- `GET /auth/profile` - User profile
- `POST /auth/logout` - Logout

### Content
- `GET /courses` - List all courses (paginated)
- `GET /courses/{id}` - Course details
- `GET /seminars` - List all seminars (paginated)
- `GET /seminars/{id}` - Seminar details

### Actions
- `POST /enrollments` - Enroll in course/seminar

## 🛠️ Building

### Debug APK
```bash
flutter build apk --debug
```

### Release APK
```bash
flutter build apk --release
```

### App Bundle (Google Play)
```bash
flutter build appbundle --release
```

## 📋 Testing

Run on Android emulator:
```bash
flutter run
```

Run on physical device:
```bash
flutter run
```

## 🌍 Multi-Language Support

Supported languages:
- English (`en`)
- Amharic (`am`)
- Tigrinya (`ti`)

Language switcher in profile screen. Preference saved locally.

## 📦 Dependencies

- **provider**: State management
- **go_router**: Navigation
- **http**: HTTP requests
- **shared_preferences**: Local storage
- **video_player**: Video playback
- **firebase_messaging**: Push notifications
- **intl**: Internationalization
- **cached_network_image**: Image caching

See `pubspec.yaml` for complete list.

## 🚀 Deployment

### Google Play Store

1. Build app bundle:
   ```bash
   flutter build appbundle --release
   ```

2. Upload to [Play Console](https://play.google.com/console/)

3. Fill store listing:
   - App name: Success Life Coaching
   - Category: Education
   - Screenshots (4+)
   - Description
   - Privacy policy

4. Submit for review

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed deployment instructions.

## 🐛 Troubleshooting

### App won't start
- Check `api_config.dart` has correct API URL
- Run `flutter pub get`
- Clear cache: `flutter clean`

### Build errors
- Update Flutter: `flutter upgrade`
- Clean project: `flutter clean && flutter pub get`
- Check Android SDK: `flutter doctor`

### Network errors
- Verify backend is running
- Check API URL format
- Check network connection

## 📚 Documentation

- [Setup Guide](SETUP_GUIDE.md) - Detailed setup & deployment
- [Flutter Docs](https://flutter.dev/docs)
- [Provider Docs](https://pub.dev/packages/provider)

## 📞 Support

For issues or questions:
- Create GitHub issue
- Email: support@successlifecoaching.com

## 📄 License

© Success Life Coaching Academy. All rights reserved.

## Version

**v1.0.0** - Production Release

---

**Built with Flutter 3.47.2** | **Dart 3.13.2**

Start learning. Start growing. Success Life Coaching Academy. 🎓
