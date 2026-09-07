import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });
  }

  let providerId = null;
  if (user.role === "provider") {
    const provider = await prisma.provider.findUnique({
      where: { userId: user.id },
    });
    providerId = provider?.id || null;
  }

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    providerId,
  });
}