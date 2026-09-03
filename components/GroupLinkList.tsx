import type { GroupLink } from "@/lib/types";

export default function GroupLinkList({ links }: { links: GroupLink[] }) {
  if (links.length === 0) {
    return <p className="text-center text-neutral-400">No links yet</p>;
  }

  return (
    <div className="flex w-full flex-col gap-3">
      {links.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center rounded-2xl bg-white px-5 py-4 text-base font-medium shadow-sm transition active:scale-[0.98] active:bg-neutral-50"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
