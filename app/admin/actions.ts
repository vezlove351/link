"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase";

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function createButton(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const admin = getSupabaseAdmin();

  const { data: existing } = await admin
    .from("buttons")
    .select("position")
    .order("position", { ascending: false })
    .limit(1);

  const nextPosition = existing && existing.length > 0 ? existing[0].position + 1 : 0;

  const { error } = await admin.from("buttons").insert({ title, position: nextPosition });
  if (error) throw new Error(error.message);

  revalidateAll();
}

export async function deleteButton(buttonId: string) {
  const admin = getSupabaseAdmin();
  const { error } = await admin.from("buttons").delete().eq("id", buttonId);
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function renameButton(buttonId: string, title: string) {
  const trimmed = title.trim();
  if (!trimmed) return;
  const admin = getSupabaseAdmin();
  const { error } = await admin.from("buttons").update({ title: trimmed }).eq("id", buttonId);
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function updateButtonIcon(buttonId: string, iconUrl: string) {
  const admin = getSupabaseAdmin();
  const { error } = await admin
    .from("buttons")
    .update({ icon_url: iconUrl.trim() || null })
    .eq("id", buttonId);
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function moveButton(buttonId: string, direction: "up" | "down") {
  const admin = getSupabaseAdmin();

  const { data: buttons, error } = await admin
    .from("buttons")
    .select("id, position")
    .order("position", { ascending: true });

  if (error || !buttons) throw new Error(error?.message ?? "Failed to load buttons");

  const index = buttons.findIndex((b) => b.id === buttonId);
  if (index === -1) return;

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= buttons.length) return;

  const current = buttons[index];
  const swapWith = buttons[swapIndex];

  await Promise.all([
    admin.from("buttons").update({ position: swapWith.position }).eq("id", current.id),
    admin.from("buttons").update({ position: current.position }).eq("id", swapWith.id),
  ]);

  revalidateAll();
}

export async function addLink(buttonId: string, label: string, url: string) {
  const trimmedLabel = label.trim();
  const trimmedUrl = url.trim();
  if (!trimmedLabel || !trimmedUrl) return;

  const admin = getSupabaseAdmin();

  const { data: existing } = await admin
    .from("links")
    .select("position")
    .eq("button_id", buttonId)
    .order("position", { ascending: false })
    .limit(1);

  const nextPosition = existing && existing.length > 0 ? existing[0].position + 1 : 0;

  const { error } = await admin
    .from("links")
    .insert({ button_id: buttonId, label: trimmedLabel, url: trimmedUrl, position: nextPosition });
  if (error) throw new Error(error.message);

  revalidateAll();
}

export async function updateLink(linkId: string, label: string, url: string) {
  const trimmedLabel = label.trim();
  const trimmedUrl = url.trim();
  if (!trimmedLabel || !trimmedUrl) return;

  const admin = getSupabaseAdmin();
  const { error } = await admin
    .from("links")
    .update({ label: trimmedLabel, url: trimmedUrl })
    .eq("id", linkId);
  if (error) throw new Error(error.message);

  revalidateAll();
}

export async function deleteLink(linkId: string) {
  const admin = getSupabaseAdmin();
  const { error } = await admin.from("links").delete().eq("id", linkId);
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function moveLink(linkId: string, buttonId: string, direction: "up" | "down") {
  const admin = getSupabaseAdmin();

  const { data: links, error } = await admin
    .from("links")
    .select("id, position")
    .eq("button_id", buttonId)
    .order("position", { ascending: true });

  if (error || !links) throw new Error(error?.message ?? "Failed to load links");

  const index = links.findIndex((l) => l.id === linkId);
  if (index === -1) return;

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= links.length) return;

  const current = links[index];
  const swapWith = links[swapIndex];

  await Promise.all([
    admin.from("links").update({ position: swapWith.position }).eq("id", current.id),
    admin.from("links").update({ position: current.position }).eq("id", swapWith.id),
  ]);

  revalidateAll();
}
