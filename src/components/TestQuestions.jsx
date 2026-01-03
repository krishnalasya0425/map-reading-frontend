import test from "../entities/test.jsx";
import scoreAPI from "../entities/score.jsx";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiArrowLeft,
  FiArrowRight,
  FiAward
} from "react-icons/fi";
import { FaClipboardCheck } from "react-icons/fa";

const TestQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [correctAnswers, setCorrectAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [examMeta, setExamMeta] = useState(null);
  const [remainingSeconds, setRemainingSeconds] = useState(null);
  const [timerExpired, setTimerExpired] = useState(false);
  const [startedAt, setStartedAt] = useState(null);

  const { testId } = useParams();
  const student_id = localStorage.getItem("id");

  const startTest = async () => {
    try {
      setLoading(true);
      const res = await test.getQuestionsByTestId(testId);

      if (!res || !res.questions) {
        console.error("No questions found in response:", res);
        setQuestions([]);
        return;
      }

      setExamMeta(res);
      setQuestions(res.questions);

      const map = {};
      res.questions.forEach((q) => {
        if (q && q.id) {
          map[q.id] = q.answer;
        }
      });
      setCorrectAnswers(map);

      setStartedAt(new Date());
      handleExamTiming(res);
    } catch (err) {
      console.error("Error starting test:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExamTiming = (exam) => {
    const now = new Date();

    if (exam.exam_type === "UNTIMED") {
      return;
    }

    if (exam.exam_type === "TIMED") {
      const seconds = exam.duration_minutes * 60;
      setRemainingSeconds(seconds);
      return;
    }

    if (exam.exam_type === "FIXED_TIME") {
      const start = new Date(exam.start_time);
      const end = new Date(exam.end_time);

      if (now < start) {
        alert("Exam has not started yet");
        return;
      }

      if (now > end) {
        alert("Exam already ended");
        return;
      }

      const remaining = Math.floor((end - now) / 1000);
      setRemainingSeconds(remaining);
    }
  };

  useEffect(() => {
    if (remainingSeconds === null) return;

    if (remainingSeconds <= 0) {
      setTimerExpired(true);
      submitTest(true);
      return;
    }

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingSeconds]);

  useEffect(() => {
    startTest();
  }, [testId]);

  const handleAnswerChange = (qid, choice) => {
    setUserAnswers((prev) => ({ ...prev, [qid]: choice }));
  };

  const submitTest = async () => {
    let result = 0;

    questions.forEach((q) => {
      if (userAnswers[q.id] === correctAnswers[q.id]) result++;
    });

    setScore(result);

    await scoreAPI.postScore({
      test_set_id: examMeta?.test_set_id,
      student_id,
      score: result,
      total_questions: questions.length,
      started_at: startedAt,
      submitted_at: new Date(),
      answers: userAnswers,
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getScorePercentage = () => {
    return Math.round((score / questions.length) * 100);
  };

  const q = questions.length > 0 ? questions[currentIndex] : null;

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f0fdf4' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto mb-4" style={{ borderColor: '#074F06' }}></div>
          <p className="text-lg font-semibold text-gray-700">Loading questions...</p>
        </div>
      </div>
    );
  }

  // Timer Expired State
  if (timerExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#f0fdf4' }}>
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiClock size={40} className="text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-red-600 mb-3">
            Time's Up!
          </h2>
          <p className="text-gray-600 mb-6">
            Your test has been automatically submitted.
          </p>
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-red-800">
              Please wait while we process your results...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Result Page
  if (score !== null) {
    const percentage = getScorePercentage();
    const passed = score >= (examMeta?.pass_threshold || 5);

    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: '#f0fdf4' }}>
        <div className="max-w-4xl mx-auto">
          {/* Result Header */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6 text-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${passed ? 'bg-green-100' : 'bg-red-100'
              }`}>
              {passed ? (
                <FiCheckCircle size={48} className="text-green-600" />
              ) : (
                <FiXCircle size={48} className="text-red-600" />
              )}
            </div>

            <h2 className={`text-4xl font-bold mb-2 ${passed ? 'text-green-600' : 'text-red-600'}`}>
              {passed ? '🎉 Congratulations!' : 'Test Completed'}
            </h2>

            <p className="text-gray-600 mb-6">
              {passed ? 'You have passed the test!' : 'Keep practicing to improve your score'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-xl" style={{ backgroundColor: '#D5F2D5' }}>
                <p className="text-sm text-gray-600 mb-1">Your Score</p>
                <p className="text-3xl font-bold" style={{ color: '#074F06' }}>
                  {score} / {questions.length}
                </p>
              </div>

              <div className="p-4 rounded-xl" style={{ backgroundColor: '#D5F2D5' }}>
                <p className="text-sm text-gray-600 mb-1">Percentage</p>
                <p className="text-3xl font-bold" style={{ color: '#074F06' }}>
                  {percentage}%
                </p>
              </div>

              <div className="p-4 rounded-xl" style={{ backgroundColor: '#D5F2D5' }}>
                <p className="text-sm text-gray-600 mb-1">Pass Mark</p>
                <p className="text-3xl font-bold" style={{ color: '#074F06' }}>
                  {examMeta?.pass_threshold || 5} Questions
                </p>
              </div>
            </div>
          </div>

          {/* Answer Review */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold mb-4" style={{ color: '#074F06' }}>
              Answer Review
            </h3>

            {questions.map((q, idx) => {
              const isCorrect = userAnswers[q.id] === q.answer;

              return (
                <div
                  key={q.id}
                  className="bg-white rounded-xl shadow-lg p-6 border-2"
                  style={{ borderColor: isCorrect ? '#10b981' : '#ef4444' }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isCorrect ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                      {isCorrect ? (
                        <FiCheckCircle className="text-green-600" size={20} />
                      ) : (
                        <FiXCircle className="text-red-600" size={20} />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-gray-500">Q{idx + 1}.</span>
                        <h4 className="text-lg font-semibold text-gray-800">{q.question_text}</h4>
                      </div>
                    </div>
                  </div>

                  {/* MCQ Options */}
                  {q.options?.length > 0 && (
                    <div className="space-y-2 ml-14">
                      {q.options.map((opt) => {
                        const isCorrectOption = opt.key === q.answer;
                        const isChosenOption = userAnswers[q.id] === opt.key;

                        let bgColor = 'bg-gray-50';
                        let borderColor = 'border-gray-200';
                        let textColor = 'text-gray-700';

                        if (isCorrectOption) {
                          bgColor = 'bg-green-50';
                          borderColor = 'border-green-400';
                          textColor = 'text-green-800';
                        } else if (isChosenOption && !isCorrectOption) {
                          bgColor = 'bg-red-50';
                          borderColor = 'border-red-400';
                          textColor = 'text-red-800';
                        }

                        return (
                          <div
                            key={opt.option_id}
                            className={`p-3 rounded-lg border-2 ${bgColor} ${borderColor} ${textColor} flex items-center gap-2`}
                          >
                            {isCorrectOption && <FiCheckCircle className="text-green-600" size={16} />}
                            {isChosenOption && !isCorrectOption && <FiXCircle className="text-red-600" size={16} />}
                            <span><strong>{opt.key})</strong> {opt.value}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* True/False */}
                  {q.question_type === "tf" && (
                    <div className="space-y-2 ml-14">
                      {["True", "False"].map((val) => {
                        const isCorrectOption = q.answer === val;
                        const isChosenOption = userAnswers[q.id] === val;

                        let bgColor = 'bg-gray-50';
                        let borderColor = 'border-gray-200';
                        let textColor = 'text-gray-700';

                        if (isCorrectOption) {
                          bgColor = 'bg-green-50';
                          borderColor = 'border-green-400';
                          textColor = 'text-green-800';
                        } else if (isChosenOption && !isCorrectOption) {
                          bgColor = 'bg-red-50';
                          borderColor = 'border-red-400';
                          textColor = 'text-red-800';
                        }

                        return (
                          <div
                            key={val}
                            className={`p-3 rounded-lg border-2 ${bgColor} ${borderColor} ${textColor} flex items-center gap-2`}
                          >
                            {isCorrectOption && <FiCheckCircle className="text-green-600" size={16} />}
                            {isChosenOption && !isCorrectOption && <FiXCircle className="text-red-600" size={16} />}
                            <span>{val}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Test Taking UI
  const answeredCount = Object.keys(userAnswers).length;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#f0fdf4' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#074F06' }}>
                <FaClipboardCheck className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: '#074F06' }}>
                  {examMeta?.test_title || 'Test'}
                </h1>
                <p className="text-sm text-gray-600">
                  {examMeta?.exam_type} • {questions.length} Questions
                </p>
              </div>
            </div>

            {/* Timer */}
            {remainingSeconds !== null && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${remainingSeconds < 300 ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                <FiClock size={20} className={remainingSeconds < 300 ? 'text-red-600' : 'text-blue-600'} />
                <span className={`text-lg font-bold ${remainingSeconds < 300 ? 'text-red-600' : 'text-blue-600'
                  }`}>
                  {formatTime(remainingSeconds)}
                </span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentIndex + 1} of {questions.length}</span>
              <span>{answeredCount} answered</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                  backgroundColor: '#074F06'
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="mb-6">
            {q && (
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: '#074F06' }}>
                  {currentIndex + 1}
                </div>
                <h2 className="text-xl font-semibold text-gray-800 flex-1">
                  {q.question_text}
                </h2>
              </div>
            )}

            {q && !userAnswers[q.id] && (
              <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg">
                <FiAlertCircle size={16} />
                <span className="text-sm font-medium">Please select an answer</span>
              </div>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {q && q.options?.length > 0 &&
              q.options.map((opt) => (
                <label
                  key={opt.option_id}
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${userAnswers[q.id] === opt.key
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                    }`}
                >
                  <input
                    type="radio"
                    className="mr-4 w-5 h-5 cursor-pointer"
                    style={{ accentColor: '#074F06' }}
                    checked={userAnswers[q.id] === opt.key}
                    onChange={() => handleAnswerChange(q.id, opt.key)}
                  />
                  <span className="flex-1">
                    <strong className="mr-2">{opt.key})</strong>
                    {opt.value}
                  </span>
                  {userAnswers[q.id] === opt.key && (
                    <FiCheckCircle className="text-green-600" size={20} />
                  )}
                </label>
              ))}

            {/* True/False */}
            {q && q.question_type === "tf" && (
              <>
                {["True", "False"].map((val) => (
                  <label
                    key={val}
                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${userAnswers[q.id] === val
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                      }`}
                  >
                    <input
                      type="radio"
                      className="mr-4 w-5 h-5 cursor-pointer"
                      style={{ accentColor: '#074F06' }}
                      checked={userAnswers[q.id] === val}
                      onChange={() => handleAnswerChange(q.id, val)}
                    />
                    <span className="flex-1 font-medium">{val}</span>
                    {userAnswers[q.id] === val && (
                      <FiCheckCircle className="text-green-600" size={20} />
                    )}
                  </label>
                ))}
              </>
            )}

            {!q && (
              <div className="text-center py-10">
                <FiAlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No questions found for this test.</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(currentIndex - 1)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${currentIndex === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg"
              }`}
          >
            <FiArrowLeft size={18} />
            Previous
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex(currentIndex + 1)}
              className="flex items-center gap-2 px-6 py-3 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              style={{ backgroundColor: '#074F06' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#053d05'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#074F06'}
            >
              Next
              <FiArrowRight size={18} />
            </button>
          ) : (
            <button
              onClick={submitTest}
              className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 hover:bg-green-700"
            >
              <FiCheckCircle size={20} />
              Submit Test
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestQuestions;