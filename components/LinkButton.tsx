"use client";

import { useState } from "react";
import type { ButtonWithLinks } from "@/lib/types";

export default function LinkButton({ button }: { button: ButtonWithLinks }) {
  const [open, setOpen] = useState(false);
  const links = button.links;

  if (links.length === 0) {
    return (
      <div className="flex w-full items-center gap-3 rounded-2xl bg-white/60 px-5 py-4 text-neutral-400 shadow-sm">
        {button.icon_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={button.icon_url} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" />
        )}
        <span className="text-base font-medium">{button.title}</span>
      </div>
    );
  }

  if (links.length === 1) {
    const only = links[0];
    return (
      <a
        href={only.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-sm transition active:scale-[0.98] active:bg-neutral-50"
      >
        {button.icon_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={button.icon_url} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" />
        )}
        <span className="text-base font-medium">{button.title}</span>
      </a>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition active:bg-neutral-50"
      >
        {button.icon_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={button.icon_url} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" />
        )}
        <span className="flex-1 text-base font-medium">{button.title}</span>
        <svg
          className={`h-5 w-5 shrink-0 text-neutral-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className={`grid transition-all duration-200 ease-in-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-1 border-t border-neutral-100 px-3 py-2">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl px-3 py-3 text-base text-neutral-700 transition active:bg-neutral-100"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
