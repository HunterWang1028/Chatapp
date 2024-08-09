import OpenAI from "openai";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

const apiKey = process.env.OPEMAI_API_KEY;

const openai = new OpenAI({ apiKey });

const chat = action({
  args: {
    messageBody: v.string(),
    conversation: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const res = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a terse bot in a group chat responding to questions with 2-sentence answers",
        },
        {
          role: "user",
          content: args.messageBody,
        },
      ],
    });

    const messageContent = res.choices[0].message.content;

    await ctx.runMutation(api.messages.sendChatGPtMessage, {
      content: messageContent ?? "I'm sorry, I don't understand that",
      conversation: args.conversation,
    });
  },
});

export { openai, chat };
