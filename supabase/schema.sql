create extension if not exists pgcrypto;
create table if not exists documents(id uuid primary key default gen_random_uuid(),title text not null default 'Untitled',content jsonb not null default '{"type":"doc","content":[]}'::jsonb,version integer not null default 0,created_at timestamptz default now(),updated_at timestamptz default now());
create table if not exists access_grants(id uuid primary key default gen_random_uuid(),document_id uuid not null references documents(id) on delete cascade,token_hash text unique not null,role text not null check(role in ('owner','editor','suggest','comment')),revoked boolean default false,expires_at timestamptz,created_at timestamptz default now());
create table if not exists comments(id uuid primary key default gen_random_uuid(),document_id uuid not null references documents(id) on delete cascade,guest_name text not null,body text not null,quote text default '',created_at timestamptz default now());
create table if not exists suggestions(id uuid primary key default gen_random_uuid(),document_id uuid not null references documents(id) on delete cascade,guest_name text not null,quote text default '',proposal text not null,status text default 'pending' check(status in ('pending','accepted','rejected')),created_at timestamptz default now());
alter table documents enable row level security;
alter table access_grants enable row level security;
alter table comments enable row level security;
alter table suggestions enable row level security;
