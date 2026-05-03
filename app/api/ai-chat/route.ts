import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    let prompt = "";

    // 🎯 CASE 1: MCQ EXPLANATION
    if (body.question) {
      prompt = `
You are a helpful teacher.

Question: ${body.question}

Options:
${body.options.map((opt: string, i: number) => `${i + 1}. ${opt}`).join("\n")}

Student Answer: ${body.userAnswer}
Correct Answer: ${body.correctAnswer}

Explain clearly:
1. Why the correct answer is correct
2. Why the student's answer is wrong (if wrong)
3. Keep explanation simple and beginner-friendly
`;
    }

    // 💬 CASE 2: CHAT
    else {
      prompt = body.message;
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are an AI tutor.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    return NextResponse.json({
      reply: data.choices?.[0]?.message?.content || "No response",
    });

  } catch (err) {
    return NextResponse.json({ reply: "AI error" });
  }
}