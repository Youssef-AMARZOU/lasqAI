"use client";

import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Button } from "@/components/core";
import { Sidebar } from "@/components/sidebar/sidebar";
import { ChatArea } from "@/components/chat/chat-area";
import { MessageSquareDiff, LogOut } from "lucide-react";
import { useState } from "react";
import { Id } from "@convex/_generated/dataModel";

export default function DashboardContent() {
  const [showDemoBanner, setShowDemoBanner] = useState(true);
  const conversations = useQuery(api.queries.conversations.list);
  const [activeConversationId, setActiveConversationId] = useState<Id<"conversations"> | null>(null);

  return (
    <div className="flex h-full">
      <Sidebar
        conversations={conversations ?? []}
        activeConversationId={activeConversationId}
        onSelectConversation={setActiveConversationId}
      />
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b px-6">
          <div className="flex items-center gap-2">
            <MessageSquareDiff className="h-5 w-5" />
            <span className="font-semibold">Ysf-AI</span>
          </div>
          <div className="flex items-center gap-4">
            {showDemoBanner && (
              <span className="text-xs text-amber-600 dark:text-amber-400">
                Mode démo
              </span>
            )}
            <span className="text-sm text-zinc-500 dark:text-zinc-400">100 crédits</span>
          </div>
        </header>
        <main className="flex-1 overflow-hidden">
          <ChatArea
            conversationId={activeConversationId}
            onConversationChange={setActiveConversationId}
          />
        </main>
        <footer className="border-t py-1 text-center text-[10px] text-zinc-300 dark:text-zinc-700">
          Youssef AMARZOU — ingénieur digital & industriel
        </footer>
      </div>
    </div>
  );
}
