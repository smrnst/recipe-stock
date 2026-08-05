"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

type Recipe = {
  id: number;
  title: string;
  url: string;
  content: string;
  category: string;
  ingredients: { id: number; name: string }[];
};

export default function EditRecipePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");
  const [ingredientsText, setIngredientsText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/recipes/${id}`).then((res) => res.json()),
      fetch("/api/categories").then((res) => res.json()),
    ]).then(([recipeData, categoryData]) => {
      const recipe: Recipe = recipeData.recipe;
      setTitle(recipe.title);
      setUrl(recipe.url);
      setContent(recipe.content);
      setCategory(recipe.category);
      setIngredientsText(recipe.ingredients.map((i) => i.name).join(", "));
      setCategories(categoryData.categories);
      setLoading(false);
    });
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const finalCategory = category === "__new__" ? customCategory : category;
    const ingredients = ingredientsText
      .split(/[,、\n]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const res = await fetch(`/api/recipes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        url,
        content,
        category: finalCategory,
        ingredients,
      }),
    });

    setSubmitting(false);

    if (res.ok) {
      router.push(`/recipes/${id}`);
    } else {
      alert("更新に失敗しました");
    }
  }

  if (loading) return <p className="text-ink-soft">読み込み中...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <h1 className="font-display text-xl font-semibold">レシピを編集</h1>

      <div>
        <label className="tab-link text-ink-soft block mb-1">タイトル</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-line bg-card rounded-sm px-3 py-2 w-full"
        />
      </div>

      <div>
        <label className="tab-link text-ink-soft block mb-1">レシピURL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border border-line bg-card rounded-sm px-3 py-2 w-full"
        />
      </div>

      <div>
        <label className="tab-link text-ink-soft block mb-1">カテゴリ</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-line bg-card rounded-sm px-3 py-2 w-full"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
          <option value="__new__">その他(新規入力)</option>
        </select>
        {category === "__new__" && (
          <input
            placeholder="新しいカテゴリ名"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            className="border border-line bg-card rounded-sm px-3 py-2 w-full mt-2"
          />
        )}
      </div>

      <div>
        <label className="tab-link text-ink-soft block mb-1">
          食材(カンマ・読点・改行区切り)
        </label>
        <textarea
          value={ingredientsText}
          onChange={(e) => setIngredientsText(e.target.value)}
          className="border border-line bg-card rounded-sm px-3 py-2 w-full h-20"
        />
      </div>

      <div>
        <label className="tab-link text-ink-soft block mb-1">
          メモ・作り方
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border border-line bg-card rounded-sm px-3 py-2 w-full h-40"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="bg-ink text-paper px-4 py-2 rounded-sm disabled:opacity-50"
        >
          {submitting ? "更新中..." : "更新する"}
        </button>
      </div>
    </form>
  );
}
