import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const providerId = Number(searchParams.get("providerId"));

  const hours = await prisma.workingHour.findMany({
    where: { providerId },
    orderBy: { dayOfWeek: "asc" },
  });

  return NextResponse.json({ hours });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { providerId, dayOfWeek, startTime, endTime, isDayOff, breakStart, breakEnd } = body;

  const normalizedBreakStart = breakStart && breakEnd ? breakStart : null;
  const normalizedBreakEnd = breakStart && breakEnd ? breakEnd : null;

  const hour = await prisma.workingHour.upsert({
    where: {
      providerId_dayOfWeek: {
        providerId: Number(providerId),
        dayOfWeek: Number(dayOfWeek),
      },
    },
    update: {
      startTime,
      endTime,
      isDayOff,
      breakStart: normalizedBreakStart,
      breakEnd: normalizedBreakEnd,
    },
    create: {
      providerId: Number(providerId),
      dayOfWeek: Number(dayOfWeek),
      startTime,
      endTime,
      isDayOff,
      breakStart: normalizedBreakStart,
      breakEnd: normalizedBreakEnd,
    },
  });

  return NextResponse.json({ message: "Schedule updated", hour });
}