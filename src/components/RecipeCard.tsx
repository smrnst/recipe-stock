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
    <Link
      href={`/recipes/${recipe.id}`}
      className="recipe-card block p-5 pt-6 hover:shadow-md hover:border-herb transition-shadow"
    >
      <span className="tab-link inline-block text-herb bg-herb-light px-2 py-0.5 rounded-sm mb-2">
        {recipe.category}
      </span>
      <h3 className="font-display text-lg font-semibold text-ink">
        {recipe.title}
      </h3>
      <p className="text-sm text-ink-soft mt-2 font-mono">
        {recipe.ingredients.map((i) => i.name).join(" · ")}
      </p>
    </Link>
  );
}