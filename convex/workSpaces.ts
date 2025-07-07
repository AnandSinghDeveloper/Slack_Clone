import { query } from "./_generated/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

const generateCode = () => {
  const code = Array.from(
    { length: 6 },
    () => "0123456789abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 36)]
  ).join("");

  return code;
};

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const joinCode = generateCode();

    const workspaceId = await ctx.db.insert("workspace", {
      name: args.name,
      userId: userId,
      joinCode: joinCode,
    });

    await ctx.db.insert("members", {
      userId: userId,
      workspaceId: workspaceId,
      role: "admin",
    });

    return workspaceId;
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return [];
    }

    const members = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();

    const workspaceIds = members.map((member) => member.workspaceId);

    const workspaces = [];

    for (const workspaceId of workspaceIds) {
      const workspace = await ctx.db.get(workspaceId);

      if (workspace) {
        workspaces.push(workspace);
      }
    }

    return await ctx.db.query("workspace").collect();
  },
});

export const getWorkspace = query({
  args: { workspaceId: v.id("workspace") },
  handler: async (ctx, { workspaceId }) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const members = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_and_user_id", (q) =>
        q.eq("workspaceId", workspaceId).eq("userId", userId)
      )
      .unique();

    if (!members) {
      console.log("You are not a member of this workspace");
      return null;
    }

    return await ctx.db.get(workspaceId);
  },
});
