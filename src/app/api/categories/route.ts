import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_CATEGORIES } from "@/lib/categories";

export async function GET() {
  const dbCategories = await prisma.recipe.findMany({
    distinct: ["category"],
    select: { category: true },
  });

  const merged = Array.from(
    new Set([...DEFAULT_CATEGORIES, ...dbCategories.map((c) => c.category)])
  );

  return NextResponse.json({ categories: merged });
}