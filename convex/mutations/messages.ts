import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const send = mutation({
  args: {
    conversationId: v.id("conversations"),
    role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system"), v.literal("summary")),
    content: v.string(),
    modelId: v.optional(v.string()),
    status: v.optional(v.union(v.literal("streaming"), v.literal("completed"), v.literal("error"))),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      role: args.role,
      content: args.content,
      modelId: args.modelId,
      status: args.status,
      error: args.error,
      createdAt: Date.now(),
    });

    return messageId;
  },
});

export const update = mutation({
  args: {
    messageId: v.id("messages"),
    content: v.string(),
    status: v.union(v.literal("streaming"), v.literal("completed"), v.literal("error")),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.messageId, {
      content: args.content,
      status: args.status,
      error: args.error,
    });
  },
});
