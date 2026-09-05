-- Aggiorna i codici PR corti (eseguire una volta nel SQL Editor di Supabase).
-- Link nuovi: /club/mundo-castel/pc  e  /club/mundo-castel/rg

update promoters set code = 'pc' where code = 'pausa-caffe';
update promoters set code = 'rg' where code = 'rub';

insert into promoters (name, code)
values
  ('Pausa Caffè', 'pc'),
  ('Rub', 'rg')
on conflict (code) do update set
  name = excluded.name;
