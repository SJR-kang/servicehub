const { prisma } = require("./_lib/db");
const { json } = require("./_lib/http");
const { getBearerToken, verifyToken } = require("./_lib/auth");
const { serializeConversation } = require("./_lib/messages");

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

  const role = String(session.role || "").toUpperCase();
  const where = role === "PROVIDER" ? { providerId: session.sub } : { seekerId: session.sub };

  const conversations = await prisma.conversation.findMany({
    where,
    include: {
      seeker: { select: { id: true, name: true, email: true, role: true } },
      provider: { select: { id: true, name: true, email: true, role: true } },
      request: { select: { id: true, requestCode: true, serviceName: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { lastMessageAt: "desc" },
  });

  return json(200, conversations.map((conversation) => serializeConversation(conversation, session.sub)));
};
