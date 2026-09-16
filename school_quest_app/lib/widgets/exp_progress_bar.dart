import 'package:flutter/material.dart';
import '../core/constants/app_colors.dart';

class ExpProgressBar extends StatelessWidget {
  final int currentExp;
  final int? expInLevel;
  final int? expNeededInLevel;
  final double? expPercentage;
  final bool showLabels;
  final double height;

  const ExpProgressBar({
    super.key,
    required this.currentExp,
    this.expInLevel,
    this.expNeededInLevel,
    this.expPercentage,
    this.showLabels = true,
    this.height = 10,
  });

  @override
  Widget build(BuildContext context) {
    final double percentage = (expPercentage != null)
        ? (expPercentage! / 100).clamp(0.0, 1.0)
        : (expNeededInLevel != null && expNeededInLevel! > 0
            ? ((expInLevel ?? 0) / expNeededInLevel!).clamp(0.0, 1.0)
            : 0.0);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (showLabels) ...[
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(Icons.bolt, size: 14, color: AppColors.gold),
                  const SizedBox(width: 4),
                  Text(
                    'EXP PROGRESS',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 0.5,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
              Text(
                '${(percentage * 100).toStringAsFixed(1)}%',
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: AppColors.gold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
        ],
        Container(
          height: height,
          width: double.infinity,
          decoration: BoxDecoration(
            color: AppColors.bgDark,
            borderRadius: BorderRadius.circular(height / 2),
            border: Border.all(color: AppColors.border, width: 0.5),
          ),
          child: Stack(
            children: [
              FractionallySizedBox(
                widthFactor: percentage,
                child: Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(height / 2),
                    gradient: const LinearGradient(
                      colors: [AppColors.gold, AppColors.flameOrange],
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.gold.withOpacity(0.4),
                        blurRadius: 6,
                        spreadRadius: 0.5,
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
        if (showLabels && expInLevel != null && expNeededInLevel != null) ...[
          const SizedBox(height: 4),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '$expInLevel EXP',
                style: const TextStyle(fontSize: 11, color: AppColors.textMuted),
              ),
              Text(
                '$expNeededInLevel EXP needed',
                style: const TextStyle(fontSize: 11, color: AppColors.textMuted),
              ),
            ],
          ),
        ],
      ],
    );
  }
}
