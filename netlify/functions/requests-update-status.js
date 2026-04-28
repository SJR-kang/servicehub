const { z } = require("zod");
const { prisma } = require("./_lib/db");
const { json, readBody } = require("./_lib/http");
const { getBearerToken, verifyToken } = require("./_lib/auth");

const bodySchema = z.object({
  requestId: z.string().min(1),
  status: z.enum(["PENDING", "IN_PROGRESS", "AWAITING_PAYMENT", "PAID", "COMPLETED", "REJECTED"]),
  paymentAmount: z.number().optional(),
  paymentType: z.string().optional(),
  amountPaid: z.number().optional(),
  rejectionReason: z.string().optional(),
});

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return json(200, { ok: true });
  if (event.httpMethod !== "PATCH") return json(405, { error: "Method not allowed" });

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
  if (!parsed.success) return json(400, { error: "Invalid status update payload" });

  const existing = await prisma.serviceRequest.findUnique({
    where: { id: parsed.data.requestId },
    select: { id: true, seekerId: true, providerId: true, priceAmount: true, amountPaid: true },
  });
  if (!existing) return json(404, { error: "Request not found" });

  const role = String(session.role || "").toUpperCase();
  const ownsRequest =
    (role === "PROVIDER" && existing.providerId === session.sub) ||
    (role === "SEEKER" && existing.seekerId === session.sub);
  if (!ownsRequest) return json(403, { error: "You cannot update this request" });

  const seekerAllowed = new Set(["PAID"]);
  if (role === "SEEKER" && !seekerAllowed.has(parsed.data.status)) {
    return json(403, { error: "Seekers can only confirm payments" });
  }

  const updateData = { status: parsed.data.status };
  if (parsed.data.paymentAmount != null) updateData.paymentAmount = parsed.data.paymentAmount;
  if (parsed.data.paymentType) updateData.paymentType = parsed.data.paymentType;
  if (parsed.data.amountPaid != null) updateData.amountPaid = parsed.data.amountPaid;
  if (parsed.data.rejectionReason) updateData.rejectionReason = parsed.data.rejectionReason;
  if (parsed.data.status === "PAID") updateData.paymentConfirmedAt = new Date();
  if (parsed.data.status === "COMPLETED") updateData.completedAt = new Date();
  if (parsed.data.status === "AWAITING_PAYMENT") updateData.paymentRequestedAt = new Date();

  // Keep remainingBalance/isFullyPaid consistent when we know total priceAmount.
  if (parsed.data.status === "PAID") {
    const total = Number(existing?.priceAmount ?? 0) || 0;
    const paid = parsed.data.amountPaid != null ? Number(parsed.data.amountPaid) : Number(existing?.amountPaid ?? parsed.data.paymentAmount ?? 0);
    const remaining = total > 0 ? Math.max(0, total - paid) : 0;
    updateData.remainingBalance = remaining;
    updateData.isFullyPaid = total > 0 ? remaining === 0 : paid > 0;
  }

  const updated = await prisma.serviceRequest.update({
    where: { id: parsed.data.requestId },
    data: updateData,
  });

  return json(200, updated);
};

