import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { RouteParams } from "@/types";

export async function DELETE(req: Request, { params }: RouteParams) {
  const { imageId } = params;

  await prisma.serviceImage.delete({
    where: { id: Number(imageId) },
  });

  return NextResponse.json({ message: "Image deleted" });
}