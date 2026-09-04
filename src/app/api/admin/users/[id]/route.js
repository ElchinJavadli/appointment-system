import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  const id = Number(params.id);

  await prisma.user.delete({ where: { id } });

  return NextResponse.json({ message: "User deleted" });
}
