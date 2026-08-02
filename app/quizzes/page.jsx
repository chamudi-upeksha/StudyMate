'use client';

import { useState, useEffect } from 'react';

export default function QuizzesPage() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizData, setQuizData] = useState(null);
  
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    fetch('/api/notes')
      .then(res => res.json())
      .then(data => setNotes(data))
      .catch(err => console.error(err));
  }, []);

  const handleGenerateQuiz = async () => {
    if (!selectedNote) return;
    setIsGenerating(true);
    setQuizData(null);
    setSelectedAnswer(null);
    setIsSubmitted(false);
    
    try {
      const res = await fetch(`/api/notes/${selectedNote._id}/quiz`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to generate quiz');
      const data = await res.json();
      setQuizData(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null) return;
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-6 shrink-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pop Quizzes</h1>
        <p className="text-gray-600">Test your knowledge! Select a note to generate an AI-powered Multiple Choice Question.</p>
      </div>
      
      <div className="flex flex-1 gap-8 min-h-0">
        {/* Left Column: Select Note */}
        <div className="w-1/3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <h3 className="font-semibold text-gray-800 mb-4 px-2 shrink-0">Your Notes</h3>
          <div className="flex flex-col gap-2 overflow-y-auto flex-1 pr-2">
            {notes.map(note => (
              <button
                key={note._id}
                onClick={() => {
                  setSelectedNote(note);
                  setQuizData(null);
                  setSelectedAnswer(null);
                  setIsSubmitted(false);
                }}
                className={`text-left p-3 rounded-lg border transition ${
                  selectedNote?._id === note._id 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-white border-gray-100 hover:border-green-200'
                }`}
              >
                <div className="font-medium text-gray-900 truncate">{note.title}</div>
                <div className="text-xs text-gray-500 mt-1">{note.subject}</div>
              </button>
            ))}
            {notes.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No notes available.</p>
            )}
          </div>
        </div>

        {/* Right Column: Quiz UI */}
        <div className="w-2/3 overflow-y-auto">
          {selectedNote ? (
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm min-h-full flex flex-col">
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Quiz: {selectedNote.title}</h2>
                  <span className="inline-block mt-2 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">{selectedNote.subject}</span>
                </div>
                <button
                  onClick={handleGenerateQuiz}
                  disabled={isGenerating}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition shadow-sm disabled:opacity-50 flex items-center gap-2 shrink-0"
                >
                  {isGenerating ? 'Generating...' : '🎯 Generate New Quiz'}
                </button>
              </div>

              {/* Quiz Container */}
              {quizData ? (
                <div className="flex-1 max-w-2xl mx-auto w-full">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 leading-relaxed">
                    {quizData.question}
                  </h3>
                  
                  <div className="space-y-3 mb-8">
                    {quizData.options.map((option, idx) => {
                      // Determine classes based on submission state
                      let buttonStyle = "border-gray-200 hover:border-green-400 hover:bg-green-50 text-gray-700 bg-white";
                      
                      if (isSubmitted) {
                        if (idx === quizData.correctIndex) {
                          buttonStyle = "border-green-500 bg-green-100 text-green-900 font-medium"; // Correct answer is always highlighted
                        } else if (idx === selectedAnswer) {
                          buttonStyle = "border-red-500 bg-red-100 text-red-900 font-medium"; // User's wrong answer
                        } else {
                          buttonStyle = "border-gray-200 opacity-50 bg-gray-50 text-gray-500"; // Other unselected answers
                        }
                      } else if (selectedAnswer === idx) {
                        buttonStyle = "border-green-500 bg-green-50 text-green-900 font-medium shadow-sm ring-1 ring-green-500";
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => !isSubmitted && setSelectedAnswer(idx)}
                          disabled={isSubmitted}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all ${buttonStyle}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold shrink-0 ${
                              isSubmitted && idx === quizData.correctIndex ? 'bg-green-500 text-white' :
                              isSubmitted && idx === selectedAnswer ? 'bg-red-500 text-white' :
                              selectedAnswer === idx ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                            }`}>
                              {['A', 'B', 'C', 'D'][idx]}
                            </span>
                            <span>{option}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {!isSubmitted ? (
                    <button
                      onClick={handleAnswerSubmit}
                      disabled={selectedAnswer === null}
                      className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Check Answer
                    </button>
                  ) : (
                    <div className={`p-6 rounded-xl border ${selectedAnswer === quizData.correctIndex ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                      <h4 className={`text-lg font-bold mb-2 ${selectedAnswer === quizData.correctIndex ? 'text-green-800' : 'text-red-800'}`}>
                        {selectedAnswer === quizData.correctIndex ? '🎉 Correct!' : '❌ Incorrect'}
                      </h4>
                      <p className="text-gray-700 leading-relaxed">{quizData.explanation}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                  <div className="text-6xl mb-4 opacity-50">🤔</div>
                  <p>Click "Generate New Quiz" to test your knowledge.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-gray-50 border border-dashed border-gray-300 rounded-xl py-20">
              <div className="text-4xl mb-4">🎯</div>
              <p className="text-gray-500 font-medium">Select a note from the left to start a quiz.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
