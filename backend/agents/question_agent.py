import os
import json
import re
from langchain_groq import ChatGroq
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(
    model_name="qwen/qwen3-32b",
    groq_api_key=os.getenv("GROQ_API_KEY")
)

class QuestionAgent:
    def generate(self, topic_text: str, quiz_type: str = 'mcq', num: int = 5, difficulty: str = 'medium'):
        prompt = self._build_prompt(topic_text, quiz_type, num, difficulty)
        resp = llm.invoke(prompt)
        raw = resp.content

        # Try parsing JSON
        try:
            data = json.loads(raw)
        except Exception:
            m = re.search(r'\[\{.*\}\]', raw, re.S)
            if m:
                data = json.loads(m.group(0))
            else:
                data = [{"question": "Parsing failed.", "options": [], "answer": ""}]
        return data

    def _build_prompt(self, topic, quiz_type, num, difficulty):
        return (
            f"Generate {num} {quiz_type.upper()} questions about the following topic:\n\n{topic}\n\n"
            "Return ONLY valid JSON array: [{\n"
            "  \"question\": \"...\",\n"
            "  \"options\": [\"A\", \"B\", \"C\", \"D\"],\n"
            "  \"answer\": \"A\",\n"
            "  \"explanation\": \"...\"\n"
            "}]\n"
            f"Difficulty: {difficulty}. Keep questions clear and unambiguous."
        )
