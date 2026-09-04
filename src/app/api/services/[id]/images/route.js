import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req, { params }) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "provider") {
    return NextResponse.json({ message: "Not allowed" }, { status: 403 });
  }

  const serviceId = Number(params.id);


  const provider = await prisma.provider.findUnique({
    where: { userId: currentUser.id },
  });

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
  });

  if (!service || service.providerId !== provider.id) {
    return NextResponse.json({ message: "Service not found" }, { status: 404 });
  }


  const formData = await req.formData();
  const file = formData.get("image");

  if (!file) {
    return NextResponse.json({ message: "No image provided" }, { status: 400 });
  }


  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);


  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(process.cwd(), "public", "uploads", fileName);

  await writeFile(filePath, buffer);


  const newImage = await prisma.serviceImage.create({
    data: {
      serviceId: serviceId,
      url: `/uploads/${fileName}`,
    },
  });

  return NextResponse.json(newImage);
}