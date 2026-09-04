import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const providers = await prisma.provider.findMany({
    include: { user: true, services: true },
  });

  return NextResponse.json({ providers });
}
