import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { auth } from "./auth";
import { Id } from "./_generated/dataModel";

const populateUser = async (ctx: QueryCtx, id: Id<"users">) => {
  return await ctx.db.get(id);
};

export const getById = query({
  args: {
    id: v.id("members"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      return null;
    }

    const member = await ctx.db.get(args.id);

    if (!member) return null;

    const CurrentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_and_user_id", (q) =>
        q.eq("workspaceId", member.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!CurrentMember) return null;

    const user = await populateUser(ctx, member.userId);

    return { ...member, user };
  },
});

export const get = query({
  args: { workspaceId: v.id("workspace") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      return [];
    }
    const member = ctx.db
      .query("members")
      .withIndex("by_workspace_id_and_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member) return [];

    const data = await ctx.db
      .query("members")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId)
      )
      .collect();

    const members = [];

    for (const member of data) {
      const user = await populateUser(ctx, member.userId);
      members.push({ ...member, user });
    }

    return members;
  },
});

export const current = query({
  args: { workspaceId: v.id("workspace") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      return null;
    }

    const member = ctx.db
      .query("members")
      .withIndex("by_workspace_id_and_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member) return null;

    return member;
  },
});

export const update = mutation({
  args: {
    id: v.id("members"),
    role: v.union(v.literal("admin"), v.literal("member")),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const member = await ctx.db.get(args.id);
    1;

    if (!member) {
      throw new Error("Member not found");
    }

    const CurrentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_and_user_id", (q) =>
        q.eq("workspaceId", member.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!CurrentMember || CurrentMember.role !== "admin") {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.id, { role: args.role });

    return args.id;
  },
});

export const remove = mutation({
  args: {
    id: v.id("members"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const member = await ctx.db.get(args.id);

    if (!member) {
      throw new Error("Member not found");
    }

    const CurrentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_and_user_id", (q) =>
        q.eq("workspaceId", member.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!CurrentMember) {
      throw new Error("Unauthorized");
    }

    if (member.role === "admin") {
      throw new Error("Admin cannot be removed");
    }

    if (CurrentMember._id == args.id && CurrentMember.role == "admin") {
      throw new Error(" cannot remove yourself as admin");
    }

    const [messages, reactions, conversations] = await Promise.all([
      ctx.db
        .query("messages")
        .withIndex("by_member_id", (q) => q.eq("memberId", member._id))
        .collect(),
      ctx.db
        .query("reactions")
        .withIndex("by_member_id", (q) => q.eq("memberId", member._id))
        .collect(),
      ctx.db
        .query("conversations")
        .filter((q) =>
          q.or(
            q.eq(q.field("memberOneId"), member._id),
            q.eq(q.field("memberTwoId"), member._id)
          )
        )
        .collect(),
    ]);

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }
    for (const reaction of reactions) {
      await ctx.db.delete(reaction._id);
    }
    for (const conversation of conversations) {
      await ctx.db.delete(conversation._id);
    }

    await ctx.db.delete(args.id);

    return args.id;
  },
});
