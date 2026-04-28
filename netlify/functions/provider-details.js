const { prisma } = require("./_lib/db");
const { json } = require("./_lib/http");
const { normalizeProviderProfileRecord } = require("./_lib/providers");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return json(200, { ok: true });
  if (event.httpMethod !== "GET") return json(405, { error: "Method not allowed" });

  const providerId = event.queryStringParameters?.id;
  if (!providerId) return json(400, { error: "Provider id is required" });

  const profile = await prisma.providerProfile.findUnique({
    where: { userId: providerId },
    include: { user: true },
  });

  if (!profile) return json(404, { error: "Provider not found" });

  return json(200, normalizeProviderProfileRecord(profile));
};
