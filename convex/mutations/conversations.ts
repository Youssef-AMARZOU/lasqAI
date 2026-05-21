import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const create = mutation({
  args: {
    title: v.string(),
    selectedModels: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    let userId: string;

    if (identity) {
      const user = await ctx.db
        .query("users")
        .withIndex("email", (q) => q.eq("email", identity.email!))
        .first();

      if (!user) throw new Error("User not found");
      userId = user._id;

      const existingProfile = await ctx.db
        .query("userProfiles")
        .withIndex("userId", (q) => q.eq("userId", user._id))
        .first();

      if (!existingProfile) {
        await ctx.db.insert("userProfiles", {
          userId: user._id as any,
          credits: 100,
        });
      }
    } else {
      const demoUser = await ctx.db.query("users").first();
      if (demoUser) {
        userId = demoUser._id;
      } else {
        const demoUserId = await ctx.db.insert("users", {
          name: "Demo User",
          email: "demo@shoura.app",
        });
        userId = demoUserId;
        await ctx.db.insert("userProfiles", {
          userId: demoUserId as any,
          credits: 100,
        });
      }
    }

    const now = Date.now();
    const conversationId = await ctx.db.insert("conversations", {
      userId: userId as any,
      title: args.title,
      selectedModels: args.selectedModels,
      createdAt: now,
      updatedAt: now,
    });

    return conversationId;
  },
});

export const remove = mutation({
  args: { id: v.id("conversations") },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("conversationId", (q) => q.eq("conversationId", args.id))
      .collect();

    for (const msg of messages) {
      await ctx.db.delete(msg._id);
    }

    await ctx.db.delete(args.id);
  },
});
