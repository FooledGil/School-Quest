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

  const AvatarWidget({
    super.key,
    this.avatar,
    this.avatarSeed,
    this.size = 48,
    this.borderWidth = 2,
    this.borderColor,
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
    final border = borderColor ?? AppColors.primaryLight.withOpacity(0.5);

    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(color: border, width: borderWidth),
        color: AppColors.bgCardLighter,
      ),
      child: ClipOval(
        child: url.isNotEmpty
            ? CachedNetworkImage(
                imageUrl: url,
                fit: BoxFit.cover,
                placeholder: (context, url) => Center(
                  child: SizedBox(
                    width: size * 0.4,
                    height: size * 0.4,
                    child: const CircularProgressIndicator(
                      strokeWidth: 2,
                      color: AppColors.primaryLight,
                    ),
                  ),
                ),
                errorWidget: (context, url, error) => _fallbackSilhouette(),
              )
            : _fallbackSilhouette(),
      ),
    );
  }

  Widget _fallbackSilhouette() {
    return Container(
      color: AppColors.bgCardLighter,
      child: Icon(
        Icons.person_outline,
        size: size * 0.55,
        color: AppColors.textMuted,
      ),
    );
  }
}
