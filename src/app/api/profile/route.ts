import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });
  }

  let providerData = null;
  let totalAppointments = 0;

  if (currentUser.role === "provider") {
    providerData = await prisma.provider.findUnique({
      where: { userId: currentUser.id },
    });

    if (providerData) {
      totalAppointments = await prisma.appointment.count({
        where: { providerId: providerData.id },
      });
    }
  } else {
    totalAppointments = await prisma.appointment.count({
      where: { clientId: currentUser.id },
    });
  }

  return NextResponse.json({
    id: currentUser.id,
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
    avatarUrl: currentUser.avatarUrl,
    role: currentUser.role,
    createdAt: currentUser.createdAt,
    totalAppointments,
    provider: providerData,
  });
}

export async function PUT(req: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });
  }

  const body = await req.json();
  const { name, phone, bio, category, address, website } = body;

  await prisma.user.update({
    where: { id: currentUser.id },
    data: {
      name: name || currentUser.name,
      phone: phone || null,
    },
  });

  if (currentUser.role === "provider") {
    await prisma.provider.update({
      where: { userId: currentUser.id },
      data: {
        bio: bio || null,
        category: category || "General",
        address: address || null,
        website: website || null,
      },
    });
  }

  return NextResponse.json({ message: "Profile updated successfully" });
}