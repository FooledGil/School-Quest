import 'package:flutter/material.dart';
import '../core/constants/app_colors.dart';
import '../models/leaderboard_model.dart';
import 'avatar_widget.dart';

class PodiumWidget extends StatelessWidget {
  final List<LeaderboardEntryModel> topThree;
  final int? currentUserId;

  const PodiumWidget({
    super.key,
    required this.topThree,
    this.currentUserId,
  });

  @override
  Widget build(BuildContext context) {
    if (topThree.isEmpty) return const SizedBox.shrink();

    final first = topThree.isNotEmpty ? topThree[0] : null;
    final second = topThree.length > 1 ? topThree[1] : null;
    final third = topThree.length > 2 ? topThree[2] : null;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          // Rank 2: Silver Left Pedestal
          Expanded(
            child: second != null
                ? _buildPedestal(
                    entry: second,
                    rank: 2,
                    pedestalHeight: 140,
                    rankColor: AppColors.silver,
                    isWinner: false,
                    isMe: currentUserId != null && second.id == currentUserId,
                  )
                : const SizedBox.shrink(),
          ),
          const SizedBox(width: 8),

          // Rank 1: Gold Center Pedestal (Elevated)
          Expanded(
            child: first != null
                ? _buildPedestal(
                    entry: first,
                    rank: 1,
                    pedestalHeight: 175,
                    rankColor: AppColors.gold,
                    isWinner: true,
                    isMe: currentUserId != null && first.id == currentUserId,
                  )
                : const SizedBox.shrink(),
          ),
          const SizedBox(width: 8),

          // Rank 3: Bronze Right Pedestal
          Expanded(
            child: third != null
                ? _buildPedestal(
                    entry: third,
                    rank: 3,
                    pedestalHeight: 120,
                    rankColor: AppColors.bronze,
                    isWinner: false,
                    isMe: currentUserId != null && third.id == currentUserId,
                  )
                : const SizedBox.shrink(),
          ),
        ],
      ),
    );
  }

  Widget _buildPedestal({
    required LeaderboardEntryModel entry,
    required int rank,
    required double pedestalHeight,
    required Color rankColor,
    required bool isWinner,
    required bool isMe,
  }) {
    final avatarSize = isWinner ? 64.0 : 50.0;

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        // Avatar + Crown / Medallion + Rank Badge
        Stack(
          clipBehavior: Clip.none,
          alignment: Alignment.topCenter,
          children: [
            // Ambient Aura for Winner
            if (isWinner)
              Positioned(
                top: -6,
                child: Container(
                  width: avatarSize + 20,
                  height: avatarSize + 20,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.gold.withOpacity(0.3),
                        blurRadius: 18,
                        spreadRadius: 4,
                      ),
                    ],
                  ),
                ),
              ),

            // Crown or Medallion Icon on top
            Positioned(
              top: isWinner ? -22 : -16,
              child: Icon(
                isWinner ? Icons.emoji_events : Icons.workspace_premium,
                color: rankColor,
                size: isWinner ? 24 : 18,
              ),
            ),

            // Avatar Container
            Padding(
              padding: const EdgeInsets.only(top: 4, bottom: 8),
              child: AvatarWidget(
                avatar: entry.avatar,
                avatarSeed: entry.avatarSeed,
                size: avatarSize,
                borderWidth: isWinner ? 2.5 : 2.0,
                borderColor: rankColor,
              ),
            ),

            // Rank Badge Chip (#1, #2, #3)
            Positioned(
              bottom: 0,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: isWinner ? AppColors.primaryContainer : rankColor,
                  borderRadius: BorderRadius.circular(9999),
                  border: Border.all(color: AppColors.surfaceDeep, width: 1.5),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.35),
                      blurRadius: 4,
                    ),
                  ],
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      '#$rank',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w900,
                        color: isWinner ? AppColors.surfaceDeep : AppColors.surfaceDeep,
                      ),
                    ),
                    if (isMe) ...[
                      const SizedBox(width: 3),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 3, vertical: 0.5),
                        decoration: BoxDecoration(
                          color: AppColors.surfaceDeep.withOpacity(0.5),
                          borderRadius: BorderRadius.circular(3),
                        ),
                        child: const Text(
                          'KAMU',
                          style: TextStyle(
                            fontSize: 8,
                            fontWeight: FontWeight.w800,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
          ],
        ),

        const SizedBox(height: 6),

        // Stepped Pedestal Box
        Container(
          height: pedestalHeight,
          width: double.infinity,
          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 8),
          decoration: BoxDecoration(
            color: isWinner ? AppColors.surfaceCardElevated : AppColors.surfaceCard,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(14)),
            border: Border.all(
              color: isWinner ? AppColors.gold.withOpacity(0.5) : AppColors.borderPixel,
              width: 1,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(isWinner ? 0.45 : 0.25),
                blurRadius: isWinner ? 12 : 6,
                offset: const Offset(0, -2),
              ),
            ],
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Top highlight gradient line
              if (isWinner)
                Container(
                  height: 2,
                  width: double.infinity,
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      colors: [AppColors.amberGlow, AppColors.primary, AppColors.amberGlow],
                    ),
                  ),
                ),

              // Student Info
              Column(
                children: [
                  Text(
                    entry.name,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: isWinner ? 13 : 11.5,
                      fontWeight: FontWeight.w700,
                      color: isWinner ? AppColors.amberGlow : AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 1),
                  Text(
                    entry.studentClass,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 10,
                      color: AppColors.textMuted,
                    ),
                  ),
                ],
              ),

              // EXP Metric Box
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 2),
                decoration: BoxDecoration(
                  color: AppColors.surfaceDeep,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: AppColors.borderPixel, width: 0.5),
                ),
                child: Column(
                  children: [
                    Text(
                      '${entry.exp}',
                      style: TextStyle(
                        fontSize: isWinner ? 16 : 13,
                        fontWeight: FontWeight.w900,
                        color: rankColor,
                        letterSpacing: -0.3,
                      ),
                    ),
                    Text(
                      'EXP',
                      style: TextStyle(
                        fontSize: 8.5,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 0.8,
                        color: AppColors.textMuted,
                      ),
                    ),
                  ],
                ),
              ),

              // Tier Color Bottom Bar
              Container(
                height: 3,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: rankColor.withOpacity(0.5),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
