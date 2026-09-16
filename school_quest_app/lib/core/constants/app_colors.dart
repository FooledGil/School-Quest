import 'package:flutter/material.dart';

class AppColors {
  // Backgrounds & Surface
  static const Color bgDark = Color(0xFF0A0E17);
  static const Color bgCard = Color(0xFF111827);
  static const Color bgCardLighter = Color(0xFF1E293B);
  static const Color bgSurface = Color(0xFF161F30);

  // Borders & Dividers
  static const Color border = Color(0xFF334155);
  static const Color borderLight = Color(0xFF475569);
  static const Color borderGlow = Color(0xFF6366F1);

  // Primary RPG Branding
  static const Color primary = Color(0xFF6366F1); // Indigo Neon
  static const Color primaryLight = Color(0xFF818CF8);
  static const Color primaryDark = Color(0xFF4F46E5);
  static const Color secondary = Color(0xFF8B5CF6); // Purple
  static const Color accent = Color(0xFFA855F7);

  // Status & Gamification Accents
  static const Color gold = Color(0xFFF59E0B); // EXP / Level / 1st Place
  static const Color goldLight = Color(0xFFFBBF24);
  static const Color silver = Color(0xFF94A3B8); // 2nd Place
  static const Color bronze = Color(0xFFD97706); // 3rd Place
  static const Color emerald = Color(0xFF10B981); // Quest Done / Approved
  static const Color ruby = Color(0xFFEF4444); // Quest Failed / Sanction / Boss
  static const Color sapphire = Color(0xFF3B82F6); // Schedule / Info
  static const Color flameOrange = Color(0xFFF97316); // Streak Days

  // Typography Colors
  static const Color textPrimary = Color(0xFFF8FAFC);
  static const Color textSecondary = Color(0xFF94A3B8);
  static const Color textMuted = Color(0xFF64748B);
  static const Color textAccent = Color(0xFFA5B4FC);

  // Rank Palette mapping
  static Color getRankColor(String rank) {
    switch (rank.toLowerCase()) {
      case 'immortal':
        return const Color(0xFFFF0055);
      case 'mythic':
        return const Color(0xFFFF4500);
      case 'legend':
        return const Color(0xFFFFD700);
      case 'hero':
        return const Color(0xFFA855F7);
      case 'grandmaster':
        return const Color(0xFF8B5CF6);
      case 'master':
        return const Color(0xFF3B82F6);
      case 'champion':
        return const Color(0xFF06B6D4);
      case 'knight':
        return const Color(0xFF10B981);
      case 'elite':
        return const Color(0xFF34D399);
      case 'warrior':
        return const Color(0xFFF59E0B);
      case 'adventurer':
        return const Color(0xFFF97316);
      case 'explorer':
        return const Color(0xFF60A5FA);
      case 'apprentice':
        return const Color(0xFF94A3B8);
      case 'novice':
      default:
        return const Color(0xFF64748B);
    }
  }
}
