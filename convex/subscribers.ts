import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const subscribe = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if email already exists
    const existing = await ctx.db
      .query("subscribers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (existing) {
      throw new Error("Email already subscribed");
    }
    
    return await ctx.db.insert("subscribers", {
      email: args.email,
      subscribedAt: Date.now(),
    });
  },
});

export const getAllSubscribers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("subscribers").order("desc").collect();
  },
});
