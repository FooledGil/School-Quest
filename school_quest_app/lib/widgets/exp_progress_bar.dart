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
            : (currentExp > 0 ? (currentExp / (currentExp + 100)).clamp(0.0, 1.0) : 0.0));

    final int pctInt = (percentage * 100).round();
    final int displayCurrent = expInLevel ?? currentExp;
    final int displayNeeded = expNeededInLevel ?? (currentExp > 0 ? currentExp + 50 : 100);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (showLabels) ...[
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(Icons.bolt, size: 15, color: AppColors.manaCyan),
                  const SizedBox(width: 4),
                  Text(
                    'EXP ($pctInt%)',
                    style: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 0.8,
                      color: AppColors.manaCyan,
                    ),
                  ),
                ],
              ),
              RichText(
                text: TextSpan(
                  children: [
                    TextSpan(
                      text: '$displayCurrent',
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    TextSpan(
                      text: ' / $displayNeeded EXP',
                      style: const TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
        ],
        // Progress Bar Trough
        Container(
          height: height,
          width: double.infinity,
          padding: const EdgeInsets.all(1.5),
          decoration: BoxDecoration(
            color: AppColors.surfaceDeep,
            borderRadius: BorderRadius.circular(height / 2),
            border: Border.all(color: AppColors.borderPixel, width: 0.8),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.4),
                blurRadius: 3,
                offset: const Offset(0, 1),
              ),
            ],
          ),
          child: LayoutBuilder(
            builder: (context, constraints) {
              final fillWidth = (constraints.maxWidth * percentage).clamp(0.0, constraints.maxWidth);
              return Stack(
                children: [
                  Container(
                    width: fillWidth,
                    height: double.infinity,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(height / 2),
                      gradient: const LinearGradient(
                        colors: [
                          AppColors.manaCyan,
                          AppColors.secondaryContainer,
                        ],
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.manaCyan.withOpacity(0.45),
                          blurRadius: 4,
                          spreadRadius: 0.5,
                        ),
                      ],
                    ),
                    child: fillWidth > 12
                        ? Align(
                            alignment: Alignment.centerRight,
                            child: Container(
                              width: 3,
                              height: height - 2,
                              margin: const EdgeInsets.only(right: 2),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.8),
                                borderRadius: BorderRadius.circular(2),
                              ),
                            ),
                          )
                        : null,
                  ),
                ],
              );
            },
          ),
        ),
      ],
    );
  }
}
