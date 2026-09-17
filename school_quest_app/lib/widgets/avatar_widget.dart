import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../core/constants/api_constants.dart';
import '../core/constants/app_colors.dart';

class AvatarWidget extends StatelessWidget {
  final String? avatar;
  final String? avatarSeed;
  final double size;
  final double borderWidth;
  final Color? borderColor;
  final dynamic level; // Optional: int or String (e.g. 1 or "1")
  final bool isCircle;

  const AvatarWidget({
    super.key,
    this.avatar,
    this.avatarSeed,
    this.size = 48,
    this.borderWidth = 1.5,
    this.borderColor,
    this.level,
    this.isCircle = false,
  });

  String get _imageUrl {
    if (avatar != null && avatar!.isNotEmpty) {
      return ApiConstants.resolveImageUrl(avatar);
    }
    if (avatarSeed != null && avatarSeed!.isNotEmpty) {
      return ApiConstants.getDiceBearAvatar(avatarSeed!);
    }
    return '';
  }

  @override
  Widget build(BuildContext context) {
    final url = _imageUrl;
    final border = borderColor ?? AppColors.borderPixel;
    final radius = isCircle ? BorderRadius.circular(size / 2) : BorderRadius.circular(size * 0.25);

    Widget avatarBox = Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        borderRadius: radius,
        border: Border.all(color: border, width: borderWidth),
        color: AppColors.surfaceDeep,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.35),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: isCircle
            ? BorderRadius.circular(size / 2)
            : BorderRadius.circular((size * 0.25) - borderWidth),
        child: url.isNotEmpty
            ? CachedNetworkImage(
                imageUrl: url,
                fit: BoxFit.cover,
                placeholder: (context, url) => Center(
                  child: SizedBox(
                    width: size * 0.35,
                    height: size * 0.35,
                    child: const CircularProgressIndicator(
                      strokeWidth: 2,
                      color: AppColors.manaCyan,
                    ),
                  ),
                ),
                errorWidget: (context, url, error) => _fallbackSilhouette(),
              )
            : _fallbackSilhouette(),
      ),
    );

    if (level == null) return avatarBox;

    // With Level Badge Pin at bottom right
    return SizedBox(
      width: size + 6,
      height: size + 4,
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          Positioned(
            left: 0,
            top: 0,
            child: avatarBox,
          ),
          Positioned(
            bottom: 0,
            right: 0,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
              decoration: BoxDecoration(
                color: AppColors.secondaryContainer,
                borderRadius: BorderRadius.circular(5),
                border: Border.all(color: AppColors.surfaceDeep, width: 1.2),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.4),
                    blurRadius: 4,
                  ),
                ],
              ),
              child: Text(
                'LV.$level',
                style: const TextStyle(
                  fontSize: 8.5,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 0.6,
                  color: AppColors.onSecondaryContainer,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _fallbackSilhouette() {
    return Image.asset(
      'assets/images/hero_avatar.png',
      fit: BoxFit.cover,
      errorBuilder: (context, error, stackTrace) => Container(
        color: AppColors.surfaceCard,
        child: Icon(
          Icons.person_outline,
          size: size * 0.55,
          color: AppColors.textMuted,
        ),
      ),
    );
  }
}
