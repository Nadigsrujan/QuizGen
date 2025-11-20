class ValidatorAgent:
  def validate(self, questions):
    # Basic validation: ensure each item has required fields
    valid = []
    for q in questions:
      if not isinstance(q, dict):
        continue
      if 'question' not in q or 'answer' not in q:
        continue
    # normalize options
      q['options'] = q.get('options', [])
      q['explanation'] = q.get('explanation', '')
      valid.append(q)
    return valid