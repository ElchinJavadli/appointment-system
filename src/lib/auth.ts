import { cookies } from "next/headers";
import { prisma } from "./prisma";
import type { User } from "@prisma/client";

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(userId) },
  });

  return user;
}