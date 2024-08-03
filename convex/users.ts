import { v, ConvexError } from "convex/values";
import { internalMutation, query } from "./_generated/server";

const createUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    email: v.string(),
    name: v.string(),
    image: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("users", {
      tokenIdentifier: args.tokenIdentifier,
      email: args.email,
      name: args.name,
      image: args.image,
      isOnline: true,
    });
  },
});

const updateUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    image: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", args.tokenIdentifier)
      )
      .unique();

    if (!user) {
      throw new ConvexError("user not found");
    }

    await ctx.db.patch(user._id, { image: args.image });
  },
});

const setUserOnline = internalMutation({
  args: {
    tokenIdentifier: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", args.tokenIdentifier)
      )
      .unique();

    if (!user) {
      throw new ConvexError("user not found");
    }

    await ctx.db.patch(user._id, { isOnline: true });
  },
});

const setUserOffline = internalMutation({
  args: {
    tokenIdentifier: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", args.tokenIdentifier)
      )
      .unique();

    if (!user) {
      throw new ConvexError("user not found");
    }

    await ctx.db.patch(user._id, { isOnline: false });
  },
});

const getUsers = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const users = await ctx.db.query("users").collect();
    return users.filter(
      (user) => user.tokenIdentifier !== identity.tokenIdentifier
    );
  },
});

const getMe = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }
    return user;
  },
});

const getGroupMembers = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const conversation = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("_id"), args.conversationId))
      .first();

    if (!conversation) throw new ConvexError("Conversation not found");

    const users = await ctx.db.query("users").collect();
    const groupMembers = users.filter((user) =>
      conversation.participants.includes(user._id)
    );
    return groupMembers;
  },
});

export {
  createUser,
  updateUser,
  setUserOffline,
  setUserOnline,
  getUsers,
  getMe,
  getGroupMembers,
};
