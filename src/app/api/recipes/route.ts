import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scrapeRecipeContent } from "@/lib/scrape";

// GET は変更なし(省略)

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, url, category, ingredients } = body;

  if (!title || !category) {
    return NextResponse.json(
      { error: "title, category は必須です" },
      { status: 400 }
    );
  }

  const content = url ? await scrapeRecipeContent(url) : "";

  const recipe = await prisma.recipe.create({
    data: {
      title,
      url: url ?? "",
      content,
      category,
      ingredients: {
        create: (ingredients ?? []).map((name: string) => ({ name })),
      },
    },
    include: { ingredients: true },
  });

  return NextResponse.json({ recipe }, { status: 201 });
}
