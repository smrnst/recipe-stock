"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export function CategoryMenu({ categories }: { categories: string[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="カテゴリ一覧を開く"
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
        </div>
      )}
    </div>
  );
}