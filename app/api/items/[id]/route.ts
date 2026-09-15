import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// Method PATCH api/items
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const updated = await prisma.item.update({
    where: { id },
    data: {
      title: body.title,
      type: body.type,
    },
  });

  return NextResponse.json(updated);
}

// Method DELETE api/items
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const deleted = await prisma.item.delete({ where: { id } });

  return NextResponse.json(deleted, { status: 200 });
}