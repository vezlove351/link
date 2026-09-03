"use client";

import { useState, useTransition } from "react";
import type { GroupWithLinks } from "@/lib/types";
import {
  addGroupLink,
  deleteGroup,
  deleteGroupLink,
  moveGroup,
  moveGroupLink,
  renameGroup,
  updateGroupIcon,
  updateGroupLink,
} from "./actions";

export default function AdminGroupCard({
  group,
  isFirst,
  isLast,
}: {
  group: GroupWithLinks;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(group.title);
  const [iconUrl, setIconUrl] = useState(group.icon_url ?? "");
  const [newLabel, setNewLabel] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [copied, setCopied] = useState(false);

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="mb-1 flex items-center gap-2">
        <div className="flex flex-col">
          <button
            type="button"
            disabled={isFirst || isPending}
            onClick={() => startTransition(() => moveGroup(group.id, "up"))}
            className="rounded px-1 text-neutral-400 hover:text-neutral-900 disabled:opacity-20"
            aria-label="Move up"
          >
            ▲
          </button>
          <button
            type="button"
            disabled={isLast || isPending}
            onClick={() => startTransition(() => moveGroup(group.id, "down"))}
            className="rounded px-1 text-neutral-400 hover:text-neutral-900 disabled:opacity-20"
            aria-label="Move down"
          >
            ▼
          </button>
        </div>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => {
            if (title.trim() && title !== group.title) {
              startTransition(() => renameGroup(group.id, group.slug, title));
            }
          }}
          className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-base font-medium focus:border-neutral-500 focus:outline-none"
        />

        <button
          type="button"
          onClick={() => {
            if (confirm(`Delete group "${group.title}" along with all its links?`)) {
              startTransition(() => deleteGroup(group.id, group.slug));
            }
          }}
          className="rounded-lg px-2 py-2 text-sm text-red-500 hover:bg-red-50"
        >
          Delete
        </button>
      </div>

      <div className="mb-3 flex items-center gap-2 pl-7 text-sm text-neutral-500">
        <a
          href={`/${group.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-neutral-900 hover:underline"
        >
          /{group.slug}
        </a>
        <button
          type="button"
          onClick={() => {
            const url = `${window.location.origin}/${group.slug}`;
            navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="text-neutral-400 hover:text-neutral-900"
        >
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>

      <input
        value={iconUrl}
        onChange={(e) => setIconUrl(e.target.value)}
        onBlur={() => {
          if (iconUrl !== (group.icon_url ?? "")) {
            startTransition(() => updateGroupIcon(group.id, group.slug, iconUrl));
          }
        }}
        placeholder="Icon URL (optional)"
        className="mb-3 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-600 focus:border-neutral-500 focus:outline-none"
      />

      <div className="flex flex-col gap-2 border-t border-neutral-100 pt-3">
        {group.links.map((link, idx) => (
          <LinkRow
            key={link.id}
            linkId={link.id}
            groupId={group.id}
            slug={group.slug}
            initialLabel={link.label}
            initialUrl={link.url}
            isFirst={idx === 0}
            isLast={idx === group.links.length - 1}
          />
        ))}

        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Link label"
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
                await addGroupLink(group.id, group.slug, newLabel, newUrl);
                setNewLabel("");
                setNewUrl("");
              });
            }}
            className="rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-40"
          >
            Add Link
          </button>
        </div>
      </div>
    </div>
  );
}

function LinkRow({
  linkId,
  groupId,
  slug,
  initialLabel,
  initialUrl,
  isFirst,
  isLast,
}: {
  linkId: string;
  groupId: string;
  slug: string;
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
      startTransition(() => updateGroupLink(linkId, slug, label, url));
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-neutral-50 p-2 sm:flex-row sm:items-center">
      <div className="flex flex-col">
        <button
          type="button"
          disabled={isFirst || isPending}
          onClick={() => startTransition(() => moveGroupLink(linkId, groupId, slug, "up"))}
          className="px-1 text-xs text-neutral-400 hover:text-neutral-900 disabled:opacity-20"
          aria-label="Move up"
        >
          ▲
        </button>
        <button
          type="button"
          disabled={isLast || isPending}
          onClick={() => startTransition(() => moveGroupLink(linkId, groupId, slug, "down"))}
          className="px-1 text-xs text-neutral-400 hover:text-neutral-900 disabled:opacity-20"
          aria-label="Move down"
        >
          ▼
        </button>
      </div>

      <input
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        onBlur={commitIfChanged}
        placeholder="Label"
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
        onClick={() => startTransition(() => deleteGroupLink(linkId, slug))}
        className="rounded-md px-2 py-1.5 text-sm text-red-500 hover:bg-red-50"
      >
        Delete
      </button>
    </div>
  );
}
