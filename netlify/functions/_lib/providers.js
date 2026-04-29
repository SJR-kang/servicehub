const FALLBACK_AVATAR = "https://randomuser.me/api/portraits/lego/1.jpg";
const FALLBACK_COVER = "https://picsum.photos/id/104/1200/400";

const CATEGORY_OPTIONS = ["Academic", "Cleaning", "Tutoring", "Design", "Photography", "Choreography", "Delivery"];

const parseAmount = (value, fallback = 0) => {
  if (typeof value === "number" && Number.isFinite(value)) return Math.round(value);
  const text = String(value || "").trim();
  if (!text) return fallback;
  const match = text.match(/[\d,.]+/g);
  if (!match || match.length === 0) return fallback;
  const raw = Number.parseFloat(match[0].replace(/,/g, ""));
  return Number.isFinite(raw) ? Math.round(raw) : fallback;
};

const formatPhp = (value) => `₱${Math.round(Number(value) || 0).toLocaleString("en-PH")}`;

const sanitizeString = (value, fallback = "") => String(value ?? fallback).trim();

const normalizeLanguages = (value) =>
  Array.isArray(value)
    ? value.map((item) => sanitizeString(item)).filter(Boolean)
    : sanitizeString(value)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

const normalizeCredentials = (value) =>
  Array.isArray(value) ? value.map((item) => sanitizeString(item)).filter(Boolean) : [];

const normalizeCredentialImages = (value) =>
  Array.isArray(value) ? value.map((item) => sanitizeString(item)).filter(Boolean) : [];

const normalizeServiceItem = (service, fallbackProvider) => {
  const amount = parseAmount(service?.priceAmount ?? service?.price, parseAmount(fallbackProvider.priceLabel, 0));
  const category = sanitizeString(service?.category, fallbackProvider.category || "General");
  const name = sanitizeString(service?.name, fallbackProvider.service || "General Service");

  return {
    id: sanitizeString(service?.id, `svc_${fallbackProvider.userId}_${name.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`),
    name,
    category,
    priceAmount: amount,
    price: formatPhp(amount),
    description: sanitizeString(service?.description, fallbackProvider.description || "Service details available upon request."),
    duration: sanitizeString(service?.duration, "Flexible"),
    providerId: fallbackProvider.userId,
  };
};

const buildServices = (profile) => {
  const stored = Array.isArray(profile?.services) ? profile.services : [];
  const services = stored
    .map((service) => normalizeServiceItem(service, profile))
    .filter((service) => service.name);

  if (services.length > 0) return services;

  return [
    normalizeServiceItem(
      {
        id: `svc_${profile.userId}_primary`,
        name: profile.service,
        category: profile.category,
        price: profile.priceLabel,
        description: profile.description,
      },
      profile
    ),
  ];
};

const normalizeProviderProfileRecord = (profile) => {
  const services = buildServices(profile);
  const primary = services[0];

  return {
    id: profile.userId,
    profileId: profile.id,
    userId: profile.userId,
    name: sanitizeString(profile.user?.name, "Provider"),
    email: sanitizeString(profile.user?.email),
    service: sanitizeString(profile.service, primary?.name || "General Service"),
    category: sanitizeString(profile.category, primary?.category || "General"),
    price: sanitizeString(profile.priceLabel, primary?.price || formatPhp(0)),
    priceAmount: parseAmount(primary?.priceAmount, 0),
    description: sanitizeString(profile.description, "Professional service provider committed to excellence."),
    fullDetail: sanitizeString(profile.fullDetail, profile.description),
    rating: Number(profile.rating ?? 5) || 5,
    location: sanitizeString(profile.location),
    availability: sanitizeString(profile.availability),
    avatarImg: sanitizeString(profile.avatarImg, FALLBACK_AVATAR),
    evidenceImg: sanitizeString(profile.evidenceImg, FALLBACK_COVER),
    languages: normalizeLanguages(profile.languages),
    yearsExperience: Number(profile.yearsExperience ?? 0) || 0,
    contactPhone: sanitizeString(profile.contactPhone, profile.user?.phone || ""),
    contactEmail: sanitizeString(profile.user?.email),
    credentials: normalizeCredentials(profile.credentials),
    credentialImages: normalizeCredentialImages(profile.credentialImages),
    servicesOffered: services,
    verificationStatus: {
      idVerified: true,
      emailVerified: Boolean(profile.user?.email),
      paymentVerified: true,
      backgroundChecked: true,
    },
    reviews: [],
  };
};

const buildProfileUpdateData = (payload, existingProfile, user) => {
  const nextLanguages = payload.languages !== undefined ? normalizeLanguages(payload.languages) : normalizeLanguages(existingProfile.languages);
  const nextCredentials = payload.credentials !== undefined ? normalizeCredentials(payload.credentials) : normalizeCredentials(existingProfile.credentials);
  const nextCredentialImages = payload.credentialImages !== undefined
    ? normalizeCredentialImages(payload.credentialImages)
    : normalizeCredentialImages(existingProfile.credentialImages);

  const nextServices = payload.servicesOffered !== undefined
    ? (Array.isArray(payload.servicesOffered) ? payload.servicesOffered : []).map((service) =>
        normalizeServiceItem(service, {
          userId: existingProfile.userId,
          service: existingProfile.service,
          category: existingProfile.category,
          priceLabel: existingProfile.priceLabel,
          description: existingProfile.description,
        })
      )
    : buildServices(existingProfile);

  const primary = nextServices[0] || normalizeServiceItem({}, {
    userId: existingProfile.userId,
    service: existingProfile.service,
    category: existingProfile.category,
    priceLabel: existingProfile.priceLabel,
    description: existingProfile.description,
  });

  return {
    profile: {
      service: sanitizeString(payload.serviceTitle, payload.service ?? primary.name),
      category: sanitizeString(payload.category, primary.category || existingProfile.category || CATEGORY_OPTIONS[0]),
      priceLabel: formatPhp(parseAmount(payload.priceAmount ?? primary.priceAmount, parseAmount(existingProfile.priceLabel, 0))),
      description: sanitizeString(payload.description, existingProfile.description),
      fullDetail: sanitizeString(payload.fullDetail, payload.description ?? existingProfile.fullDetail ?? existingProfile.description),
      location: sanitizeString(payload.location, existingProfile.location),
      availability: sanitizeString(payload.availability, existingProfile.availability),
      avatarImg: sanitizeString(payload.avatarImg, existingProfile.avatarImg),
      evidenceImg: sanitizeString(payload.evidenceImg, existingProfile.evidenceImg),
      contactPhone: sanitizeString(payload.contactPhone, existingProfile.contactPhone || user.phone || ""),
      yearsExperience: Number(payload.yearsExperience ?? existingProfile.yearsExperience ?? 0) || 0,
      languages: nextLanguages,
      credentials: nextCredentials,
      credentialImages: nextCredentialImages,
      services: nextServices,
    },
    user: {
      name: sanitizeString(payload.name, user.name),
      phone: sanitizeString(payload.contactPhone, user.phone || "") || null,
    },
  };
};

module.exports = {
  CATEGORY_OPTIONS,
  FALLBACK_AVATAR,
  FALLBACK_COVER,
  buildProfileUpdateData,
  formatPhp,
  normalizeProviderProfileRecord,
  parseAmount,
};
