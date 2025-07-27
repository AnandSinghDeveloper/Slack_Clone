import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { auth } from "./auth";

export const createOrget = mutation({
  args: {
    workspaceId: v.id("workspace"),
    memberId: v.id("members"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const CurrentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_and_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();

    const otherMember = await ctx.db.get(args.memberId);

    if (!CurrentMember || !otherMember) {
      throw new Error("Member not found");
    }

    const exitingConversation = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("WorkspaceId"), args.workspaceId))
      .filter((q) =>
        q.or(
          q.and(
            q.eq(q.field("memberOneId"), CurrentMember._id),
            q.eq(q.field("memberTwoId"), otherMember._id)
          ),
          q.and(
            q.eq(q.field("memberOneId"), otherMember._id),
            q.eq(q.field("memberTwoId"), CurrentMember._id)
          )
        )
      )
      .unique();

   if(exitingConversation){
    return exitingConversation._id;
   }

   const conversationId = await ctx.db.insert("conversations",{
    WorkspaceId: args.workspaceId,
    memberOneId: CurrentMember._id,
    memberTwoId: otherMember._id,
    

   })


  //  const conversationId = await ctx.db.get(conversationId);

  //   // if(!conversation){
  //   //   throw new Error("Conversation not found");
    // }
     

    return conversationId;

  },
});
