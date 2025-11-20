class CompilerAgent:
  def compile(self, validated_questions, quiz_type='mcq'):
    # Add serial numbers and light metadata
    compiled = []
    for i, q in enumerate(validated_questions, start=1):
      compiled.append({
      'id': i,
      'question': q['question'],
      'options': q.get('options', []),
      'answer': q['answer'],
      'explanation': q.get('explanation', '')
      })
    return {'title': 'Generated Quiz', 'type': quiz_type, 'questions': compiled}