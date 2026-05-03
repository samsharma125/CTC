"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

export default function AssignmentDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [assignment, setAssignment] = useState<any>(null);
  const [answers, setAnswers] = useState<any>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);

  // 🤖 AI
  const [aiExplanations, setAiExplanations] = useState<any>({});
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    axios.get("/api/assignments").then((res) => {
      const found = res.data.find((a: any) => a._id === id);
      setAssignment(found);
    });
  }, [id]);

  useEffect(() => {
    if (!assignment || submitted) return;

    if (timeLeft === 0) {
      handleSubmit();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, assignment, submitted]);

  // ✅ SUBMIT
 const handleSubmit = async () => {
  let s = 0;

  assignment.questions.forEach((q: any, i: number) => {
    if (answers[i] === q.correctAnswer) s++;
  });

  setScore(s);
  setSubmitted(true);

  try {
    // 🔥 CONVERT OBJECT → ARRAY (IMPORTANT)
    const answersArray = Object.keys(answers).map(
      (key) => answers[key]
    );

    // 🔥 SEND TO BACKEND (THIS WAS MISSING)
    await axios.post(`/api/assignments/${id}`, {
      answers: answersArray,
    });

    console.log("Submission saved + points added ✅");
  } catch (err) {
    console.log("Submission error:", err);
  }
};


  // 🤖 AI ANALYZE
  const handleAIExplain = async () => {
    setLoadingAI(true);
    const explanations: any = {};

    for (let i = 0; i < assignment.questions.length; i++) {
      const q = assignment.questions[i];

      try {
        const res = await fetch("/api/ai-chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            userAnswer: answers[i],
          }),
        });

        const data = await res.json();
        explanations[i] = data.reply || "No explanation";
      } catch {
        explanations[i] = "AI failed to explain";
      }
    }

    setAiExplanations(explanations);
    setLoadingAI(false);
  };

  if (!assignment) {
    return <p className="text-white p-6">Loading...</p>;
  }

  return (
    <div className="p-6 text-white space-y-6">

      <button onClick={() => router.back()} className="text-blue-400">
        ← Back
      </button>

      {/* TIMER */}
      {!submitted && (
        <div className="text-red-400 font-semibold">
          ⏱ {Math.floor(timeLeft / 60)}:
          {(timeLeft % 60).toString().padStart(2, "0")}
        </div>
      )}

      {/* QUESTIONS */}
      {assignment.questions.map((q: any, i: number) => (
        <div key={i} className="bg-white/5 p-5 rounded-xl">

          <p className="mb-3 font-medium">
            {i + 1}. {q.question}
          </p>

          {q.options.map((opt: string, oi: number) => (
            <label key={oi} className="block mb-2 cursor-pointer">
              <input
                type="radio"
                disabled={submitted}
                checked={answers[i] === opt}
                onChange={() =>
                  setAnswers((prev: any) => ({
                    ...prev,
                    [i]: opt,
                  }))
                }
                className="mr-2"
              />
              {opt}
            </label>
          ))}

          {/* 🤖 AI EXPLANATION */}
          {submitted && aiExplanations[i] && (
            <div className="mt-3 p-3 bg-blue-500/10 rounded text-sm">
              🤖 {aiExplanations[i]}
            </div>
          )}
        </div>
      ))}

      {/* SUBMIT BUTTON */}
      {!submitted && (
        <button
          onClick={handleSubmit}
          className="bg-pink-500 px-5 py-2 rounded-xl hover:bg-pink-600"
        >
          Submit
        </button>
      )}

      {/* RESULT */}
      {submitted && (
        <div className="space-y-4">

          <h2 className="text-green-400 text-lg font-semibold">
            🎯 Score: {score}/{assignment.questions.length}
          </h2>

          {/* 🤖 AI BUTTON */}
          <button
            onClick={handleAIExplain}
            disabled={loadingAI}
            className="bg-blue-500 px-5 py-2 rounded-xl hover:bg-blue-600 disabled:opacity-50"
          >
            {loadingAI
              ? "Analyzing..."
              : "🤖 Explain Answers"}
          </button>

        </div>
      )}

      {/* LOADING */}
      {loadingAI && (
        <p className="text-yellow-400">
          🤖 AI is analyzing answers...
        </p>
      )}

    </div>
  );
}