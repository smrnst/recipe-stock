"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewRecipePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [ingredientsText, setIngredientsText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories);
        if (data.categories.length > 0) setCategory(data.categories[0]);
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const finalCategory = category === "__new__" ? customCategory : category;
    const ingredients = ingredientsText
      .split(/[,、\n]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const res = await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        url,
        category: finalCategory,
        ingredients,
      }),
    });

    setSubmitting(false);

    if (res.ok) {
      const data = await res.json();
      router.push(`/recipes/${data.recipe.id}`);
    } else {
      alert("登録に失敗しました");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <h1 className="font-display text-xl font-semibold">レシピを登録</h1>

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
          placeholder="卵, 砂糖, 醤油"
          className="border border-line bg-card rounded-sm px-3 py-2 w-full h-20"
        />
      </div>

      <p className="text-sm text-ink-soft bg-herb-light rounded-sm p-3">
        登録時にURLから自動で手順を取得します。取得できなかった場合は空欄になります(後から編集できます)。
      </p>

      <button
        type="submit"
        disabled={submitting}
        className="bg-ink text-paper px-4 py-2 rounded-sm disabled:opacity-50"
      >
        {submitting ? "登録中..." : "登録する"}
      </button>
    </form>
  );
}
