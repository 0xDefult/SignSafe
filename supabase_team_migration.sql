-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Teams Table
create table teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone default now()
);

-- Team Members Table
create table team_members (
  team_id uuid references teams(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text check (role in ('ADMIN', 'LEGAL_ANALYST', 'REVIEWER', 'VIEWER')) not null,
  joined_at timestamp with time zone default now(),
  primary key (team_id, user_id)
);

-- Invitations Table
create table invitations (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete cascade,
  email text not null,
  role text check (role in ('ADMIN', 'LEGAL_ANALYST', 'REVIEWER', 'VIEWER')) not null,
  token text unique not null,
  invited_by uuid references auth.users(id) on delete set null,
  status text check (status in ('PENDING', 'ACCEPTED', 'EXPIRED')) default 'PENDING',
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default now()
);

-- Update contract_history to support team ownership
alter table contract_history add column team_id uuid references teams(id) on delete cascade;

-- RLS Policies
alter table teams enable row level security;
create policy "team_members_can_view_team" on teams for select using (
  exists (select 1 from team_members where team_id = teams.id and user_id = auth.uid())
);
create policy "only_owners_can_update_team" on teams for update using (
  auth.uid() = owner_id
);

alter table team_members enable row level security;
create policy "team_members_can_view_members" on team_members for select using (
  exists (select 1 from team_members where team_id = team_members.team_id and user_id = auth.uid())
);
create policy "admins_can_update_members" on team_members for all using (
  exists (select 1 from team_members where team_id = team_members.team_id and user_id = auth.uid() and role = 'ADMIN')
);

alter table invitations enable row level security;
create policy "admins_can_manage_invites" on invitations for all using (
  exists (select 1 from team_members where team_id = invitations.team_id and user_id = auth.uid() and role = 'ADMIN')
);
create policy "anyone_can_view_invite_with_token" on invitations for select using (
  true
);
