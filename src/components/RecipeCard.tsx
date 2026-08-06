import Link from "next/link";

type Recipe = {
  id: number;
  title: string;
  url: string;
  category: string;
  ingredients: { id: number; name: string }[];
};

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <div className="recipe-card block p-5 pt-6">
      <Link
        href={`/category/${encodeURIComponent(recipe.category)}`}
        className="tab-link inline-block text-herb bg-herb-light px-2 py-0.5 rounded-sm mb-2 hover:underline"
      >
        {recipe.category}
      </Link>

      <h3 className="font-display text-lg font-semibold text-ink">
        <Link href={`/recipes/${recipe.id}`} className="hover:underline">
          {recipe.title}
        </Link>
      </h3>

      <p className="text-sm text-ink-soft mt-2 font-mono">
        {recipe.ingredients.map((ingredient, i) => (
          <span key={ingredient.id}>
            <Link
              href={`/?ingredient=${encodeURIComponent(ingredient.name)}`}
              className="hover:underline"
            >
              {ingredient.name}
            </Link>
            {i < recipe.ingredients.length - 1 && " · "}
          </span>
        ))}
      </p>
    </div>
  );
}
