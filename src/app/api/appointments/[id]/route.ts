import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { RouteParams } from "@/types";

export async function PATCH(req: Request, { params }: RouteParams) {
  const id = Number(params.id);
  const body = await req.json();
  const { status, date, startTime, endTime } = body;

  const dataToUpdate: any = {};

  if (status) dataToUpdate.status = status;
  if (date) dataToUpdate.date = new Date(date);
  if (startTime) dataToUpdate.startTime = startTime;
  if (endTime) dataToUpdate.endTime = endTime;

  if (date && startTime) {
    const appointment = await prisma.appointment.findUnique({ where: { id } });

    if (!appointment) {
      return NextResponse.json({ message: "Appointment not found" }, { status: 404 });
    }

    const conflict = await prisma.appointment.findFirst({
      where: {
        providerId: appointment.providerId,
        date: new Date(date),
        startTime,
        status: { not: "cancelled" },
        NOT: { id },
      },
    });

    if (conflict) {
      return NextResponse.json(
        { message: "This time slot is already booked" },
        { status: 400 }
      );
    }
  }

  const updated = await prisma.appointment.update({
    where: { id },
    data: dataToUpdate,
  });

  return NextResponse.json({ message: "Appointment updated", appointment: updated });
}