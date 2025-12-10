import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  contacts: defineTable({
    fullName: v.string(),
    email: v.string(),
    mobile: v.string(),
    city: v.string(),
    submittedAt: v.number(),
  }),
  
  projects: defineTable({
    name: v.string(),
    description: v.string(),
    imageId: v.id("_storage"),
    createdAt: v.number(),
  }),
  
  clients: defineTable({
    name: v.string(),
    designation: v.string(),
    review: v.string(),
    imageId: v.id("_storage"),
    createdAt: v.number(),
  }),
  
  subscribers: defineTable({
    email: v.string(),
    subscribedAt: v.number(),
  }).index("by_email", ["email"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
