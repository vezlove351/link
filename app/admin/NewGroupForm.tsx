"use client";

import { useState, useTransition } from "react";
import { createGroup } from "./actions";
import { SLUG_REGEX } from "@/lib/reserved-slugs";

export default function NewGroupForm() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const trimmedSlug = slug.trim().toLowerCase();
  const isSlugFormatValid = trimmedSlug.length > 0 && SLUG_REGEX.test(trimmedSlug);

  return (
    <form
      className="mb-6 flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        if (!title.trim() || !isSlugFormatValid) return;
        setError(null);
        const formData = new FormData();
        formData.set("title", title);
        formData.set("slug", trimmedSlug);
        startTransition(async () => {
          const result = await createGroup(formData);
          if ("error" in result) {
            setError(result.error);
          } else {
            setTitle("");
            setSlug("");
          }
        });
      }}
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Group title"
          className="flex-1 rounded-lg border border-neutral-200 px-3 py-2.5 text-base focus:border-neutral-500 focus:outline-none"
        />
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="slug-for-url"
          className="flex-1 rounded-lg border border-neutral-200 px-3 py-2.5 text-base focus:border-neutral-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!title.trim() || !isSlugFormatValid || isPending}
          className="rounded-lg bg-neutral-900 px-4 py-2.5 text-base font-medium text-white hover:bg-neutral-700 disabled:opacity-40"
        >
          Add Group
        </button>
      </div>

      {slug.length > 0 && !isSlugFormatValid && (
        <p className="text-sm text-red-600">
          Slug must be lowercase letters, numbers, and hyphens only.
        </p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
