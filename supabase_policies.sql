-- NGO Blood Bank Platform Row Level Security (RLS) and Storage Configurations

-- Helper function to check if requesting user is active and has a required role
create or replace function public.check_user_role(role_list text[])
returns boolean as $$
begin
  return (
    select exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role = any(role_list)
      and is_active = true
    )
  );
end;
$$ language plpgsql security definer;

-- =========================================================
-- 1. PROFILES POLICIES
-- =========================================================
create policy "Allow public read access to active profiles"
    on public.profiles for select
    using (is_active = true);

create policy "Allow users to update their own profile"
    on public.profiles for update
    using (auth.uid() = id)
    with check (auth.uid() = id);

create policy "Allow admins and super_admins to manage all profiles"
    on public.profiles for all
    using (public.check_user_role(array['super_admin', 'admin']));

-- =========================================================
-- 2. BLOOD CAMPS POLICIES
-- =========================================================
create policy "Allow public read access to blood camps"
    on public.blood_camps for select
    using (true);

create policy "Allow admins and secretaries to manage blood camps"
    on public.blood_camps for all
    using (public.check_user_role(array['super_admin', 'admin', 'secretary']));

-- =========================================================
-- 3. DONORS POLICIES
-- =========================================================
create policy "Allow public read access to basic available donor card info"
    on public.donors for select
    using (availability_status = 'available');

create policy "Allow authenticated staff to view all donors"
    on public.donors for select
    using (auth.uid() is not null);

create policy "Allow authorized staff to insert donors"
    on public.donors for insert
    with check (public.check_user_role(array['super_admin', 'admin', 'secretary', 'volunteer', 'data_entry']));

create policy "Allow authorized staff to update/delete donors"
    on public.donors for all
    using (public.check_user_role(array['super_admin', 'admin', 'secretary', 'data_entry']));

-- =========================================================
-- 4. DONATIONS POLICIES
-- =========================================================
create policy "Allow authenticated staff to view donations"
    on public.donations for select
    using (auth.uid() is not null);

create policy "Allow authorized staff to manage donations"
    on public.donations for all
    using (public.check_user_role(array['super_admin', 'admin', 'secretary', 'data_entry']));

-- =========================================================
-- 5. BLOOD INVENTORY POLICIES
-- =========================================================
create policy "Allow public read access to inventory levels"
    on public.blood_inventory for select
    using (true);

create policy "Allow admins and secretaries to manage inventory levels"
    on public.blood_inventory for all
    using (public.check_user_role(array['super_admin', 'admin', 'secretary']));

-- =========================================================
-- 6. BLOOD REQUESTS POLICIES
-- =========================================================
create policy "Allow public insertion of blood requests"
    on public.blood_requests for insert
    with check (true);

create policy "Allow public lookup of own request by phone"
    on public.blood_requests for select
    using (true); -- Filtered at client level by phone matching

create policy "Allow authenticated staff to view and update blood requests"
    on public.blood_requests for all
    using (auth.uid() is not null);

-- =========================================================
-- 7. NGO MEMBERS POLICIES
-- =========================================================
create policy "Allow public read access to members list"
    on public.members for select
    using (true);

create policy "Allow admins and presidents to manage members list"
    on public.members for all
    using (public.check_user_role(array['super_admin', 'admin', 'president']));

-- =========================================================
-- 8. TESTIMONIALS POLICIES
-- =========================================================
create policy "Allow public read access to testimonials"
    on public.testimonials for select
    using (true);

create policy "Allow admins to manage testimonials"
    on public.testimonials for all
    using (public.check_user_role(array['super_admin', 'admin']));

-- =========================================================
-- 9. AUDIT LOGS POLICIES
-- =========================================================
create policy "Allow admins and presidents to view audit logs"
    on public.audit_logs for select
    using (public.check_user_role(array['super_admin', 'admin', 'president']));

create policy "Allow authenticated staff to write audit logs"
    on public.audit_logs for insert
    with check (auth.uid() is not null);

-- =========================================================
-- STORAGE BUCKETS SETUP & POLICIES
-- =========================================================
-- Instructions: Run these SQL commands to set up storage buckets and RLS policies on storage.objects

insert into storage.buckets (id, name, public) values 
('avatars', 'avatars', true),
('donors', 'donors', true),
('camps', 'camps', true),
('members', 'members', true)
on conflict (id) do nothing;

-- 1. Avatars Storage Policies
create policy "Allow public read of avatars"
    on storage.objects for select
    using (bucket_id = 'avatars');

create policy "Allow authenticated user avatar uploads"
    on storage.objects for insert
    with check (bucket_id = 'avatars' and auth.uid() is not null);

create policy "Allow user avatar deletion/update"
    on storage.objects for all
    using (bucket_id = 'avatars' and auth.uid() is not null);

-- 2. Camps Storage Policies
create policy "Allow public read of camps banners"
    on storage.objects for select
    using (bucket_id = 'camps');

create policy "Allow authorized staff to manage camp banners"
    on storage.objects for all
    using (bucket_id = 'camps' and auth.role() = 'authenticated');

-- 3. Donors Storage Policies
create policy "Allow public read of donor photos"
    on storage.objects for select
    using (bucket_id = 'donors');

create policy "Allow authorized staff to manage donor photos"
    on storage.objects for all
    using (bucket_id = 'donors' and auth.role() = 'authenticated');

-- 4. Members Storage Policies
create policy "Allow public read of member photos"
    on storage.objects for select
    using (bucket_id = 'members');

create policy "Allow authorized staff to manage member photos"
    on storage.objects for all
    using (bucket_id = 'members' and auth.role() = 'authenticated');
