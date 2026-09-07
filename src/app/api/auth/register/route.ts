import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, password, role, category, bio } = body;

  if (!name || !email || !password) {
    return NextResponse.json(
      { message: "Please fill all required fields" },
      { status: 400 }
    );
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return NextResponse.json(
      { message: "This email is already registered" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || "client",
    },
  });

  if (role === "provider") {
    await prisma.provider.create({
      data: {
        userId: newUser.id,
        category: category || "General",
        bio: bio || "",
      },
    });
  }

  return NextResponse.json({
    message: "Registration successful",
    userId: newUser.id,
  });
}