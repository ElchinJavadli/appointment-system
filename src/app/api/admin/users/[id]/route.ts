import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { RouteParams } from "@/types";

export async function DELETE(req: Request, { params }: RouteParams) {
  const id = Number(params.id);

  await prisma.user.delete({ where: { id } });

  return NextResponse.json({ message: "User deleted" });
}