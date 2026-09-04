import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  const id = Number(params.id);


  const provider = await prisma.provider.findUnique({ where: { id } });
  if (provider) {
    await prisma.user.delete({ where: { id: provider.userId } });
  }
  

  return NextResponse.json({ message: "Provider deleted" });
  
}
