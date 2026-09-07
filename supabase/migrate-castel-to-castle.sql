-- Rinomina evento Castel → Castle (eseguire una volta nel SQL Editor di Supabase).

update events
set
  slug = 'mundo-castle',
  name = 'Mundo Castle'
where slug = 'mundo-castel';

insert into events (slug, name, event_date, location)
values (
  'mundo-castle',
  'Mundo Castle',
  '2026-09-20',
  'Piazza Castello, 1, Pagazzano (BG)'
)
on conflict (slug) do update set
  name = excluded.name,
  event_date = excluded.event_date,
  location = excluded.location;
