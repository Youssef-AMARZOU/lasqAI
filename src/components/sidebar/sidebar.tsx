"use client";

import { Doc, Id } from "@convex/_generated/dataModel";
import { Button } from "@/components/core";
import { Plus, MessageSquare, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";

interface SidebarProps {
  conversations: Doc<"conversations">[];
  activeConversationId: Id<"conversations"> | null;
  onSelectConversation: (id: Id<"conversations">) => void;
  onNewConversation?: () => void;
}

export function Sidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
}: SidebarProps) {
  const deleteConversation = useMutation(api.mutations.conversations.remove);

  const handleDelete = async (e: React.MouseEvent, id: Id<"conversations">) => {
    e.stopPropagation();
    await deleteConversation({ id });
  };

  return (
    <aside className="flex w-64 flex-col border-r bg-zinc-50 dark:bg-zinc-950">
      <div className="p-4">
        <Button
          variant="secondary"
          className="w-full gap-2"
          onClick={onNewConversation}
        >
          <Plus className="h-4 w-4" />
          Nouvelle
        </Button>
      </div>
      <nav className="flex-1 overflow-y-auto px-2">
        {conversations.map((conv) => (
          <div
            key={conv._id}
            className="group flex items-center"
          >
            <button
              onClick={() => onSelectConversation(conv._id)}
              className={cn(
                "flex flex-1 items-center gap-2 rounded-l-lg px-3 py-2 text-left text-sm transition-colors",
                activeConversationId === conv._id
                  ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              )}
            >
              <MessageSquare className="h-4 w-4 shrink-0" />
              <span className="truncate">{conv.title}</span>
            </button>
            <button
              onClick={(e) => handleDelete(e, conv._id)}
              className={cn(
                "flex items-center rounded-r-lg px-2 py-2 text-xs transition-colors",
                activeConversationId === conv._id
                  ? "bg-zinc-200 text-zinc-400 hover:text-red-500 dark:bg-zinc-800 dark:text-zinc-500"
                  : "text-zinc-300 hover:text-red-500 dark:text-zinc-600"
              )}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </nav>
    </aside>
  );
}
