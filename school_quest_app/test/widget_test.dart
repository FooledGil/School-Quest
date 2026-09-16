import 'package:flutter_test/flutter_test.dart';
import 'package:school_quest_app/main.dart';

void main() {
  testWidgets('SchoolQuestApp smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const SchoolQuestApp());
    expect(find.byType(SchoolQuestApp), findsOneWidget);
  });
}
