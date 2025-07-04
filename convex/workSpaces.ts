import { query } from "./_generated/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

export const create= mutation({
  args: {
  name : v.string(),
  },
  handler: async (ctx , args) => {
   const userId = await auth.getUserId(ctx);

   if (!userId) {
  throw new Error("User not authenticated");
   };

   const joinCode = "123456"

   const workspaceId = await ctx.db.insert("workspace", {
     name: args.name,
     userId: userId,
     joinCode: joinCode
   })

   return workspaceId
   
  },
})

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("workspace").collect();
  },
});
