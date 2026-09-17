import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import '../core/constants/app_colors.dart';

class CastleIntroOverlay extends StatefulWidget {
  final VoidCallback onComplete;

  const CastleIntroOverlay({
    super.key,
    required this.onComplete,
  });

  @override
  State<CastleIntroOverlay> createState() => _CastleIntroOverlayState();
}

class _CastleIntroOverlayState extends State<CastleIntroOverlay>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _flashAnimation;
  late Animation<double> _fadeTextAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2800),
    );

    // Zoom into castle gate
    _scaleAnimation = Tween<double>(begin: 1.0, end: 2.8).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.0, 0.85, curve: Curves.easeInOutCubic),
      ),
    );

    // Divine golden flash near completion
    _flashAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.75, 0.98, curve: Curves.easeIn),
      ),
    );

    // Text fading
    _fadeTextAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.1, 0.4, curve: Curves.easeOut),
      ),
    );

    _controller.forward();

    _controller.addStatusListener((status) {
      if (status == AnimationStatus.completed) {
        widget.onComplete();
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _skip() {
    _controller.stop();
    widget.onComplete();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.surfaceDeep,
      body: Stack(
        fit: StackFit.expand,
        children: [
          // Animated Zooming Castle SVG
          AnimatedBuilder(
            animation: _scaleAnimation,
            builder: (context, child) {
              return Transform.scale(
                scale: _scaleAnimation.value,
                alignment: const Alignment(0.0, 0.15), // Target the castle gate
                child: SvgPicture.asset(
                  'assets/svg/castle_scene.svg',
                  fit: BoxFit.cover,
                  placeholderBuilder: (context) => Container(
                    color: AppColors.surfaceDeep,
                    child: const Center(
                      child: CircularProgressIndicator(color: AppColors.manaCyan),
                    ),
                  ),
                ),
              );
            },
          ),

          // Vignette & Dark Tint
          Container(
            decoration: BoxDecoration(
              gradient: RadialGradient(
                center: Alignment.center,
                radius: 1.2,
                colors: [
                  Colors.transparent,
                  AppColors.surfaceDeep.withOpacity(0.6),
                  AppColors.surfaceDeep.withOpacity(0.9),
                ],
              ),
            ),
          ),

          // Bottom Cinematic Prompt & Text
          Positioned(
            left: 20,
            right: 20,
            bottom: 60,
            child: FadeTransition(
              opacity: _fadeTextAnimation,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                    decoration: BoxDecoration(
                      color: AppColors.surfaceDeep.withOpacity(0.85),
                      borderRadius: BorderRadius.circular(9999),
                      border: Border.all(color: AppColors.gold.withOpacity(0.5)),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.gold.withOpacity(0.25),
                          blurRadius: 10,
                        ),
                      ],
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.fort, color: AppColors.gold, size: 16),
                        SizedBox(width: 6),
                        Text(
                          'MEMASUKI THE REALM...',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 1.5,
                            color: AppColors.gold,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 10),
                  const Text(
                    'Membuka Gerbang Petualang Sekolah',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Divine Golden Flash near end
          AnimatedBuilder(
            animation: _flashAnimation,
            builder: (context, child) {
              return IgnorePointer(
                child: Container(
                  color: AppColors.goldLight.withOpacity(_flashAnimation.value),
                ),
              );
            },
          ),

          // Top Skip Button
          SafeArea(
            child: Align(
              alignment: Alignment.topRight,
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: TextButton.icon(
                  style: TextButton.styleFrom(
                    backgroundColor: AppColors.surfaceDeep.withOpacity(0.7),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                      side: const BorderSide(color: AppColors.borderPixel),
                    ),
                  ),
                  onPressed: _skip,
                  icon: const Icon(Icons.fast_forward, size: 16, color: AppColors.textPrimary),
                  label: const Text(
                    'LEWATI',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 0.8,
                      color: AppColors.textPrimary,
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
