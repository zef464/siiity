import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title");

  if (!title) {
    return NextResponse.json({ error: "Title required" }, { status: 400 });
  }

  const apiKey = process.env.OMDB_API_KEY;
  const res = await fetch(
    `https://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(title)}`
  );

  const data = await res.json();
  return NextResponse.json(data);
}