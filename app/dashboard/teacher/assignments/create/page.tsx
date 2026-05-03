"use client";

import { useState } from "react";
import axios from "axios";

const subjects = ["DSA", "SQL", "JS", "Networking"];

export default function CreateAssignment() {
  const [subject, setSubject] = useState("DSA");

  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: "" },
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctAnswer: "" },
    ]);
  };

  const updateQuestion = (i: number, value: string) => {
    const updated = [...questions];
    updated[i].question = value;
    setQuestions(updated);
  };

  const updateOption = (qi: number, oi: number, value: string) => {
    const updated = [...questions];
    updated[qi].options[oi] = value;
    setQuestions(updated);
  };

  const setCorrectAnswer = (qi: number, value: string) => {
    const updated = [...questions];
    updated[qi].correctAnswer = value;
    setQuestions(updated);
  };

  const handleCreate = async () => {
    await axios.post("/api/assignments", {
      subject,
      questions,
    });

    alert("Assignment Uploaded 🚀");

    setQuestions([
      { question: "", options: ["", "", "", ""], correctAnswer: "" },
    ]);
  };

  return (
    <div className="p-6 text-white space-y-6">

      <h1 className="text-3xl font-bold">🧑‍🏫 Upload MCQ Assignment</h1>

      <select
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="w-full p-2 bg-black/30 rounded"
      >
        {subjects.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>

      {questions.map((q, qi) => (
        <div key={qi} className="bg-[#0c0128] p-4 rounded space-y-2">

          <input
            placeholder={`Question ${qi + 1}`}
            value={q.question}
            onChange={(e) => updateQuestion(qi, e.target.value)}
            className="w-full p-2 rounded bg-black/30"
          />

          {q.options.map((opt, oi) => (
            <div key={oi} className="flex gap-2 items-center">

              <input
                type="radio"
                name={`correct-${qi}`}
                checked={q.correctAnswer === opt}
                onChange={() => setCorrectAnswer(qi, opt)}
              />

              <input
                placeholder={`Option ${oi + 1}`}
                value={opt}
                onChange={(e) => updateOption(qi, oi, e.target.value)}
                className="w-full p-2 rounded bg-black/30"
              />

            </div>
          ))}

        </div>
      ))}

      <div className="flex gap-3">
        <button
          onClick={addQuestion}
          className="bg-blue-500 px-4 py-2 rounded"
        >
          + Add Question
        </button>

        <button
          onClick={handleCreate}
          className="bg-pink-500 px-4 py-2 rounded"
        >
          Upload Assignment
        </button>
      </div>

    </div>
  );
}