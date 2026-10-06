import { prisma } from "../../../lib/prisma";

export async function POST(request) {
  let email;
  try {
    const body = await request.json();
    email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  } catch {
    email = "";
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  try {
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("newsletter subscribe failed", error);
    return Response.json({ error: "Could not save your subscription." }, { status: 500 });
  }
}