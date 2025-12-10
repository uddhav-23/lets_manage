import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createProject = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    imageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("projects", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const getAllProjects = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db.query("projects").order("desc").collect();
    return Promise.all(
      projects.map(async (project) => ({
        ...project,
        imageUrl: await ctx.storage.getUrl(project.imageId),
      }))
    );
  },
});

export const updateProject = mutation({
  args: {
    id: v.id("projects"),
    name: v.string(),
    description: v.string(),
    imageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const updateData: any = {
      name: updates.name,
      description: updates.description,
    };
    
    if (updates.imageId) {
      updateData.imageId = updates.imageId;
    }
    
    return await ctx.db.patch(id, updateData);
  },
});

export const deleteProject = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
