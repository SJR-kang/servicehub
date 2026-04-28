const { prisma } = require("./_lib/db");
const { json } = require("./_lib/http");
const { normalizeProviderProfileRecord } = require("./_lib/providers");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return json(200, { ok: true });
  if (event.httpMethod !== "GET") return json(405, { error: "Method not allowed" });

  const providers = await prisma.providerProfile.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return json(
    200,
    providers.map((p) => {
      const normalized = normalizeProviderProfileRecord(p);
      return {
        id: normalized.id,
        profileId: normalized.profileId,
        userId: normalized.userId,
        name: normalized.name,
        email: normalized.email,
        service: normalized.service,
        category: normalized.category,
        price: normalized.price,
        priceAmount: normalized.priceAmount,
        description: normalized.description,
        rating: normalized.rating,
        location: normalized.location,
        availability: normalized.availability,
        avatarImg: normalized.avatarImg,
        languages: normalized.languages,
        yearsExperience: normalized.yearsExperience,
        servicesOffered: normalized.servicesOffered.map((service) => ({
          id: service.id,
          name: service.name,
          category: service.category,
          price: service.price,
          priceAmount: service.priceAmount,
          description: service.description,
          providerId: normalized.id,
        })),
      };
    })
  );
};

