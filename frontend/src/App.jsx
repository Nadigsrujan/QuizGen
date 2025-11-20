import { useState } from "react";

export default function App() {
  const [subject, setSubject] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState("medium");
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizStarted, setQuizStarted] = useState(false);

  const API_URL = "https://quizgen-vff1.onrender.com";

  const generateQuiz = async () => {
    if (!subject) {
      setError("Please enter a subject or topic.");
      return;
    }
    setLoading(true);
    setError("");
    setQuizStarted(false);
    setSelectedAnswers({});

    try {
      const res = await fetch(`${API_URL}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: subject,
          quiz_type: "mcq",
          num_questions: numQuestions,
          difficulty: difficulty,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate quiz");

      const data = await res.json();
      const quizData = data.quiz?.questions?.questions || data.quiz?.questions || [];
      setQuiz(quizData);
      setQuizStarted(true);
      console.log("Received Quiz:", quizData);
    } catch (err) {
      console.error(err);
      setError("Failed to generate quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionClick = (questionIndex, selectedOption) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: selectedOption,
    });
  };

  const resetQuiz = () => {
    setQuiz([]);
    setSelectedAnswers({});
    setQuizStarted(false);
    setSubject("");
  };
const calculateScore = () => {
  let correct = 0;

  quiz.forEach((q, idx) => {
    const selectedOption = selectedAnswers[idx];

    // If question not answered, skip it
    if (!selectedOption) return;

    const selectedLetter = selectedOption.trim().charAt(0);
    const correctLetter = q.answer.trim().charAt(0);

    // Debug logs (optional)
    console.log(`Q${idx + 1}`);
    console.log("Selected:", selectedOption);
    console.log("Correct:", q.answer);
    console.log("SelectedLetter:", selectedLetter, "CorrectLetter:", correctLetter);

    if (selectedLetter === correctLetter) {
      correct++;
    }
  });

  console.log("Final Score:", correct);
  return correct;
};



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          🤖 Quiz Forge AI
        </h1>

        {!quizStarted && (
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700">
            <label className="block mb-6">
              <span className="text-xl font-semibold text-blue-300">Enter a topic:</span>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-3 w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none transition"
                placeholder="e.g. Data Structures, AI, Solar Energy..."
                onKeyPress={(e) => e.key === 'Enter' && generateQuiz()}
              />
            </label>

            <label className="block mb-6">
              <span className="text-xl font-semibold text-blue-300">Number of Questions:</span>
              <input
                type="number"
                value={numQuestions}
                min="1"
                max="10"
                onChange={(e) => setNumQuestions(parseInt(e.target.value) || 1)}
                className="mt-3 w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none transition"
              />
            </label>

            <label className="block mb-6">
              <span className="text-xl font-semibold text-blue-300">Difficulty Level:</span>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="mt-3 w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none transition cursor-pointer"
              >
                <option value="easy">🟢 Easy</option>
                <option value="medium">🟡 Medium</option>
                <option value="hard">🔴 Hard</option>
              </select>
            </label>

            <button
              onClick={generateQuiz}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold p-4 rounded-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? "🔄 Generating Quiz..." : "✨ Generate Quiz"}
            </button>

            {error && (
              <div className="mt-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-center">
                <p className="text-red-300">{error}</p>
              </div>
            )}
          </div>
        )}

        {quizStarted && quiz.length > 0 && (
          <div className="space-y-6">
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm p-4 rounded-xl border border-gray-700 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold text-green-400">
                  📝 Quiz: {subject}
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  {difficulty === "easy" && "🟢 Easy"} 
                  {difficulty === "medium" && "🟡 Medium"} 
                  {difficulty === "hard" && "🔴 Hard"} 
                  {" • "}{quiz.length} Questions
                </p>
              </div>
              <button
                onClick={resetQuiz}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
              >
                🔄 New Quiz
              </button>
            </div>

            {Object.keys(selectedAnswers).length === quiz.length && (
              <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 rounded-xl text-center">
                <h3 className="text-3xl font-bold mb-2">🎉 Quiz Complete!</h3>
                <p className="text-xl">
                  Your Score: {calculateScore()} / {quiz.length}
                </p>
              </div>
            )}

            {quiz.map((q, idx) => {
              const optionLetter = (opt) => opt.trim().charAt(0); // Extracts A,B,C,D
              const correctLetter = q.answer.trim().charAt(0);
              const isAnswered = selectedAnswers.hasOwnProperty(idx);
              const selectedOption = selectedAnswers[idx];
              const correctAnswer = q.answer;

              return (
                <div
                  key={idx}
                  className="bg-gray-800 bg-opacity-50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-700 transition-all hover:border-gray-600"
                >
                  <p className="font-bold text-xl mb-4 text-blue-300">
                    Q{idx + 1}. {q.question}
                  </p>

                  {q.options?.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {q.options.map((opt, i) => {
                        const isSelected = selectedOption === opt;
                        const isCorrect = optionLetter(opt) === correctLetter;
                        
                        let buttonStyle = "bg-gray-700 hover:bg-gray-600 border-gray-600";
                        
                        if (isAnswered) {
                          if (isCorrect) {
                            buttonStyle = "bg-green-600 border-green-500";
                          } else if (isSelected && !isCorrect) {
                            buttonStyle = "bg-red-600 border-red-500";
                          } else {
                            buttonStyle = "bg-gray-700 border-gray-600 opacity-60";
                          }
                        } else if (isSelected) {
                          buttonStyle = "bg-blue-600 border-blue-500";
                        }

                        return (
                          <button
                            key={i}
                            onClick={() => !isAnswered && handleOptionClick(idx, opt)}
                            disabled={isAnswered}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${buttonStyle} ${
                              !isAnswered ? "cursor-pointer transform hover:scale-102" : "cursor-default"
                            }`}
                          >
       
                            {opt}
                            {isAnswered && isCorrect && (
                              <span className="float-right">✅</span>
                            )}
                            {isAnswered && isSelected && !isCorrect && (
                              <span className="float-right">❌</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {isAnswered && (
                    <div className="mt-4 space-y-2 border-t border-gray-700 pt-4">
                      <div className="bg-green-900 bg-opacity-30 p-3 rounded-lg border border-green-700">
                        <p className="text-green-300">
                          <strong>✓ Correct Answer:</strong> {correctAnswer}
                        </p>
                      </div>
                      {q.explanation && (
                        <div className="bg-blue-900 bg-opacity-30 p-3 rounded-lg border border-blue-700">
                          <p className="text-blue-200">
                            <strong>💡 Explanation:</strong> {q.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
