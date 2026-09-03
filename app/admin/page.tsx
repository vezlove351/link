import { supabase } from "@/lib/supabase";
import type { GroupWithLinks } from "@/lib/types";
import AdminGroupCard from "./AdminGroupCard";
import NewGroupForm from "./NewGroupForm";

export const dynamic = "force-dynamic";

async function getGroupsWithLinks(): Promise<GroupWithLinks[]> {
  const { data: groups, error: groupsError } = await supabase
    .from("groups")
    .select("*")
    .order("position", { ascending: true });

  if (groupsError || !groups) return [];

  const { data: links } = await supabase
    .from("group_links")
    .select("*")
    .order("position", { ascending: true });

  return groups.map((group) => ({
    ...group,
    links: (links ?? []).filter((link) => link.group_id === group.id),
  }));
}

export default async function AdminPage() {
  const groups = await getGroupsWithLinks();

  return (
    <main className="mx-auto min-h-screen w-full max-w-2xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Admin</h1>
        <form action="/api/admin/logout" method="POST">
          <button type="submit" className="text-sm text-neutral-500 hover:text-neutral-900">
            Log Out
          </button>
        </form>
      </div>

      <NewGroupForm />

      <div className="flex flex-col gap-4">
        {groups.length === 0 && <p className="text-neutral-400">No groups yet</p>}
        {groups.map((group, idx) => (
          <AdminGroupCard
            key={group.id}
            group={group}
            isFirst={idx === 0}
            isLast={idx === groups.length - 1}
          />
        ))}
      </div>
    </main>
  );
}
