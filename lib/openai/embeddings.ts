import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function createEmbedding(text: string) {
  const cleanedText = text.trim();

  if (!cleanedText) {
    throw new Error("Text is required to create an embedding.");
  }

  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: cleanedText,
  });

  return response.data[0].embedding;
}