import fetch from "node-fetch";

export async function callLLMs(
  prompt: string,
  models: string[],
  keys: Record<string, string>,
  temperature = 0.7
): Promise<Record<string, string>> {
  const results: Record<string, string> = {};

  for (const model of models) {
    try {
      // ---------------------- ChatGPT (OpenAI) ----------------------
      if (model === "chatgpt") {
        const key = keys.chatgpt;
        if (!key) {
          results[model] = "❌ No OpenAI API key provided";
          continue;
        }

        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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

        const js = await res.json();
        results[model] = js.choices?.[0]?.message?.content ?? "⚠️ No response from ChatGPT";
      }

      // ---------------------- Gemini ----------------------
      else if (model === "gemini") {
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

        const js = await res.json();
        results[model] =
          js.candidates?.[0]?.content?.parts?.[0]?.text ?? "⚠️ No response from Gemini";
      }

      // ---------------------- Perplexity ----------------------
      else if (model === "perplexity") {
        const key = keys.perplexity;
        if (!key) {
          results[model] = "❌ No Perplexity API key provided";
          continue;
        }

        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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

        const js = await res.json();
        results[model] =
          js.choices?.[0]?.message?.content ?? "⚠️ No response from Perplexity";
      }

      // ---------------------- Claude ----------------------
      else if (model === "claude") {
  const key = keys.claude; // <-- should be OPENROUTER key
  if (!key) {
    results[model] = "❌ No Claude API key provided";
    continue;
  }

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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

  const js = await res.json();
  results[model] =
    js.choices?.[0]?.message?.content ?? "⚠️ No response from Claude (OpenRouter)";
}

      // ---------------------- Mistral ----------------------
      else if (model === "mistral") {
        const key = keys.mistral;
        if (!key) {
          results[model] = "❌ No Mistral API key provided";
          continue;
        }

        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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

        const js = await res.json();
        results[model] =
          js.choices?.[0]?.message?.content ?? "⚠️ No response from Mistral";
      }

      // ---------------------- Cohere ----------------------
      else if (model === "cohere") {
        const key = keys.cohere;
        if (!key) {
          results[model] = "❌ No Cohere API key provided";
          continue;
        }

        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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

        const js = await res.json();
        results[model] =
          js.choices?.[0]?.message?.content ?? "⚠️ No response from Cohere";
      }

      else {
        results[model] = `❓ Unknown model identifier: ${model}`;
      }
    } catch (err) {
      console.error("callLLMs error for model", model, err);
      results[model] = "💥 Error calling model: " + String(err);
    }
  }

  return results;
}
