-- NGO Blood Bank Management Platform Schema
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (Linked to auth.users)
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    full_name text not null,
    email text not null unique,
    phone text,
    role text not null check (role in ('super_admin', 'admin', 'president', 'secretary', 'volunteer', 'data_entry')),
    district text,
    city text,
    avatar_url text,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- 2. BLOOD CAMPS TABLE
create table public.blood_camps (
    id uuid default uuid_generate_v4() primary key,
    camp_name text not null,
    organizer text not null,
    venue text not null,
    district text not null,
    city text not null,
    camp_date date not null,
    description text,
    total_donors integer default 0,
    units_collected integer default 0,
    banner_image text,
    status text not null check (status in ('upcoming', 'completed', 'cancelled')) default 'upcoming',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.blood_camps enable row level security;

-- 3. DONORS TABLE
create table public.donors (
    id uuid default uuid_generate_v4() primary key,
    full_name text not null,
    father_name text,
    gender text check (gender in ('Male', 'Female', 'Other')),
    date_of_birth date,
    age integer,
    blood_group text not null check (blood_group in ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    phone text not null,
    email text,
    address text,
    district text not null,
    city text not null,
    pincode text,
    last_donation_date date,
    eligible_after_date date,
    availability_status text not null check (availability_status in ('available', 'not_available', 'temporarily_unavailable')) default 'available',
    medical_notes text,
    camp_id uuid references public.blood_camps(id) on delete set null,
    photo_url text,
    created_by uuid references public.profiles(id) on delete set null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.donors enable row level security;

-- 4. DONATIONS TABLE
create table public.donations (
    id uuid default uuid_generate_v4() primary key,
    donor_id uuid references public.donors(id) on delete cascade not null,
    camp_id uuid references public.blood_camps(id) on delete set null,
    units_donated integer default 1 check (units_donated > 0),
    donation_date date not null default current_date,
    verified_by uuid references public.profiles(id) on delete set null,
    remarks text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.donations enable row level security;

-- 5. BLOOD INVENTORY TABLE
create table public.blood_inventory (
    id uuid default uuid_generate_v4() primary key,
    blood_group text unique not null check (blood_group in ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    available_units integer default 0 check (available_units >= 0),
    minimum_required_units integer default 8 check (minimum_required_units >= 0),
    last_updated timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.blood_inventory enable row level security;

-- 6. BLOOD REQUESTS TABLE
create table public.blood_requests (
    id uuid default uuid_generate_v4() primary key,
    patient_name text not null,
    hospital_name text not null,
    blood_group text not null check (blood_group in ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    units_required integer not null check (units_required > 0),
    urgency text not null check (urgency in ('normal', 'urgent', 'critical')),
    attendant_name text,
    phone text not null,
    district text not null,
    city text not null,
    required_date date not null,
    notes text,
    status text not null check (status in ('pending', 'approved', 'fulfilled', 'cancelled')) default 'pending',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.blood_requests enable row level security;

-- 7. MEMBERS TABLE
create table public.members (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    designation text not null,
    email text unique,
    blood_group text check (blood_group in ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    phone text,
    years_of_service integer default 0,
    photo_url text,
    status text not null check (status in ('active', 'inactive')) default 'active',
    display_order integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.members enable row level security;

-- 8. TESTIMONIALS TABLE
create table public.testimonials (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    blood_group text check (blood_group in ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    story text not null,
    photo_url text,
    lives_impacted text,
    is_featured boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.testimonials enable row level security;

-- 9. AUDIT LOGS TABLE
create table public.audit_logs (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete set null,
    action text not null,
    entity_type text not null,
    entity_id text,
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.audit_logs enable row level security;

-- TRIGGERS FOR UPDATED_AT
create or replace function public.update_modified_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_profiles_modtime before update on public.profiles for each row execute procedure public.update_modified_column();
create trigger update_donors_modtime before update on public.donors for each row execute procedure public.update_modified_column();
create trigger update_blood_camps_modtime before update on public.blood_camps for each row execute procedure public.update_modified_column();

-- AUTOMATED NEW USER SIGNUP TRIGGER
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, full_name, email, role, is_active)
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'New Member'),
        new.email,
        coalesce(new.raw_user_meta_data->>'role', 'volunteer'),
        true
    );
    return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();
