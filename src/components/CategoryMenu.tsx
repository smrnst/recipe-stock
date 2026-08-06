"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function CategoryMenu({ categories }: { categories: string[] }) {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="メニューを開く"
        aria-expanded={open}
        className="flex flex-col gap-1.5 p-2 -ml-2"
      >
        <span className="block w-5 h-0.5 bg-paper" />
        <span className="block w-5 h-0.5 bg-paper" />
        <span className="block w-5 h-0.5 bg-paper" />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-56 bg-card border border-line rounded-md shadow-lg py-2 z-10">
          {categories.map((c) => (
            <Link
              key={c}
              href={`/category/${encodeURIComponent(c)}`}
              onClick={() => setOpen(false)}
              className="tab-link block text-herb px-4 py-2 hover:bg-herb-light"
            >
              {c}
            </Link>
          ))}

          <div className="border-t border-line mt-2 pt-2">
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="tab-link block w-full text-left text-ink-soft px-4 py-2 hover:bg-herb-light disabled:opacity-50"
            >
              {loggingOut ? "ログアウト中..." : "ログアウト"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
