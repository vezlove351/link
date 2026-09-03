"use client";

import { useRef, useState, useTransition } from "react";
import { createButton } from "./actions";

export default function NewButtonForm() {
  const [title, setTitle] = useState("");
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      className="mb-6 flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!title.trim()) return;
        const formData = new FormData();
        formData.set("title", title);
        startTransition(async () => {
          await createButton(formData);
          setTitle("");
        });
      }}
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New button title"
        className="flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-base focus:border-neutral-500 focus:outline-none"
      />
      <button
        type="submit"
        disabled={!title.trim() || isPending}
        className="rounded-lg bg-neutral-900 px-4 py-2.5 text-base font-medium text-white hover:bg-neutral-700 disabled:opacity-40"
      >
        Add Button
      </button>
    </form>
  );
}
