import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  userProfiles: defineTable({
    userId: v.id("users"),
    credits: v.number(),
    stripeSubscriptionId: v.optional(v.string()),
    stripeCustomerId: v.optional(v.string()),
    subscriptionStatus: v.optional(v.string()),
  }).index("userId", ["userId"]),

  conversations: defineTable({
    userId: v.id("users"),
    title: v.string(),
    selectedModels: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("userId", ["userId"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system"), v.literal("summary")),
    content: v.string(),
    modelId: v.optional(v.string()),
    status: v.optional(v.union(v.literal("streaming"), v.literal("completed"), v.literal("error"))),
    error: v.optional(v.string()),
    createdAt: v.number(),
  }).index("conversationId", ["conversationId"]),
});
