-- Rename buttons -> groups, links -> group_links; add slug to groups.

alter table buttons rename to groups;
alter table links rename to group_links;
alter table group_links rename column button_id to group_id;

alter table groups add column slug text;

-- Backfill any existing rows with a slug derived from id (defensive; table
-- is expected to be empty/test-only, but this keeps the NOT NULL migration safe).
update groups set slug = id::text where slug is null;

alter table groups alter column slug set not null;

-- Format: lowercase letters, digits, hyphens; 1-64 chars; no leading/trailing hyphen.
alter table groups add constraint groups_slug_format
  check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 64);

alter table groups add constraint groups_slug_unique unique (slug);

-- Indexes: rename existing, add slug lookup index.
alter index buttons_position_idx rename to groups_position_idx;
alter index links_button_id_idx rename to group_links_group_id_idx;
alter index links_position_idx rename to group_links_position_idx;
create index if not exists groups_slug_idx on groups(slug);

-- RLS: policies carry over on renamed tables automatically; rename for clarity.
alter policy "Public can read buttons" on groups rename to "Public can read groups";
alter policy "Public can read links" on group_links rename to "Public can read group_links";
