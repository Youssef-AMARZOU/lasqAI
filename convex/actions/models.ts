"use node";

import { v } from "convex/values";
import { action } from "../_generated/server";
import { api } from "../_generated/api";

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

function getApiKey(): string | undefined {
  return process.env.OPENROUTER_API_KEY || undefined;
}

async function streamFromModel(
  model: string,
  messages: { role: string; content: string }[]
): Promise<string> {
  const apiKey = getApiKey();

  if (!apiKey) {
    return `[Mode démo] Réponse simulée de ${model}.\n\nConfigure OPENROUTER_API_KEY dans .env.local puis redémarre \`npx convex dev\` pour activer les vraies réponses.`;
  }

  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    },
    body: JSON.stringify({
      model,
      messages,
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenRouter error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}

async function generateSummary(
  prompt: string,
  modelResponses: { model: string; content: string }[]
): Promise<string> {
  const apiKey = getApiKey();

  if (!apiKey) {
    const sections = modelResponses.map(r => `### ${r.model}\n${r.content.slice(0, 200)}...`);
    return `## Résumé Synthétique\n\n### Consensus\n${modelResponses.length > 0 ? "Les modèles s'accordent sur les points principaux de la question posée." : "Aucune réponse disponible."}\n\n### Divergences\n${sections.join("\n\n")}`;
  }

  const summaryPrompt = `Analyse les réponses suivantes de plusieurs modèles d'IA à la question : "${prompt}"

Réponses des modèles :
${modelResponses
  .map((r, i) => `--- ${r.model} ---\n${r.content}`)
  .join("\n\n")}

Génère un résumé synthétique structuré en deux sections :
1. **Consensus** : Points d'accord communs entre tous les modèles.
2. **Divergences** : Nuances ou différences spécifiques apportées par chaque modèle.

Sois concis et objectif.`;

  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [
        { role: "system", content: "Tu es un assistant spécialisé dans la synthèse et l'analyse comparative de réponses de modèles d'IA." },
        { role: "user", content: summaryPrompt },
      ],
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Summary generation failed: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}

export const queryModels = action({
  args: {
    conversationId: v.id("conversations"),
    prompt: v.string(),
    selectedModels: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const { conversationId, prompt, selectedModels } = args;

    const historyMessages = await ctx.runQuery(api.queries.messages.list, {
      conversationId,
    });

    const conversationMessages = (historyMessages as any[]).map((m: any) => ({
      role: m.role === "summary" ? "system" : m.role,
      content: m.content,
    }));

    const messages = [
      ...conversationMessages,
      { role: "user" as const, content: prompt },
    ];

    await ctx.runMutation(api.mutations.messages.send, {
      conversationId,
      role: "user",
      content: prompt,
    });

    const results = await Promise.allSettled(
      selectedModels.map(async (model) => {
        const msgId = await ctx.runMutation(api.mutations.messages.send, {
          conversationId,
          role: "assistant",
          content: "",
          modelId: model,
          status: "streaming",
        });

        try {
          const content = await streamFromModel(model, messages);
          await ctx.runMutation(api.mutations.messages.update, {
            messageId: msgId,
            content,
            status: "completed",
          });
          return { model, content, success: true as const };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          await ctx.runMutation(api.mutations.messages.update, {
            messageId: msgId,
            content: "",
            status: "error",
            error: errorMessage,
          });
          return { model, error: errorMessage, success: false as const };
        }
      })
    );

    const successfulResults = results
      .filter((r): r is PromiseFulfilledResult<{ model: string; content: string; success: true }> =>
        r.status === "fulfilled" && r.value.success
      )
      .map((r) => r.value);

    if (successfulResults.length > 0) {
      try {
        const summary = await generateSummary(prompt, successfulResults);
        await ctx.runMutation(api.mutations.messages.send, {
          conversationId,
          role: "summary",
          content: summary,
        });
      } catch (error) {
        console.error("Summary generation failed:", error);
      }
    }

    return { results };
  },
});
