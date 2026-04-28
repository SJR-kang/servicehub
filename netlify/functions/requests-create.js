const { z } = require("zod");
const { prisma } = require("./_lib/db");
const { json, readBody } = require("./_lib/http");
const { getBearerToken, verifyToken } = require("./_lib/auth");

const bodySchema = z.object({
  providerId: z.string().min(1),
  serviceId: z.string().min(1).optional(),
  serviceName: z.string().min(1),
  priceAmount: z.number().optional(),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  location: z.string().optional(),
  budget: z.string().optional(),
  serviceDetails: z.string().optional(),
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
  if (!parsed.success) return json(400, { error: "Invalid request payload" });

  const provider = await prisma.user.findUnique({
    where: { id: parsed.data.providerId },
    select: { id: true, role: true },
  });
  if (!provider || provider.role !== "PROVIDER") {
    return json(404, { error: "Provider not found" });
  }

  const request = await prisma.serviceRequest.create({
    data: {
      requestCode: `REQ-${Date.now()}`,
      seekerId: session.sub,
      providerId: parsed.data.providerId,
      serviceName: parsed.data.serviceName,
      priceAmount: parsed.data.priceAmount ?? null,
      preferredDate: parsed.data.preferredDate ? new Date(parsed.data.preferredDate) : null,
      preferredTime: parsed.data.preferredTime || null,
      location: parsed.data.location || null,
      budget: parsed.data.budget || null,
      serviceDetails: parsed.data.serviceDetails || null,
      status: "PENDING",
      amountPaid: 0,
      remainingBalance: parsed.data.priceAmount ?? null,
      isFullyPaid: false,
    },
  });

  return json(201, request);
};

