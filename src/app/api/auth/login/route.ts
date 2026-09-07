import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return NextResponse.json({ message: "Incorrect password" }, { status: 401 });
  }

  const response = NextResponse.json({
    message: "Login successful",
    role: user.role,
    userId: user.id,
  });

  response.cookies.set("userId", String(user.id), { httpOnly: true, path: "/" });
  response.cookies.set("role", user.role, { httpOnly: true, path: "/" });

  return response;
}