const { z } = require("zod");
const { prisma } = require("./_lib/db");
const { json, readBody } = require("./_lib/http");
const { getBearerToken, verifyToken } = require("./_lib/auth");

const patchSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  occupation: z.string().optional(),
  bio: z.string().optional(),
});

async function getSession(event) {
  const token = getBearerToken(event.headers);
  if (!token) return { error: json(401, { error: "Missing auth token" }) };

  try {
    const session = verifyToken(token);
    return { session };
  } catch (_) {
    return { error: json(401, { error: "Invalid auth token" }) };
  }
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return json(200, { ok: true });
  if (!["GET", "PATCH"].includes(event.httpMethod)) return json(405, { error: "Method not allowed" });

  const { session, error } = await getSession(event);
  if (error) return error;
  if (String(session.role || "").toUpperCase() !== "SEEKER") {
    return json(403, { error: "Seeker access required" });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      location: true,
      occupation: true,
      bio: true,
      role: true,
    },
  });
  if (!user) return json(404, { error: "Seeker profile not found" });

  if (event.httpMethod === "GET") return json(200, user);

  const payload = readBody(event);
  if (!payload) return json(400, { error: "Invalid JSON body" });
  const parsed = patchSchema.safeParse(payload);
  if (!parsed.success) return json(400, { error: "Invalid seeker profile payload" });

  const data = {};
  if (parsed.data.name !== undefined) data.name = String(parsed.data.name || "").trim();
  if (parsed.data.phone !== undefined) data.phone = String(parsed.data.phone || "").trim() || null;
  if (parsed.data.location !== undefined) data.location = String(parsed.data.location || "").trim() || null;
  if (parsed.data.occupation !== undefined) data.occupation = String(parsed.data.occupation || "").trim() || null;
  if (parsed.data.bio !== undefined) data.bio = String(parsed.data.bio || "").trim() || null;

  const updated = await prisma.user.update({
    where: { id: session.sub },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      location: true,
      occupation: true,
      bio: true,
      role: true,
    },
  });

  return json(200, updated);
};

