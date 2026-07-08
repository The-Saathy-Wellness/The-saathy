create extension if not exists "uuid-ossp";

create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  "passwordHash" text not null,
  "firstName" text,
  "lastName" text,
  phone text,
  "ageRange" text,
  location text,
  language text,
  moods text[] default '{}',
  role text not null default 'user',
  "createdAt" timestamptz not null default now()
);

create table if not exists memories (
  id uuid primary key default uuid_generate_v4(),
  "userId" uuid not null references users(id) on delete cascade,
  kind text not null,
  content text not null,
  importance integer not null default 5,
  "createdAt" timestamptz not null default now()
);

create table if not exists journals (
  id uuid primary key default uuid_generate_v4(),
  "userId" uuid not null references users(id) on delete cascade,
  content text not null,
  mood text,
  insights text[] default '{}',
  "createdAt" timestamptz not null default now()
);

create table if not exists daily_pulses (
  id uuid primary key default uuid_generate_v4(),
  "userId" uuid not null references users(id) on delete cascade,
  mood integer not null,
  energy integer not null,
  stress integer not null,
  loneliness integer not null,
  note text,
  "createdAt" timestamptz not null default now()
);

create index if not exists memories_user_importance_idx on memories ("userId", importance desc);
create index if not exists journals_user_created_idx on journals ("userId", "createdAt" desc);
create index if not exists daily_pulses_user_created_idx on daily_pulses ("userId", "createdAt" desc);
