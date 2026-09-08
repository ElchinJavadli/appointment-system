import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { RouteParams } from "@/types";

export async function PATCH(req: Request, { params }: RouteParams) {
  const id = Number(params.id);
  const body = await req.json();
  const { name, price, duration, description } = body;

  const priceNumber = Number(price);
  const durationNumber = Number(duration);

  if (!name || Number.isNaN(priceNumber) || Number.isNaN(durationNumber)) {
    return NextResponse.json(
      { message: "Please fill name, price and duration correctly" },
      { status: 400 }
    );
  }

  try {
    const service = await prisma.service.update({
      where: { id },
      data: {
        name,
        price: priceNumber,
        duration: durationNumber,
        description: description || null,
      },
    });

    return NextResponse.json({ message: "Service updated", service });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Something went wrong while updating the service" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  const id = Number(params.id);

  try {
    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ message: "Service deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "This service can't be deleted because it already has appointments linked to it" },
      { status: 400 }
    );
  }
}