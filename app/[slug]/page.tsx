import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import GroupLinkList from "@/components/GroupLinkList";

export const dynamic = "force-dynamic";

export default async function GroupPage({ params }: { params: { slug: string } }) {
  const { data: group, error: groupError } = await supabase
    .from("groups")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (groupError || !group) {
    notFound();
  }

  const { data: links } = await supabase
    .from("group_links")
    .select("*")
    .eq("group_id", group.id)
    .order("position", { ascending: true });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center px-4 py-10">
      <div className="mb-8 flex flex-col items-center gap-2">
        {group.icon_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={group.icon_url}
            alt=""
            className="h-20 w-20 rounded-full object-cover"
          />
        )}
        {!group.icon_url && <div className="h-20 w-20 rounded-full bg-neutral-300" />}
        <h1 className="text-xl font-semibold">{group.title}</h1>
      </div>

      <GroupLinkList links={links ?? []} />
    </main>
  );
}
