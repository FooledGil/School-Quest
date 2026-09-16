class ScheduleModel {
  final int id;
  final String subjectName;
  final String? teacher;
  final String timeStart;
  final String timeEnd;
  final int dayOfWeek;

  ScheduleModel({
    required this.id,
    required this.subjectName,
    this.teacher,
    required this.timeStart,
    required this.timeEnd,
    required this.dayOfWeek,
  });

  factory ScheduleModel.fromJson(Map<String, dynamic> json) {
    return ScheduleModel(
      id: json['id'] ?? 0,
      subjectName: json['subject']?['name'] ?? 'Mata Pelajaran',
      teacher: json['teacher'] ?? json['subject']?['teacher'],
      timeStart: json['time_start'] ?? '',
      timeEnd: json['time_end'] ?? '',
      dayOfWeek: json['day_of_week'] ?? 1,
    );
  }
}

class PiketMemberModel {
  final int userId;
  final String name;
  final String? avatar;
  final String? avatarSeed;

  PiketMemberModel({
    required this.userId,
    required this.name,
    this.avatar,
    this.avatarSeed,
  });

  factory PiketMemberModel.fromJson(Map<String, dynamic> json) {
    final user = json['user'] ?? {};
    return PiketMemberModel(
      userId: user['id'] ?? json['user_id'] ?? 0,
      name: user['name'] ?? 'Siswa',
      avatar: user['avatar'],
      avatarSeed: user['avatar_seed'],
    );
  }
}
