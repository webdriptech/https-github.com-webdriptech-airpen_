import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createModule = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    content: v.optional(
      v.object({
        overview: v.string(),
        lessons: v.array(
          v.object({
            id: v.number(),
            title: v.string(),
            content: v.string(),
            completed: v.boolean(),
          }),
        ),
        quizzes: v.array(
          v.object({
            id: v.number(),
            title: v.string(),
            questions: v.array(
              v.object({
                id: v.number(),
                question: v.string(),
                options: v.array(v.string()),
                answer: v.number(),
              }),
            ),
          }),
        ),
        resources: v.array(
          v.object({
            id: v.number(),
            title: v.string(),
            url: v.string(),
            type: v.string(),
          }),
        ),
      }),
    ),
    recordingId: v.optional(v.id("recordings")),
    progress: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique()
      .then((user) => user?._id);

    if (!userId) {
      throw new Error("User not found");
    }

    return await ctx.db.insert("modules", {
      userId,
      title: args.title,
      description: args.description,
      content: args.content,
      recordingId: args.recordingId,
      progress: args.progress || 0,
      createdAt: new Date().toISOString(),
    });
  },
});

export const getUserModules = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const userId = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique()
      .then((user) => user?._id);

    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("modules")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const getModuleById = query({
  args: { id: v.id("modules") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const module = await ctx.db.get(args.id);
    if (!module) {
      throw new Error("Module not found");
    }

    return module;
  },
});

export const updateModuleProgress = mutation({
  args: {
    id: v.id("modules"),
    progress: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const module = await ctx.db.get(args.id);
    if (!module) {
      throw new Error("Module not found");
    }

    return await ctx.db.patch(args.id, {
      progress: args.progress,
    });
  },
});
