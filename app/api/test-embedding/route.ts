import { NextResponse } from "next/server";
import { createEmbedding } from "@/lib/openai/embeddings";

export async function GET() {
  try {
    const sampleText =
      "I have been feeling overwhelmed and alone lately.";

    const embedding = await createEmbedding(sampleText);

    return NextResponse.json({
      ok: true,
      sampleText,
      dimensions: embedding.length,
      preview: embedding.slice(0, 5),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}