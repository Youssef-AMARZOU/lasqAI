"use client";

import { Doc } from "@convex/_generated/dataModel";
import { Card, CardContent, Badge } from "@/components/core";
import { Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface SummaryCardProps {
  message: Doc<"messages">;
}

export function SummaryCard({ message }: SummaryCardProps) {
  return (
    <Card className="border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                Résumé Synthétique — اللاصق
              </span>
              <Badge variant="success">Synthèse</Badge>
            </div>
            <div className="prose prose-sm prose-emerald max-w-none dark:prose-invert">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
