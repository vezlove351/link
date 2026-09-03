import { supabase } from "@/lib/supabase";
import type { ButtonWithLinks } from "@/lib/types";
import LinkButton from "@/components/LinkButton";

export const dynamic = "force-dynamic";

async function getButtonsWithLinks(): Promise<ButtonWithLinks[]> {
  const { data: buttons, error: buttonsError } = await supabase
    .from("buttons")
    .select("*")
    .order("position", { ascending: true });

  if (buttonsError || !buttons) {
    console.error("Failed to load buttons", buttonsError);
    return [];
  }

  const { data: links, error: linksError } = await supabase
    .from("links")
    .select("*")
    .order("position", { ascending: true });

  if (linksError) {
    console.error("Failed to load links", linksError);
  }

  return buttons.map((button) => ({
    ...button,
    links: (links ?? []).filter((link) => link.button_id === button.id),
  }));
}

export default async function HomePage() {
  const buttons = await getButtonsWithLinks();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center px-4 py-10">
      <div className="mb-8 flex flex-col items-center gap-2">
        <div className="h-20 w-20 rounded-full bg-neutral-300" />
        <h1 className="text-xl font-semibold">My Links</h1>
      </div>

      <div className="flex w-full flex-col gap-3">
        {buttons.length === 0 && (
          <p className="text-center text-neutral-400">No links yet</p>
        )}
        {buttons.map((button) => (
          <LinkButton key={button.id} button={button} />
        ))}
      </div>
    </main>
  );
}
