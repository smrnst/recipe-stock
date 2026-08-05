import { prisma } from "@/lib/prisma";
import { DEFAULT_CATEGORIES } from "@/lib/categories";
import { CategoryMenu } from "./CategoryMenu";
import { LogoutButton } from "./LogoutButton";
import Link from "next/link";

export async function Header() {
  const dbCategories = await prisma.recipe.findMany({
    distinct: ["category"],
    select: { category: true },
  });

  const categories = Array.from(
    new Set([...DEFAULT_CATEGORIES, ...dbCategories.map((c) => c.category)]),
  );

  return (
    <header className="bg-ink text-paper">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CategoryMenu categories={categories} />
          <Link href="/" className="font-display text-xl tracking-tight">
            おいしかったレシピ帳
          </Link>
        </div>
        <Link
          href="/recipes/new"
          className="text-xs font-mono bg-paper text-ink px-3 py-2 rounded-sm hover:brightness-95 transition"
        >
          + 追加する
        </Link>
        <LogoutButton />
      </div>
    </header>
  );
}
