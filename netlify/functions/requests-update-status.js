const { z } = require("zod");
const { prisma } = require("./_lib/db");
const { json, readBody } = require("./_lib/http");
const { getBearerToken, verifyToken } = require("./_lib/auth");

const bodySchema = z.object({
  requestId: z.string().min(1),
  status: z.enum(["PENDING", "IN_PROGRESS", "AWAITING_PAYMENT", "PAID", "COMPLETED", "REJECTED"]),
  paymentAmount: z.number().optional(),
  paymentType: z.string().optional(),
  rejectionReason: z.string().optional(),
});

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return json(200, { ok: true });
  if (event.httpMethod !== "PATCH") return json(405, { error: "Method not allowed" });

  const token = getBearerToken(event.headers);
  if (!token) return json(401, { error: "Missing auth token" });

  try {
    verifyToken(token);
  } catch (_) {
    return json(401, { error: "Invalid auth token" });
  }

  const payload = readBody(event);
  if (!payload) return json(400, { error: "Invalid JSON body" });
  const parsed = bodySchema.safeParse(payload);
  if (!parsed.success) return json(400, { error: "Invalid status update payload" });

  const updateData = { status: parsed.data.status };
  if (parsed.data.paymentAmount != null) updateData.paymentAmount = parsed.data.paymentAmount;
  if (parsed.data.paymentType) updateData.paymentType = parsed.data.paymentType;
  if (parsed.data.rejectionReason) updateData.rejectionReason = parsed.data.rejectionReason;
  if (parsed.data.status === "PAID") updateData.paymentConfirmedAt = new Date();
  if (parsed.data.status === "COMPLETED") updateData.completedAt = new Date();
  if (parsed.data.status === "AWAITING_PAYMENT") updateData.paymentRequestedAt = new Date();

  const updated = await prisma.serviceRequest.update({
    where: { id: parsed.data.requestId },
    data: updateData,
  });

  return json(200, updated);
};

