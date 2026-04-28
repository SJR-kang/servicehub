const { prisma } = require("./_lib/db");
const { json } = require("./_lib/http");
const { getBearerToken, verifyToken } = require("./_lib/auth");
const { getConversationForUser, markConversationRead, serializeMessage } = require("./_lib/messages");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return json(200, { ok: true });
  if (event.httpMethod !== "GET") return json(405, { error: "Method not allowed" });

  const token = getBearerToken(event.headers);
  if (!token) return json(401, { error: "Missing auth token" });

  let session;
  try {
    session = verifyToken(token);
  } catch (_) {
    return json(401, { error: "Invalid auth token" });
  }

  const conversationId = event.queryStringParameters?.conversationId;
  if (!conversationId) return json(400, { error: "conversationId is required" });

  const allowedConversation = await getConversationForUser(conversationId, session.sub);
  if (!allowedConversation) return json(404, { error: "Conversation not found" });

  await markConversationRead(conversationId, session.sub);

  const messages = await prisma.message.findMany({
    where: { conversationId },
    include: { sender: { select: { id: true, name: true } } },
    orderBy: { createdAt: "asc" },
  });

  return json(200, {
    conversationId,
    messages: messages.map(serializeMessage),
  });
};
