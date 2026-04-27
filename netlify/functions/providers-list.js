const { prisma } = require("./_lib/db");
const { json } = require("./_lib/http");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return json(200, { ok: true });
  if (event.httpMethod !== "GET") return json(405, { error: "Method not allowed" });

  const providers = await prisma.providerProfile.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return json(
    200,
    providers.map((p) => ({
      id: p.id,
      userId: p.userId,
      name: p.user.name,
      email: p.user.email,
      service: p.service,
      category: p.category,
      price: p.priceLabel,
      description: p.description,
      rating: p.rating,
      location: p.location,
      availability: p.availability,
      avatarImg: p.avatarImg,
      evidenceImg: p.evidenceImg,
      languages: p.languages,
      yearsExperience: p.yearsExperience,
    }))
  );
};

