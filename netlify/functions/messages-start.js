const { z } = require("zod");
const { prisma } = require("./_lib/db");
const { json, readBody } = require("./_lib/http");
const { getBearerToken, verifyToken } = require("./_lib/auth");
const { assertRolePair, serializeConversation } = require("./_lib/messages");

const bodySchema = z.object({
  kind: z.enum(["GENERAL", "REQUEST"]),
  otherUserId: z.string().min(1).optional(),
  requestId: z.string().min(1).optional(),
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
  if (!parsed.success) return json(400, { error: "Invalid conversation payload" });

  const role = String(session.role || "").toUpperCase();
  let conversation;

  if (parsed.data.kind === "REQUEST") {
    if (!parsed.data.requestId) return json(400, { error: "requestId is required" });
    const request = await prisma.serviceRequest.findUnique({
      where: { id: parsed.data.requestId },
      include: {
        seeker: { select: { id: true, name: true, email: true, role: true } },
        provider: { select: { id: true, name: true, email: true, role: true } },
      },
    });
    if (!request) return json(404, { error: "Request not found" });
    if (request.seekerId !== session.sub && request.providerId !== session.sub) {
      return json(403, { error: "You cannot access this request chat" });
    }

    conversation = await prisma.conversation.upsert({
      where: { requestId: request.id },
      update: {},
      create: {
        kind: "REQUEST",
        requestId: request.id,
        seekerId: request.seekerId,
        providerId: request.providerId,
        seekerLastReadAt: role === "SEEKER" ? new Date() : null,
        providerLastReadAt: role === "PROVIDER" ? new Date() : null,
      },
      include: {
        seeker: { select: { id: true, name: true, email: true, role: true } },
        provider: { select: { id: true, name: true, email: true, role: true } },
        request: { select: { id: true, requestCode: true, serviceName: true } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });
  } else {
    if (!parsed.data.otherUserId) return json(400, { error: "otherUserId is required" });
    const otherUser = await prisma.user.findUnique({
      where: { id: parsed.data.otherUserId },
      select: { id: true, name: true, email: true, role: true },
    });
    if (!otherUser) return json(404, { error: "User not found" });
    if (!assertRolePair({ role }, otherUser)) {
      return json(403, { error: "General chat is only available between seekers and providers" });
    }

    const seekerId = role === "SEEKER" ? session.sub : otherUser.id;
    const providerId = role === "PROVIDER" ? session.sub : otherUser.id;

    conversation = await prisma.conversation.upsert({
      where: {
        seekerId_providerId_kind: {
          seekerId,
          providerId,
          kind: "GENERAL",
        },
      },
      update: {},
      create: {
        kind: "GENERAL",
        seekerId,
        providerId,
        seekerLastReadAt: role === "SEEKER" ? new Date() : null,
        providerLastReadAt: role === "PROVIDER" ? new Date() : null,
      },
      include: {
        seeker: { select: { id: true, name: true, email: true, role: true } },
        provider: { select: { id: true, name: true, email: true, role: true } },
        request: { select: { id: true, requestCode: true, serviceName: true } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });
  }

  return json(200, serializeConversation(conversation, session.sub));
};
