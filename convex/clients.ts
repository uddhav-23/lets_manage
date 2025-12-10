import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createClient = mutation({
  args: {
    name: v.string(),
    designation: v.string(),
    review: v.string(),
    imageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("clients", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const getAllClients = query({
  args: {},
  handler: async (ctx) => {
    const clients = await ctx.db.query("clients").order("desc").collect();
    return Promise.all(
      clients.map(async (client) => ({
        ...client,
        imageUrl: await ctx.storage.getUrl(client.imageId),
      }))
    );
  },
});

export const updateClient = mutation({
  args: {
    id: v.id("clients"),
    name: v.string(),
    designation: v.string(),
    review: v.string(),
    imageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const updateData: any = {
      name: updates.name,
      designation: updates.designation,
      review: updates.review,
    };
    
    if (updates.imageId) {
      updateData.imageId = updates.imageId;
    }
    
    return await ctx.db.patch(id, updateData);
  },
});

export const deleteClient = mutation({
  args: { id: v.id("clients") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});
