import { supabase } from "@/lib/supabase";
import type { ButtonWithLinks } from "@/lib/types";
import AdminButtonCard from "./AdminButtonCard";
import NewButtonForm from "./NewButtonForm";

export const dynamic = "force-dynamic";

async function getButtonsWithLinks(): Promise<ButtonWithLinks[]> {
  const { data: buttons, error: buttonsError } = await supabase
    .from("buttons")
    .select("*")
    .order("position", { ascending: true });

  if (buttonsError || !buttons) return [];

  const { data: links } = await supabase
    .from("links")
    .select("*")
    .order("position", { ascending: true });

  return buttons.map((button) => ({
    ...button,
    links: (links ?? []).filter((link) => link.button_id === button.id),
  }));
}

export default async function AdminPage() {
  const buttons = await getButtonsWithLinks();

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

      <NewButtonForm />

      <div className="flex flex-col gap-4">
        {buttons.length === 0 && <p className="text-neutral-400">No buttons yet</p>}
        {buttons.map((button, idx) => (
          <AdminButtonCard
            key={button.id}
            button={button}
            isFirst={idx === 0}
            isLast={idx === buttons.length - 1}
          />
        ))}
      </div>
    </main>
  );
}
