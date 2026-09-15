import { auth } from "@/app/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

// Method GET api/items
export async function GET() {
  const items = await prisma.item.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(items);
}

// Method POST api/items
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const item = await prisma.item.create({

    data: {
      title: body.title,
      type: body.type,
      coverUrl: body.coverUrl,
      plot: body.plot,
      userId: session.user.id,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
