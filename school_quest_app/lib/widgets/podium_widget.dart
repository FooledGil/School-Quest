import 'package:flutter/material.dart';
import '../core/constants/app_colors.dart';
import '../models/leaderboard_model.dart';
import 'avatar_widget.dart';

class PodiumWidget extends StatelessWidget {
  final List<LeaderboardEntryModel> topThree;

  const PodiumWidget({super.key, required this.topThree});

  @override
  Widget build(BuildContext context) {
    if (topThree.isEmpty) return const SizedBox.shrink();

    final first = topThree.isNotEmpty ? topThree[0] : null;
    final second = topThree.length > 1 ? topThree[1] : null;
    final third = topThree.length > 2 ? topThree[2] : null;

    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          // 2nd Place (Silver)
          if (second != null)
            Expanded(
              child: _buildPodiumColumn(
                entry: second,
                rank: 2,
                height: 110,
                color: AppColors.silver,
                title: '2nd',
              ),
            )
          else
            const Spacer(),

          const SizedBox(width: 8),

          // 1st Place (Gold)
          if (first != null)
            Expanded(
              child: _buildPodiumColumn(
                entry: first,
                rank: 1,
                height: 140,
                color: AppColors.gold,
                title: '1st',
                isWinner: true,
              ),
            )
          else
            const Spacer(),

          const SizedBox(width: 8),

          // 3rd Place (Bronze)
          if (third != null)
            Expanded(
              child: _buildPodiumColumn(
                entry: third,
                rank: 3,
                height: 90,
                color: AppColors.bronze,
                title: '3rd',
              ),
            )
          else
            const Spacer(),
        ],
      ),
    );
  }

  Widget _buildPodiumColumn({
    required LeaderboardEntryModel entry,
    required int rank,
    required double height,
    required Color color,
    required String title,
    bool isWinner = false,
  }) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        // Crown icon for #1
        if (isWinner)
          const Padding(
            padding: EdgeInsets.only(bottom: 4),
            child: Icon(Icons.military_tech, color: AppColors.gold, size: 28),
          ),

        // Avatar with ranking ring
        Stack(
          alignment: Alignment.bottomRight,
          children: [
            AvatarWidget(
              avatar: entry.avatar,
              avatarSeed: entry.avatarSeed,
              size: isWinner ? 64 : 52,
              borderWidth: 3,
              borderColor: color,
            ),
            Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: color,
                shape: BoxShape.circle,
                border: Border.all(color: AppColors.bgDark, width: 2),
              ),
              child: Text(
                '$rank',
                style: const TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  color: Colors.black,
                ),
              ),
            ),
          ],
        ),

        const SizedBox(height: 6),

        // Student Name
        Text(
          entry.name,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: isWinner ? 13 : 11,
            fontWeight: FontWeight.bold,
            color: AppColors.textPrimary,
          ),
        ),

        // EXP
        Text(
          '${entry.exp} EXP',
          style: TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.w600,
            color: color,
          ),
        ),

        const SizedBox(height: 8),

        // Podium Pedestal
        Container(
          height: height,
          width: double.infinity,
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                color.withOpacity(0.35),
                color.withOpacity(0.08),
              ],
            ),
            borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
            border: Border.all(color: color.withOpacity(0.5), width: 1.5),
            boxShadow: [
              BoxShadow(
                color: color.withOpacity(0.2),
                blurRadius: 10,
                offset: const Offset(0, -2),
              ),
            ],
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                title,
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w900,
                  color: color,
                  letterSpacing: 1,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                entry.studentClass,
                style: TextStyle(
                  fontSize: 10,
                  color: AppColors.textMuted,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
