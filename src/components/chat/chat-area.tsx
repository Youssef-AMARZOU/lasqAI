"use client";

import { Id } from "@convex/_generated/dataModel";
import { Button } from "@/components/core";
import { ModelSelector } from "@/components/chat/model-selector";
import { MessageBubble } from "@/components/chat/message-bubble";
import { SummaryCard } from "@/components/chat/summary-card";
import { Input } from "@/components/core";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@convex/_generated/api";
import { models, modelCosts } from "@/lib/models";

interface ChatAreaProps {
  conversationId: Id<"conversations"> | null;
  onConversationChange?: (id: Id<"conversations">) => void;
}

export function ChatArea({ conversationId, onConversationChange }: ChatAreaProps) {
  const [prompt, setPrompt] = useState("");
  const [selectedModels, setSelectedModels] = useState<string[]>([
    models[0].id,
    models[1].id,
    models[2].id,
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messages = useQuery(
    api.queries.messages.list,
    conversationId ? { conversationId } : "skip"
  );

  const createConversation = useMutation(api.mutations.conversations.create);
  const queryModels = useAction(api.actions.models.queryModels);

  const estimatedCost = selectedModels.reduce(
    (sum, m) => sum + (modelCosts[m] ?? 0),
    0
  );

  const handleSubmit = async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      let convId = conversationId;

      if (!convId) {
        convId = await createConversation({
          title: prompt.slice(0, 50) + (prompt.length > 50 ? "..." : ""),
          selectedModels,
        });
        onConversationChange?.(convId);
      }

      await queryModels({
        conversationId: convId,
        prompt: prompt.trim(),
        selectedModels,
      });

      setPrompt("");
    } catch (error: any) {
      const msg = error?.message ?? error?.toString() ?? "Erreur inconnue";
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const safeMessages = messages ?? [];
  const summaryMessage = safeMessages.find((m) => m.role === "summary");
  const responseMessages = safeMessages.filter((m) => m.role === "assistant");
  const userMessages = safeMessages.filter((m) => m.role === "user");

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-6">
        {!conversationId && safeMessages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <Sparkles className="h-12 w-12 text-zinc-300 dark:text-zinc-600" />
            <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200">
              Nouvelle consultation
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md text-center">
              Sélectionnez les modèles à interroger, posez votre question, et obtenez une synthèse comparative.
            </p>
            <ModelSelector
              selectedModels={selectedModels}
              onSelectionChange={setSelectedModels}
            />
          </div>
        )}

        {errorMsg && (
          <div className="mx-auto max-w-4xl mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            {errorMsg}
          </div>
        )}

        {isLoading && (
          <div className="mx-auto max-w-4xl mb-4 flex items-center gap-2 text-sm text-zinc-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Envoi en cours...
          </div>
        )}

        {safeMessages.length > 0 && (
          <div className="mx-auto max-w-4xl space-y-6">
            <ModelSelector
              selectedModels={selectedModels}
              onSelectionChange={setSelectedModels}
            />
            {userMessages.map((msg) => (
              <MessageBubble key={msg._id} message={msg} />
            ))}
            {responseMessages.length > 0 && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {responseMessages.map((msg) => (
                  <MessageBubble key={msg._id} message={msg} />
                ))}
              </div>
            )}
            {summaryMessage && (
              <SummaryCard message={summaryMessage} />
            )}
          </div>
        )}
      </div>

      <div className="border-t p-4">
        <div className="mx-auto flex max-w-4xl items-end gap-3">
          <ModelSelector
            selectedModels={selectedModels}
            onSelectionChange={setSelectedModels}
            compact
          />
          <div className="flex flex-1 items-end gap-2">
            <Input
              placeholder="Posez votre question..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSubmit}
              disabled={!prompt.trim() || isLoading}
              size="sm"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <div className="mx-auto mt-2 max-w-4xl text-right">
          <span className="text-xs text-zinc-400">
            Coût estimé: {estimatedCost.toFixed(2)} crédits
          </span>
        </div>
      </div>
    </div>
  );
}
