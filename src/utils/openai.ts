import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function callOpenAI(query: string): Promise<string> {
  const params: OpenAI.Chat.ChatCompletionCreateParams = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: query + " in a way that is easy to understand for a child. Please use simple language and avoid technical terms." }],
  };

  const completion = await openai.chat.completions.create(params);
  return completion.choices[0]?.message?.content || "No response received.";
}