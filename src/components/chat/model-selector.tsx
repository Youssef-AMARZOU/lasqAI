"use client";

import { Badge } from "@/components/core";
import { models } from "@/lib/models";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

interface ModelSelectorProps {
  selectedModels: string[];
  onSelectionChange: (models: string[]) => void;
  compact?: boolean;
}

export function ModelSelector({
  selectedModels,
  onSelectionChange,
  compact,
}: ModelSelectorProps) {
  const [open, setOpen] = useState(false);

  const toggleModel = (modelId: string) => {
    if (selectedModels.includes(modelId)) {
      if (selectedModels.length > 1) {
        onSelectionChange(selectedModels.filter((m) => m !== modelId));
      }
    } else {
      onSelectionChange([...selectedModels, modelId]);
    }
  };

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1 rounded-lg border px-3 py-2 text-xs text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900"
        >
          {selectedModels.length} modèles
          <ChevronDown className="h-3 w-3" />
        </button>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute bottom-full left-0 z-20 mb-2 w-56 rounded-lg border bg-white p-2 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => toggleModel(model.id)}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <div
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded border",
                      selectedModels.includes(model.id)
                        ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900"
                        : "border-zinc-300 dark:border-zinc-600"
                    )}
                  >
                    {selectedModels.includes(model.id) && (
                      <Check className="h-3 w-3" />
                    )}
                  </div>
                  <span className="font-medium">{model.provider}</span>
                  <span className="text-zinc-400">{model.name}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {models.map((model) => {
        const selected = selectedModels.includes(model.id);
        return (
          <button
            key={model.id}
            onClick={() => toggleModel(model.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
              selected
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
            )}
          >
            {selected && <Check className="h-3 w-3" />}
            {model.provider} • {model.name}
          </button>
        );
      })}
    </div>
  );
}
