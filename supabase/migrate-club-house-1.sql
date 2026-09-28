-- Aggiungi Club House 1 (SQL Editor Supabase → Run).
-- L'evento Fashion Week resta in database per lo storico, ma non è più usato in admin.

insert into events (slug, name, event_date, location)
values (
  'club-house-1',
  'Club House 1',
  '2026-09-28',
  'Privato'
)
on conflict (slug) do update set
  name = excluded.name,
  event_date = excluded.event_date,
  location = excluded.location;
