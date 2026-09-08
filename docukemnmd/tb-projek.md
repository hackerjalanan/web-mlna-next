create table public.projects (
  id uuid not null default gen_random_uuid (),
  title text not null,
  slug text not null,
  category text null,
  year text null,
  description text null,
  technologies text[] null,
  image text null,
  link text null,
  github text null,
  demo text null,
  featured boolean null default false,
  created_at timestamp with time zone null default now(),
  constraint projects_pkey primary key (id),
  constraint projects_slug_key unique (slug)
) TABLESPACE pg_default;