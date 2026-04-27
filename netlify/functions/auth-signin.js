const bcrypt = require("bcryptjs");
const { z } = require("zod");
const { prisma } = require("./_lib/db");
const { json, readBody } = require("./_lib/http");
const { signToken } = require("./_lib/auth");

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return json(200, { ok: true });
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });

  const payload = readBody(event);
  if (!payload) return json(400, { error: "Invalid JSON body" });

  const parsed = bodySchema.safeParse(payload);
  if (!parsed.success) return json(400, { error: "Invalid signin payload" });

  const email = parsed.data.email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return json(401, { error: "Invalid credentials" });

  const passwordOk = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!passwordOk) return json(401, { error: "Invalid credentials" });

  const token = signToken(user);
  return json(200, {
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
};

