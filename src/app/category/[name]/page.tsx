import { prisma } from "@/lib/prisma";
import { RecipeCard } from "@/components/RecipeCard";

type Params = { params: Promise<{ name: string }> };

export default async function CategoryPage({ params }: Params) {
  const { name } = await params;
  const category = decodeURIComponent(name);

  const recipes = await prisma.recipe.findMany({
    where: { category },
    include: { ingredients: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">{category}</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {recipes.map((r) => (
          <RecipeCard key={r.id} recipe={r} />
        ))}
      </div>
      {recipes.length === 0 && (
        <p className="text-gray-500">このカテゴリのレシピはまだありません。</p>
      )}
    </div>
  );
}