import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { DeleteRecipeButton } from "@/components/DeleteRecipeButton";

type Params = { params: Promise<{ id: string }> };

export default async function RecipeDetailPage({ params }: Params) {
  const { id } = await params;

  const recipe = await prisma.recipe.findUnique({
    where: { id: Number(id) },
    include: { ingredients: true },
  });

  if (!recipe) return notFound();

  return (
    <article>
      <div className="flex items-center justify-between">
        <span className="tab-link inline-block text-herb bg-herb-light px-2 py-0.5 rounded-sm">
          {recipe.category}
        </span>
        <div className="flex gap-2">
          <Link
            href={`/recipes/${recipe.id}/edit`}
            className="text-sm text-paper bg-ink px-3 py-1.5 rounded-sm hover:brightness-110"
          >
            編集する
          </Link>
          <DeleteRecipeButton id={recipe.id} />
        </div>
      </div>

      <h1 className="font-display text-3xl font-semibold text-ink mt-2">
        {recipe.title}
      </h1>
      {recipe.url && (
        <Link
          href={recipe.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 text-sm underline block mt-2"
        >
          {recipe.url}
        </Link>
      )}

      <h2 className="font-semibold mt-6 mb-2">材料</h2>
      <ul className="list-disc list-inside text-sm">
        {recipe.ingredients.map((i) => (
          <li key={i.id}>{i.name}</li>
        ))}
      </ul>

      <h2 className="font-semibold mt-6 mb-2">メモ・作り方</h2>
      <p className="whitespace-pre-wrap text-sm">{recipe.content}</p>
    </article>
  );
}
