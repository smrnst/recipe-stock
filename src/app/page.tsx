import { prisma } from "@/lib/prisma";
import { RecipeCard } from "@/components/RecipeCard";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ ingredient?: string }>;
}) {
  const { ingredient } = await searchParams;

  const recipes = await prisma.recipe.findMany({
    where: ingredient
      ? { ingredients: { some: { name: { contains: ingredient } } } }
      : {},
    include: { ingredients: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <form className="mb-8">
        <label className="tab-link text-ink-soft block mb-2">食材で検索</label>
        <input
          type="text"
          name="ingredient"
          defaultValue={ingredient ?? ""}
          placeholder="例: 卵"
          className="border border-line bg-card rounded-sm px-4 py-2.5 w-full max-w-sm font-body focus:outline-none focus:ring-2 focus:ring-herb"
        />
      </form>

      <div className="grid gap-4 sm:grid-cols-2">
        {recipes.map((r) => (
          <RecipeCard key={r.id} recipe={r} />
        ))}
      </div>

      {recipes.length === 0 && (
        <p className="text-gray-500">レシピがまだ登録されていません。</p>
      )}
    </div>
  );
}
