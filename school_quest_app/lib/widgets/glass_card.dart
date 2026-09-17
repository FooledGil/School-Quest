import 'package:flutter/material.dart';
import '../core/constants/app_colors.dart';

class GlassCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final Color? borderColor;
  final Color? backgroundColor;
  final VoidCallback? onTap;
  final double borderRadius;
  final bool isElevated;

  const GlassCard({
    super.key,
    required this.child,
    this.padding,
    this.margin,
    this.borderColor,
    this.backgroundColor,
    this.onTap,
    this.borderRadius = 14,
    this.isElevated = false,
  });

  @override
  Widget build(BuildContext context) {
    final bg = backgroundColor ??
        (isElevated ? AppColors.surfaceCardElevated : AppColors.surfaceCard);
    final border = borderColor ?? AppColors.borderPixel;

    Widget card = Container(
      margin: margin,
      padding: padding ?? const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(borderRadius),
        border: Border.all(
          color: border,
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(isElevated ? 0.45 : 0.25),
            blurRadius: isElevated ? 16 : 8,
            offset: Offset(0, isElevated ? 6 : 3),
          ),
        ],
      ),
      child: child,
    );

    if (onTap != null) {
      return Container(
        margin: margin,
        child: Material(
          color: Colors.transparent,
          borderRadius: BorderRadius.circular(borderRadius),
          child: InkWell(
            onTap: onTap,
            borderRadius: BorderRadius.circular(borderRadius),
            child: Container(
              padding: padding ?? const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: bg,
                borderRadius: BorderRadius.circular(borderRadius),
                border: Border.all(color: border, width: 1),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(isElevated ? 0.45 : 0.25),
                    blurRadius: isElevated ? 16 : 8,
                    offset: Offset(0, isElevated ? 6 : 3),
                  ),
                ],
              ),
              child: child,
            ),
          ),
        ),
      );
    }

    return card;
  }
}
