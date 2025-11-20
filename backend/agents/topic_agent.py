import os
import json
from langchain_groq import ChatGroq
from dotenv import load_dotenv

load_dotenv()

class TopicAgent:
    def __init__(self):
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY not set in environment")
        self.llm = ChatGroq(model="qwen/qwen3-32b")

    def analyze(self, topic_text):
        prompt = f"Summarize or expand the topic '{topic_text}' into 2-3 key subtopics for quiz generation."
        response = self.llm.invoke(prompt)
        return response.content.strip()


    def generate_quiz(self, subject, num_questions=5):
        prompt = f"""
        Create a quiz with {num_questions} multiple-choice questions about "{subject}".
        Each question should have 4 options and specify the correct answer.
        Format the output as a JSON list of objects like:
        [
            {{
                "question": "...",
                "options": ["A", "B", "C", "D"],
                "answer": "A"
            }}
        ]
        """

        # ✅ Use LangChain's invoke()
        response = self.llm.invoke(prompt)
        text = response.content.strip()

        try:
            return json.loads(text)
        except json.JSONDecodeError:
            # fallback if model returns non-JSON
            return [{"question": text, "options": [], "answer": ""}]
