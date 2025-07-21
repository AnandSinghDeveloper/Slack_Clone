import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";
import WorkspaceHeader from "@/app/workspace/[workspaceId]/WorkspaceHeader";

const schema = defineSchema({
  ...authTables,
  workspace: defineTable({
    name: v.string(),
    userId: v.id("users"),
    joinCode: v.string(),
  }),

  members: defineTable({
    workspaceId: v.id("workspace"),
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("member")),
  })
    .index("by_user_id", ["userId"])
    .index("by_workspace_id", ["workspaceId"])
    .index("by_workspace_id_and_user_id", ["workspaceId", "userId"]),

  channels: defineTable({
    name: v.string(),
    workspaceId: v.id("workspace"),
  }).index("by_workspace_id", ["workspaceId"]),

  conversations: defineTable({
    WorkspaceId: v.id("workspace"),
    //  ChannelId: v.id("channels"),
    memberOneId: v.id("members"),
    memberTwoId: v.id("members"),
  }).index("by_workspace_id", ["WorkspaceId"]),
  messages: defineTable({
    body: v.string(),
    image: v.optional(v.id("_storage")),
    channelId: v.optional(v.id("channels")),
    memberId: v.id("members"),
    workspaceId: v.id("workspace"),
    parentMessageId: v.optional(v.id("messages")),
    conversationId: v.optional(v.id("conversations")),
    updatedAt: v.optional(v.number()),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_channel_id", ["channelId"])
    .index("by_member_id", ["memberId"])
    .index("by_conversation_id", ["conversationId"])
    .index("by_parent_message_id", ["parentMessageId"])
    .index("by_channel_id_parent_message_id_conversation_id", [
      "channelId",
      "parentMessageId",
      "conversationId",
    ]),

  reactions: defineTable({
    WorkspaceId: v.id("workspace"),
    messageId: v.id("messages"),
    memberId: v.id("members"),
    value: v.string(),
  })
    .index("by_workspace_id", ["WorkspaceId"])
    .index("by_message_id", ["messageId"])
    .index("by_member_id", ["memberId"]),
});

export default schema;
