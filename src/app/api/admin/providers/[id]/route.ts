import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { RouteParams } from "@/types";

export async function DELETE(req: Request, { params }: RouteParams) {
  const id = Number(params.id);

  const provider = await prisma.provider.findUnique({ where: { id } });
  if (provider) {
    await prisma.user.delete({ where: { id: provider.userId } });
  }

  return NextResponse.json({ message: "Provider deleted" });
}