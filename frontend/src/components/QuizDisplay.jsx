import React, { useState } from "react";
import { CheckCircle, XCircle, Award, RotateCcw, Eye, EyeOff } from "lucide-react";

export default function QuizDisplay({ quiz }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showAnswers, setShowAnswers] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!quiz || quiz.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400 bg-gray-800/50 rounded-lg border border-gray-700">
        <p className="text-lg">No quiz yet.</p>
        <p className="text-sm mt-2">Generate a quiz to get started!</p>
      </div>
    );
  }

  const handleOptionSelect = (questionIdx, option) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIdx]: option
    }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setShowAnswers(true);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setShowAnswers(false);
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        correct++;
      }
    });
    return correct;
  };

  const score = submitted ? calculateScore() : 0;
  const percentage = submitted ? Math.round((score / quiz.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg">
        <h2 className="font-bold text-2xl text-white flex items-center gap-2">
          <Award className="w-7 h-7" />
          Quiz Challenge
        </h2>
        <p className="text-blue-100 mt-1">{quiz.length} questions</p>
      </div>

      {/* Score Card */}
      {submitted && (
        <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 shadow-lg animate-in fade-in duration-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Your Score</h3>
              <p className="text-gray-400">
                {score} out of {quiz.length} correct
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                {percentage}%
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {percentage >= 80 ? "Excellent!" : percentage >= 60 ? "Good job!" : "Keep practicing!"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Questions */}
      <div className="space-y-4">
        {quiz.map((q, idx) => {
          const isAnswered = selectedAnswers[idx] !== undefined;
          const isCorrect = submitted && selectedAnswers[idx] === q.answer;
          
          return (
            <div
              key={idx}
              className={`p-6 rounded-lg border transition-all duration-300 ${
                submitted
                  ? isCorrect
                    ? "bg-green-900/20 border-green-600"
                    : isAnswered
                    ? "bg-red-900/20 border-red-600"
                    : "bg-gray-800 border-gray-700"
                  : "bg-gray-800 border-gray-700 hover:border-gray-600"
              }`}
            >
              {/* Question */}
              <div className="flex items-start gap-3 mb-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  {idx + 1}
                </span>
                <p className="font-semibold text-lg text-white flex-1">
                  {q.question}
                </p>
                {submitted && (
                  <div className="flex-shrink-0">
                    {isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : isAnswered ? (
                      <XCircle className="w-6 h-6 text-red-500" />
                    ) : (
                      <XCircle className="w-6 h-6 text-gray-500" />
                    )}
                  </div>
                )}
              </div>

              {/* Options */}
              {q.options && q.options.length > 0 && (
                <div className="space-y-2 ml-11">
                  {q.options.map((opt, i) => {
                    const isSelected = selectedAnswers[idx] === opt;
                    const isCorrectOption = opt === q.answer;
                    
                    return (
                      <button
                        key={i}
                        onClick={() => handleOptionSelect(idx, opt)}
                        disabled={submitted}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                          submitted
                            ? isCorrectOption
                              ? "bg-green-900/30 border-green-500 text-white"
                              : isSelected
                              ? "bg-red-900/30 border-red-500 text-white"
                              : "bg-gray-700/50 border-gray-600 text-gray-300"
                            : isSelected
                            ? "bg-blue-600 border-blue-500 text-white shadow-lg"
                            : "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600 hover:border-gray-500"
                        } ${submitted ? "cursor-default" : "cursor-pointer"}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            submitted
                              ? isCorrectOption
                                ? "border-green-500 bg-green-500"
                                : isSelected
                                ? "border-red-500 bg-red-500"
                                : "border-gray-500"
                              : isSelected
                              ? "border-white bg-white"
                              : "border-gray-400"
                          }`}>
                            {((submitted && isCorrectOption) || (!submitted && isSelected)) && (
                              <div className="w-3 h-3 rounded-full bg-white" />
                            )}
                          </span>
                          <span className="flex-1">{opt}</span>
                          {submitted && isCorrectOption && (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          )}
                          {submitted && isSelected && !isCorrectOption && (
                            <XCircle className="w-5 h-5 text-red-400" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Answer and Explanation */}
              {showAnswers && (
                <div className="mt-4 ml-11 space-y-2 animate-in fade-in duration-300">
                  <div className="p-3 bg-green-900/20 border border-green-700 rounded-lg">
                    <p className="text-green-400 text-sm font-semibold">
                      ✓ Correct Answer: {q.answer}
                    </p>
                  </div>
                  {q.explanation && (
                    <div className="p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
                      <p className="text-blue-300 text-sm">
                        💡 {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        {!submitted ? (
          <>
            <button
              onClick={handleSubmit}
              disabled={Object.keys(selectedAnswers).length === 0}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Submit Quiz
            </button>
            <button
              onClick={() => setShowAnswers(!showAnswers)}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-all duration-200 flex items-center gap-2"
            >
              {showAnswers ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              {showAnswers ? "Hide" : "Show"} Answers
            </button>
          </>
        ) : (
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}