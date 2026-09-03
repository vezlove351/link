"use client";

import { useState, useTransition } from "react";
import type { ButtonWithLinks } from "@/lib/types";
import {
  addLink,
  deleteButton,
  deleteLink,
  moveButton,
  moveLink,
  renameButton,
  updateButtonIcon,
  updateLink,
} from "./actions";

export default function AdminButtonCard({
  button,
  isFirst,
  isLast,
}: {
  button: ButtonWithLinks;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(button.title);
  const [iconUrl, setIconUrl] = useState(button.icon_url ?? "");
  const [newLabel, setNewLabel] = useState("");
  const [newUrl, setNewUrl] = useState("");

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex flex-col">
          <button
            type="button"
            disabled={isFirst || isPending}
            onClick={() => startTransition(() => moveButton(button.id, "up"))}
            className="rounded px-1 text-neutral-400 hover:text-neutral-900 disabled:opacity-20"
            aria-label="Переместить вверх"
          >
            ▲
          </button>
          <button
            type="button"
            disabled={isLast || isPending}
            onClick={() => startTransition(() => moveButton(button.id, "down"))}
            className="rounded px-1 text-neutral-400 hover:text-neutral-900 disabled:opacity-20"
            aria-label="Переместить вниз"
          >
            ▼
          </button>
        </div>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => {
            if (title.trim() && title !== button.title) {
              startTransition(() => renameButton(button.id, title));
            }
          }}
          className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-base font-medium focus:border-neutral-500 focus:outline-none"
        />

        <button
          type="button"
          onClick={() => {
            if (confirm(`Удалить кнопку "${button.title}" вместе со всеми ссылками?`)) {
              startTransition(() => deleteButton(button.id));
            }
          }}
          className="rounded-lg px-2 py-2 text-sm text-red-500 hover:bg-red-50"
        >
          Удалить
        </button>
      </div>

      <input
        value={iconUrl}
        onChange={(e) => setIconUrl(e.target.value)}
        onBlur={() => {
          if (iconUrl !== (button.icon_url ?? "")) {
            startTransition(() => updateButtonIcon(button.id, iconUrl));
          }
        }}
        placeholder="URL иконки (необязательно)"
        className="mb-3 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-600 focus:border-neutral-500 focus:outline-none"
      />

      <div className="flex flex-col gap-2 border-t border-neutral-100 pt-3">
        {button.links.map((link, idx) => (
          <LinkRow
            key={link.id}
            linkId={link.id}
            buttonId={button.id}
            initialLabel={link.label}
            initialUrl={link.url}
            isFirst={idx === 0}
            isLast={idx === button.links.length - 1}
          />
        ))}

        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Название ссылки"
            className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          />
          <input
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://..."
            className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          />
          <button
            type="button"
            disabled={!newLabel.trim() || !newUrl.trim() || isPending}
            onClick={() => {
              startTransition(async () => {
                await addLink(button.id, newLabel, newUrl);
                setNewLabel("");
                setNewUrl("");
              });
            }}
            className="rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-40"
          >
            Добавить ссылку
          </button>
        </div>
      </div>
    </div>
  );
}

function LinkRow({
  linkId,
  buttonId,
  initialLabel,
  initialUrl,
  isFirst,
  isLast,
}: {
  linkId: string;
  buttonId: string;
  initialLabel: string;
  initialUrl: string;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [label, setLabel] = useState(initialLabel);
  const [url, setUrl] = useState(initialUrl);

  function commitIfChanged() {
    if (label.trim() && url.trim() && (label !== initialLabel || url !== initialUrl)) {
      startTransition(() => updateLink(linkId, label, url));
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-neutral-50 p-2 sm:flex-row sm:items-center">
      <div className="flex flex-col">
        <button
          type="button"
          disabled={isFirst || isPending}
          onClick={() => startTransition(() => moveLink(linkId, buttonId, "up"))}
          className="px-1 text-xs text-neutral-400 hover:text-neutral-900 disabled:opacity-20"
          aria-label="Переместить вверх"
        >
          ▲
        </button>
        <button
          type="button"
          disabled={isLast || isPending}
          onClick={() => startTransition(() => moveLink(linkId, buttonId, "down"))}
          className="px-1 text-xs text-neutral-400 hover:text-neutral-900 disabled:opacity-20"
          aria-label="Переместить вниз"
        >
          ▼
        </button>
      </div>

      <input
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        onBlur={commitIfChanged}
        placeholder="Название"
        className="flex-1 rounded-md border border-neutral-200 px-2 py-1.5 text-sm focus:border-neutral-500 focus:outline-none"
      />
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onBlur={commitIfChanged}
        placeholder="https://..."
        className="flex-[2] rounded-md border border-neutral-200 px-2 py-1.5 text-sm focus:border-neutral-500 focus:outline-none"
      />
      <button
        type="button"
        onClick={() => startTransition(() => deleteLink(linkId))}
        className="rounded-md px-2 py-1.5 text-sm text-red-500 hover:bg-red-50"
      >
        Удалить
      </button>
    </div>
  );
}
