import React from 'react';

const QuizView = ({
  question,
  questionNumber,
  totalQuestions,
  userAnswers,
  onSelectAnswer,
  onNext,
  onPrevious,
  timeLeft,
  isLastQuestion
}) => {
  const selectedChoiceId = userAnswers[question.id];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
              Question {questionNumber} of {totalQuestions}
            </div>
            <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
              ⏱️ {timeLeft}
            </div>
          </div>
          <div className="text-lg font-semibold text-gray-700">
            Score: {Object.keys(userAnswers).length}/{totalQuestions}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          ></div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 leading-relaxed">
            {question.text}
          </h2>
        </div>

        {/* Choices */}
        <div className="space-y-3 mb-6">
          {question.choices.map((choice) => (
            <div
              key={choice.id}
              onClick={() => onSelectAnswer(question.id, choice.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                selectedChoiceId === choice.id
                  ? 'border-blue-500 bg-blue-50 transform scale-105'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                    selectedChoiceId === choice.id
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-400'
                  }`}
                >
                  {selectedChoiceId === choice.id && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <span className="text-gray-800">{choice.text}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={onPrevious}
            disabled={questionNumber === 1}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              questionNumber === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-500 text-white hover:bg-gray-600'
            }`}
          >
            ← Previous
          </button>
          
          <button
            onClick={onNext}
            disabled={!selectedChoiceId}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              !selectedChoiceId
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isLastQuestion ? 'Submit Quiz' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizView;