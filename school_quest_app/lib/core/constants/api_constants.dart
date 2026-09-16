class ApiConstants {
  // Default base URL. For Android Emulator use 10.0.2.2, for Linux desktop/Web use localhost.
  // Can be adjusted dynamically via Settings if connecting to LAN server (e.g. 192.168.x.x).
  static String baseUrl = 'http://localhost:8000/api';
  static String storageBaseUrl = 'http://localhost:8000';

  // Auth endpoints
  static const String login = '/auth/login';
  static const String me = '/auth/me';
  static const String logout = '/auth/logout';

  // Student endpoints
  static const String studentDashboard = '/student/dashboard';
  static const String studentQuests = '/student/quests';
  static const String studentLeaderboard = '/student/leaderboard';
  static const String studentCommunity = '/student/community';
  static const String studentProfile = '/student/profile';
  static const String studentAvatarUpdate = '/student/profile/avatar';
  static const String studentAvatarUpload = '/student/profile/avatar/upload';
  static const String studentAvatarReset = '/student/profile/avatar/reset';
  static const String studentPasswordUpdate = '/student/profile/password';
  static const String studentOnboarding = '/student/onboarding/complete';

  // Admin endpoints
  static const String adminDashboard = '/admin/dashboard';
  static const String adminValidations = '/admin/validations';
  static const String adminQuests = '/admin/quests';
  static const String adminCommunity = '/admin/community';
  static const String adminStudents = '/admin/students';

  /// Helper to convert relative storage paths (/storage/...) to full absolute URLs
  static String resolveImageUrl(String? path) {
    if (path == null || path.isEmpty) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    if (path.startsWith('/')) {
      return '$storageBaseUrl$path';
    }
    return '$storageBaseUrl/$path';
  }

  /// DiceBear Pixel Art Bot URL generator (identical to web app)
  static String getDiceBearAvatar(String seed) {
    return 'https://api.dicebear.com/7.x/bottts/png?seed=${Uri.encodeComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf';
  }
}
