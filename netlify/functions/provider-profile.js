const { z } = require("zod");
const { prisma } = require("./_lib/db");
const { json, readBody } = require("./_lib/http");
const { getBearerToken, verifyToken } = require("./_lib/auth");
const { buildProfileUpdateData, normalizeProviderProfileRecord } = require("./_lib/providers");

const patchSchema = z.object({
  name: z.string().optional(),
  service: z.string().optional(),
  serviceTitle: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  fullDetail: z.string().optional(),
  location: z.string().optional(),
  availability: z.string().optional(),
  yearsExperience: z.number().optional(),
  contactPhone: z.string().optional(),
  avatarImg: z.string().optional(),
  evidenceImg: z.string().optional(),
  languages: z.union([z.array(z.string()), z.string()]).optional(),
  credentials: z.array(z.string()).optional(),
  credentialImages: z.array(z.string()).optional(),
  servicesOffered: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string(),
        category: z.string().optional(),
        price: z.string().optional(),
        priceAmount: z.number().optional(),
        description: z.string().optional(),
        duration: z.string().optional(),
      })
    )
    .optional(),
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
  if (String(session.role || "").toUpperCase() !== "PROVIDER") {
    return json(403, { error: "Provider access required" });
  }

  const existing = await prisma.providerProfile.findUnique({
    where: { userId: session.sub },
    include: { user: true },
  });

  if (!existing) return json(404, { error: "Provider profile not found" });

  if (event.httpMethod === "GET") {
    return json(200, normalizeProviderProfileRecord(existing));
  }

  const payload = readBody(event);
  if (!payload) return json(400, { error: "Invalid JSON body" });
  const parsed = patchSchema.safeParse(payload);
  if (!parsed.success) return json(400, { error: "Invalid provider profile payload" });

  const update = buildProfileUpdateData(parsed.data, existing, existing.user);

  const updated = await prisma.providerProfile.update({
    where: { userId: session.sub },
    data: update.profile,
    include: { user: true },
  });

  if (update.user.name !== existing.user.name || update.user.phone !== existing.user.phone) {
    await prisma.user.update({
      where: { id: session.sub },
      data: update.user,
    });
    updated.user = { ...updated.user, ...update.user };
  }

  return json(200, normalizeProviderProfileRecord(updated));
};
