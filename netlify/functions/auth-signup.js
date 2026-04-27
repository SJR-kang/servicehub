const bcrypt = require("bcryptjs");
const { z } = require("zod");
const { prisma } = require("./_lib/db");
const { json, readBody } = require("./_lib/http");
const { signToken } = require("./_lib/auth");

const bodySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["SEEKER", "PROVIDER"]),
  phone: z.string().optional(),
});

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return json(200, { ok: true });
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });

  const payload = readBody(event);
  if (!payload) return json(400, { error: "Invalid JSON body" });

  const parsed = bodySchema.safeParse(payload);
  if (!parsed.success) return json(400, { error: "Invalid signup payload" });

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return json(409, { error: "Email already registered" });

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name: parsed.data.name,
      phone: parsed.data.phone || null,
      role: parsed.data.role,
    },
  });

  const token = signToken(user);
  return json(201, {
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
};

