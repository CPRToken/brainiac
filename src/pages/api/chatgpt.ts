// src/pages/api/chatgpt.ts
import OpenAI from "openai";

export const config = {
  runtime: "edge", // 👈 run on Edge
};

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: Request) {
  const { prompt, max_tokens } = await req.json();
  const maxOut = Number(max_tokens) || 1024;

  const stream = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [{ role: "user", content: prompt }],
    max_completion_tokens: maxOut,
    stream: true,
  });

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const token = chunk.choices[0]?.delta?.content || "";
        if (token) {
          controller.enqueue(encoder.encode(token));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
