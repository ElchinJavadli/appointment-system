import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function minutesToTime(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function timeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const providerId = Number(searchParams.get("providerId"));
  const serviceId = Number(searchParams.get("serviceId"));
  const date = searchParams.get("date");

  if (!providerId || !serviceId || !date) {
    return NextResponse.json({ message: "Missing parameters" }, { status: 400 });
  }

  const dayOfWeek = new Date(date).getDay();

  const workingHour = await prisma.workingHour.findFirst({
    where: { providerId, dayOfWeek },
  });

  if (!workingHour || workingHour.isDayOff) {
    return NextResponse.json({ slots: [] });
  }

  const service = await prisma.service.findUnique({ where: { id: serviceId } });

  if (!service) {
    return NextResponse.json({ message: "Service not found" }, { status: 404 });
  }

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const existingAppointments = await prisma.appointment.findMany({
    where: {
      providerId,
      date: { gte: startOfDay, lte: endOfDay },
      status: { not: "cancelled" },
    },
  });

  const [startHour, startMin] = workingHour.startTime.split(":").map(Number);
  const [endHour, endMin] = workingHour.endTime.split(":").map(Number);

  let currentMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  const hasBreak = Boolean(workingHour.breakStart && workingHour.breakEnd);
  const breakStartMinutes = hasBreak ? timeToMinutes(workingHour.breakStart as string) : null;
  const breakEndMinutes = hasBreak ? timeToMinutes(workingHour.breakEnd as string) : null;

  const slots: any[] = [];

  while (currentMinutes + service.duration <= endMinutes) {
    const slotEndMinutes = currentMinutes + service.duration;

    const overlapsBreak =
      hasBreak &&
      breakStartMinutes !== null &&
      breakEndMinutes !== null &&
      currentMinutes < breakEndMinutes &&
      slotEndMinutes > breakStartMinutes;

    if (overlapsBreak && breakEndMinutes !== null) {
      currentMinutes = breakEndMinutes;
      continue;
    }

    const slotStart = minutesToTime(currentMinutes);
    const slotEnd = minutesToTime(slotEndMinutes);

    const isTaken = existingAppointments.some((a: any) => a.startTime === slotStart);

    if (!isTaken) {
      slots.push({ start: slotStart, end: slotEnd });
    }

    currentMinutes += service.duration;
  }

  return NextResponse.json({ slots });
}