import 'package:flutter/material.dart';

/// Design Tokens for SchoolQuest — Pixel Realm Odyssey Design System
class AppColors {
  // ─── Surfaces & Canvas ───
  static const Color bgDark = Color(0xFF0B0F17); // Midnight Realm Canvas
  static const Color surfaceCanvas = Color(0xFF0B0F17);
  static const Color surfaceDeep = Color(0xFF070B14); // Deepest backdrop trough
  static const Color bgCard = Color(0xFF131C31); // Slate Navy interactive card
  static const Color surfaceCard = Color(0xFF131C31);
  static const Color bgCardLighter = Color(0xFF1A253E); // Elevated Card / Hover tile
  static const Color surfaceCardElevated = Color(0xFF1A253E);
  static const Color bgSurface = Color(0xFF161F30);

  // ─── Borders & Dividers ───
  static const Color border = Color(0xFF222E46); // 1px Chiseled Pixel Border
  static const Color borderPixel = Color(0xFF222E46);
  static const Color borderLight = Color(0xFF334155);
  static const Color borderGlow = Color(0xFF38BDF8); // Electric Mana Cyan
  static const Color borderActive = Color(0xFF38BDF8);

  // ─── Gamified Accents & Chromatic Palette ───
  static const Color primary = Color(0xFFF59E0B); // Radiant Quest Amber / Gold
  static const Color primaryLight = Color(0xFFFBBF24); // Amber Glow
  static const Color primaryDark = Color(0xFFD97706);
  static const Color primaryContainer = Color(0xFFF59E0B);
  static const Color onPrimaryContainer = Color(0xFF472A00);

  static const Color secondary = Color(0xFF3B82F6); // Arcane Mana Blue
  static const Color secondaryContainer = Color(0xFF0566D9);
  static const Color onSecondaryContainer = Color(0xFFE6ECFF);
  static const Color accent = Color(0xFF38BDF8); // Mana Cyan

  static const Color manaCyan = Color(0xFF38BDF8);
  static const Color amberGlow = Color(0xFFFBBF24);

  // ─── Gamified Rank & Status Badges ───
  static const Color gold = Color(0xFFF59E0B); // Rank 1 Aura Gold
  static const Color goldLight = Color(0xFFFBBF24);
  static const Color silver = Color(0xFF94A3B8); // Rank 2 Polished Silver
  static const Color bronze = Color(0xFFCD7F32); // Rank 3 Forged Bronze

  static const Color emerald = Color(0xFF10B981); // Alchemy Emerald / Quest Success
  static const Color questSuccess = Color(0xFF10B981);
  static const Color tertiary = Color(0xFF56E5A9);
  static const Color tertiaryContainer = Color(0xFF30C88F);

  static const Color ruby = Color(0xFFEF4444); // Quest Danger / Sanctions
  static const Color questDanger = Color(0xFFEF4444);

  static const Color sapphire = Color(0xFF38BDF8); // Timetable / Mana
  static const Color flameOrange = Color(0xFFF59E0B); // Streak Days flame

  // ─── Typography Colors ───
  static const Color textPrimary = Color(0xFFF8FAFC);
  static const Color textSecondary = Color(0xFFE2E8F0);
  static const Color textMuted = Color(0xFF64748B);
  static const Color textAccent = Color(0xFF38BDF8);

  // ─── Rank Palette Mapping ───
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
