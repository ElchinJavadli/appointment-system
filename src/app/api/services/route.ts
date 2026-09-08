import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const providerId = searchParams.get("providerId");

  const services = await prisma.service.findMany({
    where: providerId ? { providerId: Number(providerId) } : {},
    include: {
      images: true,
      provider: {
        include: { user: true },
      },
    },
  });

  return NextResponse.json({ services });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, price, duration, providerId, description } = body;

  if (!name || !price || !duration || !providerId) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  const service = await prisma.service.create({
    data: {
      name,
      price: Number(price),
      duration: Number(duration),
      providerId: Number(providerId),
      description: description || null,
    },
  });

  return NextResponse.json({ message: "Service created", service });
}