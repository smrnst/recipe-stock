import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const recipe = await prisma.recipe.findUnique({
    where: { id: Number(id) },
    include: { ingredients: true },
  });

  if (!recipe) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json({ recipe });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json();
  const { title, url, content, category, ingredients } = body;

  // 食材は一旦全削除して作り直す(件数が少ないので単純な実装で十分)
  await prisma.ingredient.deleteMany({ where: { recipeId: Number(id) } });

  const recipe = await prisma.recipe.update({
    where: { id: Number(id) },
    data: {
      title,
      url,
      content,
      category,
      ingredients: {
        create: (ingredients ?? []).map((name: string) => ({ name })),
      },
    },
    include: { ingredients: true },
  });

  return NextResponse.json({ recipe });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  await prisma.recipe.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
