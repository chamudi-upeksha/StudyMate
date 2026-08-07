'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    { question: "How does the AI Summary work?", answer: "We use the DeepSeek API to read your note and generate 3 concise bullet points automatically." },
    { question: "Where are my notes saved?", answer: "Your notes are securely stored in a MongoDB Atlas cloud database." },
    { question: "Can I use it on my phone?", answer: "Yes! The entire interface is built with Tailwind CSS to be fully responsive on mobile devices." }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      {/* Hero Section */}
      <section className="text-center py-20 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
          Smarter Notes for Better Grades
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          StudyMate uses AI to automatically summarize your study notes and generate pop quizzes so you can learn faster.
        </p>
        <Link 
          href="/notes" 
          className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl hover:-translate-y-1 inline-block"
        >
          Open App &rarr;
        </Link>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto py-12 w-full">
        <Link href="/notes" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition block cursor-pointer">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 text-2xl">📝</div>
          <h3 className="text-xl font-bold mb-3 text-gray-900">Organize Everything</h3>
          <p className="text-gray-600">Keep all your study notes in one place, categorized by subject and easily searchable. Click to enter!</p>
        </Link>
        
        <Link href="/summaries" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition block cursor-pointer">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6 text-2xl">✨</div>
          <h3 className="text-xl font-bold mb-3 text-gray-900">AI Summaries</h3>
          <p className="text-gray-600">Instantly generate 3-bullet point summaries of long lectures using DeepSeek AI. Click to enter!</p>
        </Link>
        
        <Link href="/quizzes" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition block cursor-pointer">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6 text-2xl">🎯</div>
          <h3 className="text-xl font-bold mb-3 text-gray-900">Pop Quizzes</h3>
          <p className="text-gray-600">Test your knowledge with AI-generated pop quizzes automatically attached to your notes. Click to enter!</p>
        </Link>
      </section>

      {/* Interactive FAQ Section */}
      <section className="max-w-3xl mx-auto w-full py-12 mb-12">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg bg-white overflow-hidden">
              <button 
                onClick={() => toggleFaq(index)}
                className="w-full text-left px-6 py-4 font-semibold text-gray-900 flex justify-between items-center hover:bg-gray-50"
              >
                {faq.question}
                <span className="text-blue-600 font-bold text-xl">{openFaq === index ? '−' : '+'}</span>
              </button>
              {openFaq === index && (
                <div className="px-6 py-4 text-gray-600 border-t border-gray-100 bg-gray-50">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
