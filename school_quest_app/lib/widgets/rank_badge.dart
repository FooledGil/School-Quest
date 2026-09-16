import 'package:flutter/material.dart';
import '../core/constants/app_colors.dart';

class RankBadge extends StatelessWidget {
  final String rank;
  final double fontSize;
  final bool showGlow;

  const RankBadge({
    super.key,
    required this.rank,
    this.fontSize = 11,
    this.showGlow = false,
  });

  @override
  Widget build(BuildContext context) {
    final rankColor = AppColors.getRankColor(rank);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: rankColor.withOpacity(0.15),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: rankColor.withOpacity(0.6), width: 1),
        boxShadow: showGlow
            ? [
                BoxShadow(
                  color: rankColor.withOpacity(0.35),
                  blurRadius: 8,
                  spreadRadius: 1,
                )
              ]
            : null,
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.shield_outlined, size: fontSize + 2, color: rankColor),
          const SizedBox(width: 4),
          Text(
            rank.toUpperCase(),
            style: TextStyle(
              color: rankColor,
              fontWeight: FontWeight.bold,
              fontSize: fontSize,
              letterSpacing: 0.8,
            ),
          ),
        ],
      ),
    );
  }
}
