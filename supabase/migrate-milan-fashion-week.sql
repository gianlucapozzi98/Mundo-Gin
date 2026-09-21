-- Aggiungi Milan Fashion Week come evento separato (SQL Editor Supabase → Run).

insert into events (slug, name, event_date, location)
values (
  'milan-fashion-week',
  'Milan Fashion Week',
  '2026-09-01',
  'Milano'
)
on conflict (slug) do update set
  name = excluded.name,
  event_date = excluded.event_date,
  location = excluded.location;
