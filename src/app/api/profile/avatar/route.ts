import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("avatar");

  if (!file || typeof file === "string") {
    return NextResponse.json({ message: "No image provided" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileName = `avatar-${currentUser.id}-${Date.now()}-${file.name}`;
  const filePath = path.join(process.cwd(), "public", "uploads", fileName);

  await writeFile(filePath, buffer);

  const avatarUrl = `/uploads/${fileName}`;

  await prisma.user.update({
    where: { id: currentUser.id },
    data: { avatarUrl },
  });

  return NextResponse.json({ avatarUrl });
}

export async function DELETE() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: currentUser.id },
    select: { avatarUrl: true },
  });

  if (user?.avatarUrl) {
    const oldPath = path.join(process.cwd(), "public", user.avatarUrl);
    try {
      await unlink(oldPath);
    } catch {
      // fayl tapılmasa problem deyil, ötür keç
    }
  }

  await prisma.user.update({
    where: { id: currentUser.id },
    data: { avatarUrl: null },
  });

  return NextResponse.json({ avatarUrl: null });
}