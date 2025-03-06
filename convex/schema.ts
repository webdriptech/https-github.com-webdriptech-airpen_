import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
    tokenIdentifier: v.string(),
  }).index("by_token", ["tokenIdentifier"]),

  recordings: defineTable({
    userId: v.id("users"),
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
    createdAt: v.string(),
  }).index("by_user", ["userId"]),

  modules: defineTable({
    userId: v.id("users"),
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
    progress: v.number(),
    createdAt: v.string(),
  }).index("by_user", ["userId"]),

  notes: defineTable({
    userId: v.id("users"),
    title: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
    moduleId: v.optional(v.id("modules")),
    recordingId: v.optional(v.id("recordings")),
    date: v.string(),
  }).index("by_user", ["userId"]),
});
