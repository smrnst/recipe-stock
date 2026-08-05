import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/recipes?ingredient=卵&category=おつまみ
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ingredient = searchParams.get("ingredient");
  const category = searchParams.get("category");

  const recipes = await prisma.recipe.findMany({
    where: {
      ...(category ? { category } : {}),
      ...(ingredient
        ? { ingredients: { some: { name: { contains: ingredient } } } }
        : {}),
    },
    include: { ingredients: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ recipes });
}

// POST /api/recipes
// body: { title, url, content, category, ingredients: string[] }
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, url, content, category, ingredients } = body;

  if (!title || !category) {
    return NextResponse.json(
      { error: "title, category は必須です" },
      { status: 400 }
    );
  }

  const recipe = await prisma.recipe.create({
    data: {
      title,
      url: url ?? "",
      content: content ?? "",
      category,
      ingredients: {
        create: (ingredients ?? []).map((name: string) => ({ name })),
      },
    },
    include: { ingredients: true },
  });

  return NextResponse.json({ recipe }, { status: 201 });
}