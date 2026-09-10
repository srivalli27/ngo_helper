-- Extra policies needed for dashboards (tables already created).
-- Run this in the Supabase SQL editor.

alter table public.user_roles enable row level security;
alter table public.volunteer_profiles enable row level security;
alter table public.ngo_profiles enable row level security;
alter table public.events enable row level security;
alter table public.applications enable row level security;

drop policy if exists "Users can insert their own role" on public.user_roles;
drop policy if exists "Users can view their own role" on public.user_roles;

create policy "Users can insert their own role"
on public.user_roles
for insert
to authenticated
with check (auth.uid() = id);

create policy "Users can view their own role"
on public.user_roles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "Volunteers can insert their own profile" on public.volunteer_profiles;
drop policy if exists "Volunteers can view profiles" on public.volunteer_profiles;
drop policy if exists "Volunteers can update their own profile" on public.volunteer_profiles;

create policy "Volunteers can insert their own profile"
on public.volunteer_profiles
for insert
to authenticated
with check (auth.uid() = id);

create policy "Volunteers can view profiles"
on public.volunteer_profiles
for select
to authenticated
using (true);

create policy "Volunteers can update their own profile"
on public.volunteer_profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "NGOs can insert their own profile" on public.ngo_profiles;
drop policy if exists "Anyone can view ngo profiles" on public.ngo_profiles;
drop policy if exists "NGOs can update their own profile" on public.ngo_profiles;

create policy "NGOs can insert their own profile"
on public.ngo_profiles
for insert
to authenticated
with check (auth.uid() = id);

create policy "Anyone can view ngo profiles"
on public.ngo_profiles
for select
using (true);

create policy "NGOs can update their own profile"
on public.ngo_profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Anyone can view events" on public.events;
drop policy if exists "NGOs can create events" on public.events;
drop policy if exists "NGOs can update their events" on public.events;
drop policy if exists "NGOs can delete their events" on public.events;

create policy "Anyone can view events"
on public.events
for select
using (true);

create policy "NGOs can create events"
on public.events
for insert
to authenticated
with check (
    auth.uid() = ngo_id
    and exists (
        select 1 from public.ngo_profiles
        where ngo_profiles.id = auth.uid()
    )
);

create policy "NGOs can update their events"
on public.events
for update
to authenticated
using (auth.uid() = ngo_id)
with check (auth.uid() = ngo_id);

create policy "NGOs can delete their events"
on public.events
for delete
to authenticated
using (auth.uid() = ngo_id);

drop policy if exists "Users can view related applications" on public.applications;
drop policy if exists "Authenticated can view applications" on public.applications;
drop policy if exists "Volunteers can apply" on public.applications;
drop policy if exists "Volunteers can update own applications" on public.applications;
drop policy if exists "NGOs can update applications on their events" on public.applications;

create policy "Authenticated can view applications"
on public.applications
for select
to authenticated
using (true);

create policy "Volunteers can apply"
on public.applications
for insert
to authenticated
with check (
    volunteer_id = auth.uid()
    and exists (
        select 1 from public.volunteer_profiles
        where volunteer_profiles.id = auth.uid()
    )
);

create policy "Volunteers can update own applications"
on public.applications
for update
to authenticated
using (volunteer_id = auth.uid())
with check (volunteer_id = auth.uid());

create policy "NGOs can update applications on their events"
on public.applications
for update
to authenticated
using (
    exists (
        select 1 from public.events
        where events.id = applications.event_id
        and events.ngo_id = auth.uid()
    )
)
with check (
    exists (
        select 1 from public.events
        where events.id = applications.event_id
        and events.ngo_id = auth.uid()
    )
);
