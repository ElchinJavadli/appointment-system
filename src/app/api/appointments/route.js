import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get("clientId");
  const providerId = searchParams.get("providerId");

  const where = {};
  if (clientId) where.clientId = Number(clientId);
  if (providerId) where.providerId = Number(providerId);

  const appointments = await prisma.appointment.findMany({
    where,
    include: {
      service: true,
      client: true,
      provider: { include: { user: true } },
    },
    orderBy: { date: "asc" },
  });

  return NextResponse.json({ appointments });
}


export async function POST(req) {
  const body = await req.json();
  const { clientId, providerId, serviceId, date, startTime, endTime } = body;

  if (!clientId || !providerId || !serviceId || !date || !startTime) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  const appointmentDate = new Date(date);

  
  const conflict = await prisma.appointment.findFirst({
    where: {
      providerId: Number(providerId),
      date: appointmentDate,
      startTime,
      status: { not: "cancelled" },
    },
  });

  if (conflict) {
    return NextResponse.json(
      { message: "This time slot is already booked" },
      { status: 400 }
    );
  }

  const appointment = await prisma.appointment.create({
    data: {
      clientId: Number(clientId),
      providerId: Number(providerId),
      serviceId: Number(serviceId),
      date: appointmentDate,
      startTime,
      endTime,
      status: "pending",
    },
  });

  return NextResponse.json({ message: "Appointment booked", appointment });
}
