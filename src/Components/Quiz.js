import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import axios from 'axios';

export default function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (id) {
      fetchQuiz();
    }
  }, [id]);

  const fetchQuiz = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/quizzes/${id}`);
      setQuiz(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
      showNotification('Failed to load quiz. Please try again.', 'error');
    }
  };

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`http://localhost:8080/api/quizzes/${id}/user/${user.id}/take`, { answers });
      const score = answers.filter((answer, index) => answer === quiz[index].correctAnswer).length;
      setResult({
        score: score,
        totalQuestions: quiz.length,
        pointsEarned: score * 100,
      });
      celebrateCompletion();
    } catch (error) {
      setError(error);
      showNotification('Failed to submit quiz. Please try again.', 'error');
    }
  };

  const celebrateCompletion = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  if (!token) {
    navigate("/login");
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error loading quiz</h2>
        <p>{error.message}</p>
        <button onClick={fetchQuiz} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out">
          Try Again
        </button>
      </div>
    );
  }

  const currentQuestion = quiz[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.length) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-md ${notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'} text-white`}>
          {notification.message}
        </div>
      )}
      <div className="w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-2xl font-bold">Quiz Challenge</h2>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <div className="p-4">
          {!result ? (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Question {currentQuestionIndex + 1}</h3>
              <p className="mb-4">{currentQuestion.questionText}</p>
              <div className="space-y-2">
                {['option1', 'option2', 'option3', 'option4'].map((option, index) => (
                  <label
                    key={index}
                    className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-gray-100 transition duration-150 ease-in-out"
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={currentQuestion[option]}
                      checked={answers[currentQuestionIndex] === currentQuestion[option]}
                      onChange={() => handleAnswer(currentQuestion[option])}
                      className="form-radio text-blue-600"
                    />
                    <span>{currentQuestion[option]}</span>
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
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
              disabled={!answers[currentQuestionIndex]}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out disabled:opacity-50"
            >
              {currentQuestionIndex === quiz.length - 1 ? "Finish" : "Next"}
              <svg className="inline-block ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}