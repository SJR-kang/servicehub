const { z } = require("zod");
const { prisma } = require("./_lib/db");
const { json, readBody } = require("./_lib/http");
const { getBearerToken, verifyToken } = require("./_lib/auth");
const { getConversationForUser, serializeMessage } = require("./_lib/messages");

const bodySchema = z.object({
  conversationId: z.string().min(1),
  body: z.string().min(1).max(5000),
});

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return json(200, { ok: true });
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });

  const token = getBearerToken(event.headers);
  if (!token) return json(401, { error: "Missing auth token" });

  let session;
  try {
    session = verifyToken(token);
  } catch (_) {
    return json(401, { error: "Invalid auth token" });
  }

  const payload = readBody(event);
  if (!payload) return json(400, { error: "Invalid JSON body" });
  const parsed = bodySchema.safeParse(payload);
  if (!parsed.success) return json(400, { error: "Invalid message payload" });

  const conversation = await getConversationForUser(parsed.data.conversationId, session.sub);
  if (!conversation) return json(404, { error: "Conversation not found" });

  const now = new Date();
  const message = await prisma.message.create({
    data: {
      conversationId: parsed.data.conversationId,
      senderId: session.sub,
      body: parsed.data.body.trim(),
    },
    include: { sender: { select: { id: true, name: true } } },
  });

  await prisma.conversation.update({
    where: { id: parsed.data.conversationId },
    data: {
      lastMessageAt: now,
      seekerLastReadAt: conversation.seekerId === session.sub ? now : conversation.seekerLastReadAt,
      providerLastReadAt: conversation.providerId === session.sub ? now : conversation.providerLastReadAt,
    },
  });

  return json(201, serializeMessage(message));
};
