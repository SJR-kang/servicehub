const { prisma } = require("./_lib/db");
const { json } = require("./_lib/http");
const { getBearerToken, verifyToken } = require("./_lib/auth");

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

  const requests = await prisma.serviceRequest.findMany({
    where,
    include: {
      seeker: { select: { id: true, name: true, email: true } },
      provider: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return json(200, requests);
};

