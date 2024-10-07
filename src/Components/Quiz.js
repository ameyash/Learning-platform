import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import confetti from 'canvas-confetti'

export default function Quiz() {
  const { id } = useParams()
  const [quiz, setQuiz] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [result, setResult] = useState(null)
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    // In a real application, this would be an API call
    setQuiz({
      id: Number(id),
      title: "React Basics Quiz",
      questions: [
        {
          id: 1,
          text: "What is a React component?",
          options: ["A function", "A class", "Both A and B", "None of the above"],
          correctAnswer: "Both A and B"
        },
        {
          id: 2,
          text: "What is JSX?",
          options: ["JavaScript XML", "Java Syntax Extension", "JSON XML", "JavaScript Extension"],
          correctAnswer: "JavaScript XML"
        },
        {
          id: 3,
          text: "Which hook is used for side effects in React?",
          options: ["useState", "useEffect", "useContext", "useReducer"],
          correctAnswer: "useEffect"
        },
      ],
    })
  }, [id])

  const handleAnswer = (answer) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = answer
    setAnswers(newAnswers)

    // Check if the answer is correct
    const currentQuestion = quiz.questions[currentQuestionIndex]
    if (answer === currentQuestion.correctAnswer) {
      setFeedback({ isCorrect: true, message: "Correct! Well done!" })
    } else {
      setFeedback({ isCorrect: false, message: `Incorrect. The correct answer is: ${currentQuestion.correctAnswer}` })
    }
  }

  const handleNext = () => {
    setFeedback(null) // Clear feedback for the next question
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    const score = answers.filter((answer, index) => {
      return answer === quiz.questions[index].correctAnswer
    }).length

    setResult({
      score: score,
      totalQuestions: quiz.questions.length,
      pointsEarned: score * 100,
    })

    celebrateCompletion()
  }

  const celebrateCompletion = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }

  if (!quiz) {
    return <div>Loading...</div>
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-2xl font-bold">{quiz.title}</h2>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        <div className="p-4">
          {!result ? (
            <>
              <h3 className="text-xl font-semibold mb-4">Question {currentQuestionIndex + 1}</h3>
              <p className="mb-4">{currentQuestion.text}</p>
              <div className="space-y-2">
                {currentQuestion.options.map((option, index) => (
                  <label key={index} className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-gray-100 transition duration-150 ease-in-out">
                    <input
                      type="radio"
                      name="answer"
                      value={option}
                      checked={answers[currentQuestionIndex] === option}
                      onChange={() => handleAnswer(option)}
                      className="form-radio text-blue-600"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              {feedback && (
                <div className={`mt-4 p-2 rounded ${feedback.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {feedback.message}
                </div>
              )}
            </>
          ) : (
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Quiz Completed!</h3>
              <p className="text-xl mb-2">Your Score: {result.score}/{result.totalQuestions}</p>
              <p className="text-lg mb-4">Points Earned: {result.pointsEarned}</p>
            </div>
          )}
        </div>
        <div className="p-4 border-t flex justify-end">
          {!result && (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
            >
              {currentQuestionIndex === quiz.questions.length - 1 ? "Finish" : "Next"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}