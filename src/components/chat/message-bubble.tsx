"use client";

import { Doc } from "@convex/_generated/dataModel";
import { Card, CardContent, Badge } from "@/components/core";
import { cn } from "@/lib/utils";
import { models } from "@/lib/models";
import { User, Bot, AlertCircle, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface MessageBubbleProps {
  message: Doc<"messages">;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const modelInfo = message.modelId
    ? models.find((m) => m.id === message.modelId)
    : null;

  const isStreaming = message.status === "streaming";
  const isError = message.status === "error";

  return (
    <Card
      className={cn(
        "overflow-hidden",
        message.role === "user" && "bg-zinc-50 dark:bg-zinc-900",
        isError && "border-red-200 dark:border-red-900"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
              message.role === "user"
                ? "bg-zinc-200 dark:bg-zinc-700"
                : isError
                ? "bg-red-100 dark:bg-red-900"
                : "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
            )}
          >
            {message.role === "user" ? (
              <User className="h-4 w-4" />
            ) : isError ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <Bot className="h-4 w-4" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              {modelInfo && (
                <>
                  <span className="text-sm font-medium">{modelInfo.provider}</span>
                  <Badge variant="default">{modelInfo.name}</Badge>
                </>
              )}
              {message.role === "user" && (
                <span className="text-sm font-medium">Vous</span>
              )}
              {isStreaming && (
                <Badge variant="warning">
                  <Loader2 className="h-3 w-3 animate-spin" />
                </Badge>
              )}
              {isError && (
                <Badge variant="error">Erreur</Badge>
              )}
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {message.content ? (
                isError ? (
                  <p className="text-red-600 dark:text-red-400">{message.error}</p>
                ) : (
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                )
              ) : (
                isStreaming && (
                  <div className="flex items-center gap-1 text-zinc-400">
                    <span className="animate-pulse">En cours de génération</span>
                    <span className="animate-bounce">...</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
