-- Aggiungi / rinomina Club House #1 (SQL Editor Supabase → Run).
-- Lo slug resta club-house-1: il carattere # non può stare nell'URL.

insert into events (slug, name, event_date, location)
values (
  'club-house-1',
  'Club House #1',
  '2026-10-03',
  'Treviglio (BG)'
)
on conflict (slug) do update set
  name = excluded.name,
  event_date = excluded.event_date,
  location = excluded.location;
