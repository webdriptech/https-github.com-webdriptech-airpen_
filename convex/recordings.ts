import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const storeRecording = mutation({
  args: {
    title: v.string(),
    audioUrl: v.string(),
    transcription: v.optional(v.string()),
    notes: v.optional(v.string()),
    quizData: v.optional(
      v.array(
        v.object({
          question: v.string(),
          options: v.array(v.string()),
          answer: v.number(),
        }),
      ),
    ),
    moduleId: v.optional(v.string()),
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

    return await ctx.db.insert("recordings", {
      userId,
      title: args.title,
      audioUrl: args.audioUrl,
      transcription: args.transcription,
      notes: args.notes,
      quizData: args.quizData,
      moduleId: args.moduleId,
      createdAt: new Date().toISOString(),
    });
  },
});

export const getUserRecordings = query({
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
      .query("recordings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const getRecordingById = query({
  args: { id: v.id("recordings") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const recording = await ctx.db.get(args.id);
    if (!recording) {
      throw new Error("Recording not found");
    }

    return recording;
  },
});
