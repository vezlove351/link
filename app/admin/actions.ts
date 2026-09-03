"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase";
import { RESERVED_SLUGS, SLUG_REGEX } from "@/lib/reserved-slugs";

function revalidateAdmin() {
  revalidatePath("/admin");
}

function revalidateGroup(slug: string) {
  revalidatePath("/admin");
  revalidatePath(`/${slug}`);
}

export async function createGroup(
  formData: FormData
): Promise<{ ok: true } | { error: string }> {
  const title = String(formData.get("title") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim().toLowerCase();

  if (!title) {
    return { error: "Title is required." };
  }

  if (!SLUG_REGEX.test(rawSlug) || rawSlug.length > 64) {
    return { error: "Slug must be lowercase letters, numbers, and hyphens only." };
  }

  if (RESERVED_SLUGS.has(rawSlug)) {
    return { error: "That slug is reserved and can't be used." };
  }

  const admin = getSupabaseAdmin();

  const { data: existing } = await admin
    .from("groups")
    .select("*")
    .order("position", { ascending: false })
    .limit(1);

  const nextPosition = existing && existing.length > 0 ? existing[0].position + 1 : 0;

  const { error } = await admin
    .from("groups")
    .insert({ title, slug: rawSlug, position: nextPosition });

  if (error) {
    if (error.code === "23505") {
      return { error: "That slug is already taken." };
    }
    return { error: error.message };
  }

  revalidateAdmin();
  return { ok: true };
}

export async function deleteGroup(groupId: string, slug: string) {
  const admin = getSupabaseAdmin();
  const { error } = await admin.from("groups").delete().eq("id", groupId);
  if (error) throw new Error(error.message);
  revalidateGroup(slug);
}

export async function renameGroup(groupId: string, slug: string, title: string) {
  const trimmed = title.trim();
  if (!trimmed) return;
  const admin = getSupabaseAdmin();
  const { error } = await admin.from("groups").update({ title: trimmed }).eq("id", groupId);
  if (error) throw new Error(error.message);
  revalidateGroup(slug);
}

export async function updateGroupIcon(groupId: string, slug: string, iconUrl: string) {
  const admin = getSupabaseAdmin();
  const { error } = await admin
    .from("groups")
    .update({ icon_url: iconUrl.trim() || null })
    .eq("id", groupId);
  if (error) throw new Error(error.message);
  revalidateGroup(slug);
}

const ALLOWED_ICON_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);
const MAX_ICON_BYTES = 2 * 1024 * 1024;

export async function uploadGroupIcon(
  groupId: string,
  slug: string,
  formData: FormData
): Promise<{ ok: true } | { error: string }> {
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "No file selected." };
  }
  if (!ALLOWED_ICON_TYPES.has(file.type)) {
    return { error: "Unsupported file type. Use PNG, JPEG, WebP, GIF, or SVG." };
  }
  if (file.size > MAX_ICON_BYTES) {
    return { error: "File is too large (max 2 MB)." };
  }

  const admin = getSupabaseAdmin();
  const extension = file.name.split(".").pop()?.toLowerCase() || "png";
  const path = `${groupId}-${Date.now()}.${extension}`;

  const { error: uploadError } = await admin.storage
    .from("group-icons")
    .upload(path, file, { contentType: file.type, upsert: true });

  if (uploadError) {
    return { error: uploadError.message };
  }

  const {
    data: { publicUrl },
  } = admin.storage.from("group-icons").getPublicUrl(path);

  const { error } = await admin
    .from("groups")
    .update({ icon_url: publicUrl })
    .eq("id", groupId);

  if (error) {
    return { error: error.message };
  }

  revalidateGroup(slug);
  return { ok: true };
}

export async function moveGroup(groupId: string, direction: "up" | "down") {
  const admin = getSupabaseAdmin();

  const { data: groups, error } = await admin
    .from("groups")
    .select("id, position")
    .order("position", { ascending: true });

  if (error || !groups) throw new Error(error?.message ?? "Failed to load groups");

  const index = groups.findIndex((g) => g.id === groupId);
  if (index === -1) return;

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= groups.length) return;

  const current = groups[index];
  const swapWith = groups[swapIndex];

  await Promise.all([
    admin.from("groups").update({ position: swapWith.position }).eq("id", current.id),
    admin.from("groups").update({ position: current.position }).eq("id", swapWith.id),
  ]);

  revalidateAdmin();
}

export async function addGroupLink(
  groupId: string,
  slug: string,
  label: string,
  url: string
) {
  const trimmedLabel = label.trim();
  const trimmedUrl = url.trim();
  if (!trimmedLabel || !trimmedUrl) return;

  const admin = getSupabaseAdmin();

  const { data: existing } = await admin
    .from("group_links")
    .select("*")
    .eq("group_id", groupId)
    .order("position", { ascending: false })
    .limit(1);

  const nextPosition = existing && existing.length > 0 ? existing[0].position + 1 : 0;

  const { error } = await admin
    .from("group_links")
    .insert({ group_id: groupId, label: trimmedLabel, url: trimmedUrl, position: nextPosition });
  if (error) throw new Error(error.message);

  revalidateGroup(slug);
}

export async function updateGroupLink(
  linkId: string,
  slug: string,
  label: string,
  url: string
) {
  const trimmedLabel = label.trim();
  const trimmedUrl = url.trim();
  if (!trimmedLabel || !trimmedUrl) return;

  const admin = getSupabaseAdmin();
  const { error } = await admin
    .from("group_links")
    .update({ label: trimmedLabel, url: trimmedUrl })
    .eq("id", linkId);
  if (error) throw new Error(error.message);

  revalidateGroup(slug);
}

export async function deleteGroupLink(linkId: string, slug: string) {
  const admin = getSupabaseAdmin();
  const { error } = await admin.from("group_links").delete().eq("id", linkId);
  if (error) throw new Error(error.message);
  revalidateGroup(slug);
}

export async function moveGroupLink(
  linkId: string,
  groupId: string,
  slug: string,
  direction: "up" | "down"
) {
  const admin = getSupabaseAdmin();

  const { data: links, error } = await admin
    .from("group_links")
    .select("id, position")
    .eq("group_id", groupId)
    .order("position", { ascending: true });

  if (error || !links) throw new Error(error?.message ?? "Failed to load links");

  const index = links.findIndex((l) => l.id === linkId);
  if (index === -1) return;

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= links.length) return;

  const current = links[index];
  const swapWith = links[swapIndex];

  await Promise.all([
    admin.from("group_links").update({ position: swapWith.position }).eq("id", current.id),
    admin.from("group_links").update({ position: current.position }).eq("id", swapWith.id),
  ]);

  revalidateGroup(slug);
}
