import 'package:flutter/material.dart';
import '../core/constants/app_colors.dart';

class RankBadge extends StatelessWidget {
  final String rank;
  final double fontSize;
  final bool showGlow;
  final bool isPill;

  const RankBadge({
    super.key,
    required this.rank,
    this.fontSize = 11,
    this.showGlow = false,
    this.isPill = true,
  });

  @override
  Widget build(BuildContext context) {
    final rankColor = AppColors.getRankColor(rank);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: AppColors.surfaceDeep,
        borderRadius: BorderRadius.circular(isPill ? 9999 : 6),
        border: Border.all(color: rankColor.withOpacity(0.5), width: 1),
        boxShadow: [
          if (showGlow)
            BoxShadow(
              color: rankColor.withOpacity(0.35),
              blurRadius: 8,
              spreadRadius: 0.5,
            ),
          BoxShadow(
            color: Colors.black.withOpacity(0.2),
            blurRadius: 2,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Icon(
            Icons.military_tech,
            size: fontSize + 3,
            color: rankColor,
          ),
          const SizedBox(width: 3),
          Text(
            rank.toUpperCase(),
            style: TextStyle(
              color: rankColor,
              fontWeight: FontWeight.w700,
              fontSize: fontSize,
              letterSpacing: 0.8,
            ),
          ),
        ],
      ),
    );
  }
}
