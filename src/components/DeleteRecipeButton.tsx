"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteRecipeButton({ id }: { id: number }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("このレシピを削除しますか?")) return;

    setDeleting(true);
    const res = await fetch(`/api/recipes/${id}`, { method: "DELETE" });
    setDeleting(false);

    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      alert("削除に失敗しました");
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="inline-flex items-center font-body text-sm text-danger bg-danger-light border border-danger/30 px-3 py-1.5 rounded-sm hover:bg-danger hover:text-paper transition-colors disabled:opacity-50"
    >
      {deleting ? "削除中..." : "削除する"}
    </button>
  );
}
