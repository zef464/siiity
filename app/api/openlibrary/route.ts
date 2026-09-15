import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title");

  if (!title) {
    return NextResponse.json({ error: "Title required" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&limit=1`
    );

    const data = await res.json();

    if (!data.docs || data.docs.length === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const book = data.docs[0];

    // Вытаскиваем обложку, если есть cover_i
    // Формат URL обложек Open Library: https://covers.openlibrary.org/b/id/{cover_i}-L.jpg
    const coverUrl = book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
      : null;

    // В Search API аннотация обычно лежит в first_sentence или description
    const plot = Array.isArray(book.first_sentence)
      ? book.first_sentence[0]
      : book.first_sentence || null;

    return NextResponse.json({
      title: book.title,
      type: "book",
      coverUrl,
      plot,
      author: book.author_name ? book.author_name[0] : null,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch book data" }, { status: 500 });
  }
}