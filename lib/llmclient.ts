type OpenRouterResponse = { choices?: { message?: { content?: string } }[] };
type GeminiResponse = { candidates?: { content?: { parts?: { text?: string }[] } }[] };

const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

async function readOpenRouterText(res: Response, fallback: string) {
  const json = (await res.json()) as OpenRouterResponse;
  return json.choices?.[0]?.message?.content ?? fallback;
}

async function readGeminiText(res: Response) {
  const json = (await res.json()) as GeminiResponse;
  return json.candidates?.[0]?.content?.parts?.[0]?.text ?? "⚠️ No response from Gemini";
}

export async function callLLMs(
  prompt: string,
  models: string[],
  keys: Record<string, string>,
  temperature = 0.7
): Promise<Record<string, string>> {
  const results: Record<string, string> = {};

  for (const model of models) {
    try {
      if (model === "chatgpt") {
        const key = keys.chatgpt;
        if (!key) {
          results[model] = "❌ No OpenAI API key provided";
          continue;
        }

        const res = await fetch(OPENROUTER_ENDPOINT, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "openai/gpt-4o",
            messages: [{ role: "user", content: prompt }],
            temperature,
            max_tokens: 512,
          }),
        });

        results[model] = await readOpenRouterText(res, "⚠️ No response from ChatGPT");
      } else if (model === "gemini") {
        const key = keys.gemini;
        if (!key) {
          results[model] = "❌ No Gemini API key provided";
          continue;
        }

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${key}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { temperature, maxOutputTokens: 512 },
            }),
          }
        );

        results[model] = await readGeminiText(res);
      } else if (model === "perplexity") {
        const key = keys.perplexity;
        if (!key) {
          results[model] = "❌ No Perplexity API key provided";
          continue;
        }

        const res = await fetch(OPENROUTER_ENDPOINT, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "perplexity/sonar-pro",
            messages: [{ role: "user", content: prompt }],
            temperature,
            max_tokens: 512,
          }),
        });

        results[model] = await readOpenRouterText(res, "⚠️ No response from Perplexity");
      } else if (model === "claude") {
        const key = keys.claude;
        if (!key) {
          results[model] = "❌ No Claude API key provided";
          continue;
        }

        const res = await fetch(OPENROUTER_ENDPOINT, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "anthropic/claude-3.5-sonnet",
            messages: [{ role: "user", content: prompt }],
            temperature,
            max_tokens: 512,
          }),
        });

        results[model] = await readOpenRouterText(
          res,
          "⚠️ No response from Claude (OpenRouter)"
        );
      } else if (model === "mistral") {
        const key = keys.mistral;
        if (!key) {
          results[model] = "❌ No Mistral API key provided";
          continue;
        }

        const res = await fetch(OPENROUTER_ENDPOINT, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "mistralai/mistral-large",
            messages: [{ role: "user", content: prompt }],
            temperature,
            max_tokens: 512,
          }),
        });

        results[model] = await readOpenRouterText(res, "⚠️ No response from Mistral");
      } else if (model === "cohere") {
        const key = keys.cohere;
        if (!key) {
          results[model] = "❌ No Cohere API key provided";
          continue;
        }

        const res = await fetch(OPENROUTER_ENDPOINT, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "cohere/command-r-plus-08-2024",
            messages: [{ role: "user", content: prompt }],
            temperature,
            max_tokens: 512,
          }),
        });

        results[model] = await readOpenRouterText(res, "⚠️ No response from Cohere");
      } else {
        results[model] = `❓ Unknown model identifier: ${model}`;
      }
    } catch (err) {
      console.error("callLLMs error for model", model, err);
      results[model] = "💥 Error calling model: " + String(err);
    }
  }

  return results;
}
