import { NextRequest, NextResponse } from "next/server";
import { callLLMs } from "@/lib/llmclient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, models, keys, temperature } = body as {
      prompt: string;
      models: string[];
      keys: Record<string, string>;
      temperature?: number;
    };

    if (!prompt || !models?.length) {
      return NextResponse.json({ error: "Missing prompt or models" }, { status: 400 });
    }

    const responses = await callLLMs(prompt, models, keys, temperature ?? 0.7);

    return NextResponse.json({ responses });
  } catch (err) {
    console.error("api/chat error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
