import sys
import io
import os
from fastapi import FastAPI, UploadFile, File, Form
from pydantic import BaseModel
from backend.agents.topic_agent import TopicAgent
from backend.agents.question_agent import QuestionAgent
from backend.agents.validator_agent import ValidatorAgent
from backend.agents.compiler_agent import CompilerAgent
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv
load_dotenv()

api_key = os.getenv("GROQ_API_KEY")
app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "Server is running successfully!"}


app.add_middleware(
CORSMiddleware,
allow_origins=["*"],
allow_credentials=True,
allow_methods=["*"],
allow_headers=["*"],
)


class GenerateRequest(BaseModel):
  topic: str
  quiz_type: str = "mcq"
  num_questions: int = 5
  difficulty: str = "medium"


@app.post('/generate')
async def generate(req: GenerateRequest):
  topic_agent = TopicAgent()
  q_agent = QuestionAgent()
  validator = ValidatorAgent()
  compiler = CompilerAgent()

  refined = topic_agent.analyze(req.topic)
  raw = q_agent.generate(refined, req.quiz_type, req.num_questions, req.difficulty)
  validated = validator.validate(raw)
  final = compiler.compile(validated, req.quiz_type)
  return {
    "quiz": {
        "title": f"Quiz on {req.topic}",
        "questions": final
    }
}



@app.post('/generate_with_file')
async def generate_with_file(topic: str = Form(...), file: UploadFile = File(None)):
  text = ""
  if file:
    content = await file.read()
    # simple PDF/text extraction
    from utils.pdf_parser import extract_text
    text = extract_text(io.BytesIO(content), file.filename)
  source = topic + "\n" + (text or "")
  return await generate(GenerateRequest(topic=source))


if __name__ == '__main__':
  import uvicorn
  uvicorn.run(app, host='0.0.0.0', port=8000)