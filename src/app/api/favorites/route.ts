import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });
  }

  const favorites = await prisma.favorite.findMany({
    where: { clientId: currentUser.id },
    include: {
      service: {
        include: {
          provider: { include: { user: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ favorites });
}

export async function POST(req: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });
  }

  const body = await req.json();
  const serviceId = Number(body.serviceId);

  if (!serviceId) {
    return NextResponse.json({ message: "serviceId is required" }, { status: 400 });
  }

  const existing = await prisma.favorite.findUnique({
    where: {
      clientId_serviceId: {
        clientId: currentUser.id,
        serviceId,
      },
    },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return NextResponse.json({ favorited: false });
  }

  await prisma.favorite.create({
    data: { clientId: currentUser.id, serviceId },
  });

  return NextResponse.json({ favorited: true });
}