import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const submitContact = mutation({
  args: {
    fullName: v.string(),
    email: v.string(),
    mobile: v.string(),
    city: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("contacts", {
      ...args,
      submittedAt: Date.now(),
    });
  },
});

export const getAllContacts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("contacts").order("desc").collect();
  },
});
