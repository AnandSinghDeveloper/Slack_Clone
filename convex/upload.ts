import { mutation } from "./_generated/server";

export const genrateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});
