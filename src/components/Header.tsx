import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DEFAULT_CATEGORIES } from "@/lib/categories";

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
        <Link href="/" className="font-display text-xl tracking-tight">
          おいしかったレシピ帳
        </Link>
        <Link
          href="/recipes/new"
          className="text-xs font-mono bg-mustard text-ink px-3 py-2 rounded-sm hover:brightness-95 transition"
        >
          + 追加する
        </Link>
      </div>

      <nav className="max-w-4xl mx-auto px-4 flex flex-wrap items-end gap-1">
        {categories.map((c) => (
          <Link
            key={c}
            href={`/category/${encodeURIComponent(c)}`}
            className="tab-link bg-herb-light text-herb px-3 py-2 rounded-t-md border border-b-0 border-line hover:bg-white transition-colors"
          >
            {c}
          </Link>
        ))}
      </nav>
    </header>
  );
}
