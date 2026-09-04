import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  const { imageId } = params;

  await prisma.serviceImage.delete({
    where: { id: Number(imageId) },
  });

  return NextResponse.json({ message: "Image deleted" });
}