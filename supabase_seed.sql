-- NGO Blood Bank Platform Seed Data
-- 1. SEED DEFAULT BLOOD INVENTORY ROWS
insert into public.blood_inventory (blood_group, available_units, minimum_required_units) values
('A+', 24, 8),
('A-', 5, 8),
('B+', 32, 8),
('B-', 4, 8),
('AB+', 12, 8),
('AB-', 2, 8),
('O+', 45, 8),
('O-', 3, 8)
on conflict (blood_group) do nothing;

-- 2. SEED BLOOD CAMPS (10 Camps)
insert into public.blood_camps (id, camp_name, organizer, venue, district, city, camp_date, description, total_donors, units_collected, banner_image, status) values
('c0000000-0000-0000-0000-000000000001', 'Ludhiana Civil Lines Drive', 'Red Cross Ludhiana', 'Civil Lines Club Hall', 'Ludhiana', 'Ludhiana', current_date + interval '5 days', 'Annual community blood donation drive organized by the District Red Cross.', 0, 0, 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800', 'upcoming'),
('c0000000-0000-0000-0000-000000000002', 'Amritsar Golden Temple Camp', 'SGPC Alliance', 'Sarai Complex Hall 1', 'Amritsar', 'Amritsar', current_date + interval '12 days', 'Emergency reserve camp organized near Sri Harmandir Sahib.', 0, 0, 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800', 'upcoming'),
('c0000000-0000-0000-0000-000000000003', 'Jalandhar IT Park Drive', 'Tech Campus NGO', 'Conference Room A, IT Block', 'Jalandhar', 'Jalandhar', current_date + interval '18 days', 'Donation campaign targeting corporate staff and young IT professionals.', 0, 0, 'https://images.unsplash.com/photo-1579684389782-64d84b5e901a?w=800', 'upcoming'),
('c0000000-0000-0000-0000-000000000004', 'Mohali Phase 7 Camp', 'Rotary Club Mohali', 'Community Center Sector 61', 'Mohali', 'Sahibzada Ajit Singh Nagar (Mohali)', current_date + interval '25 days', 'General neighborhood donation drive under medical council supervision.', 0, 0, 'https://images.unsplash.com/photo-1538108176447-284442797417?w=800', 'upcoming'),
('c0000000-0000-0000-0000-000000000005', 'Patiala Punjabi University Drive', 'Youth Red Cross Patiala', 'Student Center Lounge', 'Patiala', 'Patiala', current_date - interval '10 days', 'Successful camp organized with heavy participation from university students.', 42, 38, 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800', 'completed'),
('c0000000-0000-0000-0000-000000000006', 'Bathinda Thermal Colony Camp', 'Thermal Association', 'Recreation Center Hall', 'Bathinda', 'Bathinda', current_date - interval '22 days', 'Regular quarterly drive with township residents.', 28, 25, 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800', 'completed'),
('c0000000-0000-0000-0000-000000000007', 'Pathankot Military Area Drive', 'Armed Forces Hospital', 'Station Ground Pavilion', 'Pathankot', 'Pathankot', current_date - interval '35 days', 'Special defense services and civilian coordinator drive.', 56, 52, 'https://images.unsplash.com/photo-1579684389782-64d84b5e901a?w=800', 'completed'),
('c0000000-0000-0000-0000-000000000008', 'Hoshiarpur Village Health Drive', 'Rural Health Council', 'Government School Grounds', 'Hoshiarpur', 'Dasuya', current_date - interval '42 days', 'Rural awareness and collection drive focusing on blood subgroup listings.', 22, 18, 'https://images.unsplash.com/photo-1538108176447-284442797417?w=800', 'completed'),
('c0000000-0000-0000-0000-000000000009', 'Moga Market Association Drive', 'Moga Traders Club', 'Main Bazaar Hall', 'Moga', 'Moga', current_date + interval '40 days', 'Emergency donation camp targeting local business owners.', 0, 0, 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800', 'upcoming'),
('c0000000-0000-0000-0000-000000000010', 'Rupnagar IIT Ropar Camp', 'IIT Ropar Health Society', 'Hostel Seminar Complex', 'Rupnagar', 'Rupnagar', current_date + interval '45 days', 'Campus-wide blood collection campaign with local medical counselors.', 0, 0, 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800', 'upcoming');

-- 3. SEED DONORS (50 Donors)
-- Ludhiana (10)
insert into public.donors (full_name, father_name, gender, date_of_birth, age, blood_group, phone, email, address, district, city, pincode, last_donation_date, eligible_after_date, availability_status, camp_id, photo_url) values
('Gurpreet Singh', 'Hardev Singh', 'Male', '1988-05-12', 38, 'O+', '+919870001001', 'gurpreet.singh@gmail.com', 'House 24, Model Town', 'Ludhiana', 'Ludhiana', '141002', current_date - interval '120 days', current_date - interval '30 days', 'available', 'c0000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop'),
('Maninder Kaur', 'Baljit Singh', 'Female', '1992-10-18', 33, 'A+', '+919870001002', 'maninder.k@gmail.com', 'Flat 402, Sarabha Nagar', 'Ludhiana', 'Ludhiana', '141001', current_date - interval '20 days', current_date + interval '70 days', 'not_available', 'c0000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop'),
('Harshdeep Sharma', 'Rakesh Sharma', 'Male', '1995-02-24', 31, 'B+', '+919870001003', 'harshdeep.s@gmail.com', 'Street 3, BRS Nagar', 'Ludhiana', 'Ludhiana', '141012', current_date - interval '140 days', current_date - interval '50 days', 'available', null, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop'),
('Jaspreet Dhillon', 'Gurnam Dhillon', 'Female', '1990-07-05', 35, 'AB+', '+919870001004', 'jaspreet.d@gmail.com', 'Kothi 89, Khanna Colony', 'Ludhiana', 'Khanna', '141401', current_date - interval '200 days', current_date - interval '110 days', 'available', null, null),
('Rahul Verma', 'Vijay Verma', 'Male', '2001-09-30', 24, 'O-', '+919870001005', 'rahul.verma@gmail.com', 'Sec 32A, Chandigarh Road', 'Ludhiana', 'Ludhiana', '141010', current_date - interval '45 days', current_date + interval '45 days', 'not_available', 'c0000000-0000-0000-0000-000000000005', null),
('Amritpal Bajwa', 'Sohan Bajwa', 'Male', '1985-03-14', 41, 'A-', '+919870001006', 'amritpal.b@gmail.com', 'Civil Lines, Jagraon Road', 'Ludhiana', 'Jagraon', '142026', current_date - interval '180 days', current_date - interval '90 days', 'available', null, null),
('Kiranpreet Grewal', 'Sukhdev Grewal', 'Female', '1993-11-20', 32, 'B-', '+919870001007', 'kiran.grewal@gmail.com', 'Green Avenue, Samrala', 'Ludhiana', 'Samrala', '141114', current_date - interval '10 days', current_date + interval '80 days', 'not_available', null, null),
('Gaganpreet Sandhu', 'Karnail Sandhu', 'Male', '1997-04-15', 29, 'AB-', '+919870001008', 'gagan.sandhu@gmail.com', 'Model Town Extension', 'Ludhiana', 'Ludhiana', '141002', current_date - interval '150 days', current_date - interval '60 days', 'available', null, null),
('Balkar Singh', 'Gurdev Singh', 'Male', '1979-12-05', 46, 'O+', '+919870001009', 'balkar.s@gmail.com', 'Village Phullanwal', 'Ludhiana', 'Ludhiana', '141013', current_date - interval '85 days', current_date + interval '5 days', 'not_available', 'c0000000-0000-0000-0000-000000000005', null),
('Simranjeet Chawla', 'Inderjeet Chawla', 'Female', '1996-08-25', 29, 'B+', '+919870001010', 'simran.chawla@gmail.com', 'Street 5, Ghumar Mandi', 'Ludhiana', 'Ludhiana', '141001', current_date - interval '250 days', current_date - interval '160 days', 'available', null, null),

-- Amritsar (10)
('Satnam Singh', 'Kashmir Singh', 'Male', '1991-01-05', 35, 'O+', '+919870001011', 'satnam.s@gmail.com', 'Ranjit Avenue Block B', 'Amritsar', 'Amritsar', '143001', current_date - interval '95 days', current_date - interval '5 days', 'available', null, null),
('Prabhjot Kaur', 'Niranjan Singh', 'Female', '1994-06-12', 32, 'A+', '+919870001012', 'prabhjot.k@gmail.com', 'Verka Milk Plant Colony', 'Amritsar', 'Amritsar', '143501', current_date - interval '80 days', current_date + interval '10 days', 'not_available', null, null),
('Rajbir Gill', 'Davinder Gill', 'Male', '1987-11-09', 38, 'B+', '+919870001013', 'rajbir.gill@gmail.com', 'Kothi 2, Mall Road', 'Amritsar', 'Amritsar', '143001', current_date - interval '130 days', current_date - interval '40 days', 'available', null, null),
('Priya Malhotra', 'Sanjeev Malhotra', 'Female', '1998-03-22', 28, 'AB+', '+919870001014', 'priya.m@gmail.com', 'Lawrence Road Lane 2', 'Amritsar', 'Amritsar', '143002', current_date - interval '300 days', current_date - interval '210 days', 'available', null, null),
('Vikramjit Kahlon', 'Sardar Kahlon', 'Male', '1983-05-15', 43, 'O-', '+919870001015', 'vikram.kahlon@gmail.com', 'Majitha Road Avenue', 'Amritsar', 'Majitha', '143601', current_date - interval '250 days', current_date - interval '160 days', 'available', null, null),
('Sandeep Sodhi', 'Manjit Sodhi', 'Male', '1992-09-01', 33, 'A-', '+919870001016', 'sandeep.s@gmail.com', 'Shivala Road, Jandiala', 'Amritsar', 'Jandiala Guru', '143115', current_date - interval '150 days', current_date - interval '60 days', 'available', null, null),
('Navneet Randhawa', 'Satinder Randhawa', 'Female', '1995-07-15', 30, 'B-', '+919870001017', 'navneet.r@gmail.com', 'Basant Avenue', 'Amritsar', 'Amritsar', '143001', current_date - interval '70 days', current_date + interval '20 days', 'not_available', null, null),
('Gurjant Bhullar', 'Darshan Bhullar', 'Male', '1989-12-10', 36, 'AB-', '+919870001018', 'gurjant.b@gmail.com', 'Ajnala Road, Chheharta', 'Amritsar', 'Amritsar', '143105', current_date - interval '10 days', current_date + interval '80 days', 'not_available', null, null),
('Dilbagh Singh', 'Santokh Singh', 'Male', '1980-04-20', 46, 'O+', '+919870001019', 'dilbagh.s@gmail.com', 'Village Ramdass', 'Amritsar', 'Ramdass', '143114', current_date - interval '180 days', current_date - interval '90 days', 'available', null, null),
('Jasleen Khera', 'Bhupinder Khera', 'Female', '1999-10-05', 26, 'A+', '+919870001020', 'jasleen.k@gmail.com', 'Heritage Street Colony', 'Amritsar', 'Amritsar', '143006', current_date - interval '140 days', current_date - interval '50 days', 'available', null, null),

-- Jalandhar (10)
('Davinder Pal', 'Joginder Pal', 'Male', '1993-02-14', 33, 'O+', '+919870001021', 'davinder.pal@gmail.com', 'Model Town Market Area', 'Jalandhar', 'Jalandhar', '144001', current_date - interval '120 days', current_date - interval '30 days', 'available', 'c0000000-0000-0000-0000-000000000007', null),
('Mandeep Cheema', 'Raghbir Cheema', 'Male', '1990-08-30', 35, 'B+', '+919870001022', 'mandeep.c@gmail.com', 'Guru Nanak Avenue', 'Jalandhar', 'Jalandhar', '144008', current_date - interval '55 days', current_date + interval '35 days', 'not_available', 'c0000000-0000-0000-0000-000000000007', null),
('Ankita Pathak', 'Sunil Pathak', 'Female', '1997-04-12', 29, 'A+', '+919870001023', 'ankita.p@gmail.com', 'Urban Estate Phase II', 'Jalandhar', 'Jalandhar', '144022', current_date - interval '210 days', current_date - interval '120 days', 'available', null, null),
('Avtar Saini', 'Jeet Saini', 'Male', '1984-12-25', 41, 'AB+', '+919870001024', 'avtar.saini@gmail.com', 'Central Town, Phagwara Gate', 'Jalandhar', 'Jalandhar', '144001', current_date - interval '150 days', current_date - interval '60 days', 'available', null, null),
('Pardeep Lal', 'Sohan Lal', 'Male', '1996-06-18', 30, 'O-', '+919870001025', 'pardeep.l@gmail.com', 'Adampur Cantonment Block', 'Jalandhar', 'Adampur', '144102', current_date - interval '40 days', current_date + interval '50 days', 'not_available', null, null),
('Kavita Rani', 'Som Nath', 'Female', '1991-03-24', 35, 'A-', '+919870001026', 'kavita.rani@gmail.com', 'Civil Lines, Nakodar', 'Jalandhar', 'Nakodar', '144040', current_date - interval '180 days', current_date - interval '90 days', 'available', null, null),
('Ramanpreet Kaur', 'Harpal Singh', 'Female', '1995-10-09', 30, 'B-', '+919870001027', 'raman.k@gmail.com', 'GT Road, Phillaur', 'Jalandhar', 'Phillaur', '144410', current_date - interval '15 days', current_date + interval '75 days', 'not_available', null, null),
('Jagdeep Uppal', 'Balwant Uppal', 'Male', '1988-11-15', 37, 'AB-', '+919870001028', 'jagdeep.u@gmail.com', 'DEF Enclave, Kartarpur', 'Jalandhar', 'Kartarpur', '144801', current_date - interval '260 days', current_date - interval '170 days', 'available', null, null),
('Tarun Bhagat', 'Madan Bhagat', 'Male', '1994-07-07', 31, 'O+', '+919870001029', 'tarun.b@gmail.com', 'Lajpat Nagar Road', 'Jalandhar', 'Jalandhar', '144003', current_date - interval '89 days', current_date + interval '1 day', 'not_available', 'c0000000-0000-0000-0000-000000000007', null),
('Neetu Bala', 'Raj Kumar', 'Female', '1993-01-30', 33, 'B+', '+919870001030', 'neetu.bala@gmail.com', 'Cool Road Complex', 'Jalandhar', 'Jalandhar', '144001', current_date - interval '120 days', current_date - interval '30 days', 'available', null, null),

-- Mohali (10)
('Sartaj Singh', 'Tejinder Singh', 'Male', '1986-06-18', 40, 'O+', '+919870001031', 'sartaj.s@gmail.com', 'Phase 3B2, Mohali', 'Mohali', 'Sahibzada Ajit Singh Nagar (Mohali)', '160059', current_date - interval '130 days', current_date - interval '40 days', 'available', null, null),
('Navjot Shergill', 'Gurdial Shergill', 'Female', '1992-12-05', 33, 'A+', '+919870001032', 'navjot.s@gmail.com', 'Sector 70, Mohali', 'Mohali', 'Sahibzada Ajit Singh Nagar (Mohali)', '160071', current_date - interval '25 days', current_date + interval '65 days', 'not_available', null, null),
('Pankaj Sood', 'Anil Sood', 'Male', '1989-08-14', 36, 'B+', '+919870001033', 'pankaj.sood@gmail.com', 'Kharar Road Colony', 'Mohali', 'Kharar', '140301', current_date - interval '110 days', current_date - interval '20 days', 'available', null, null),
('Rupinder Kaur', 'Hardial Singh', 'Female', '1994-03-22', 32, 'AB+', '+919870001034', 'rupinder.k@gmail.com', 'Phase 10, Mohali', 'Mohali', 'Sahibzada Ajit Singh Nagar (Mohali)', '160062', current_date - interval '160 days', current_date - interval '70 days', 'available', null, null),
('Ishaan Gupta', 'Vijay Gupta', 'Male', '2000-11-20', 25, 'O-', '+919870001035', 'ishaan.g@gmail.com', 'Sector 68, Mohali', 'Mohali', 'Sahibzada Ajit Singh Nagar (Mohali)', '160068', current_date - interval '35 days', current_date + interval '55 days', 'not_available', null, null),
('Balpreet Walia', 'Jagir Walia', 'Male', '1985-05-15', 41, 'A-', '+919870001036', 'balpreet.w@gmail.com', 'Avenue Road, Zirakpur', 'Mohali', 'Zirakpur', '140603', current_date - interval '220 days', current_date - interval '130 days', 'available', null, null),
('Manpreet Gill', 'Joginder Gill', 'Female', '1991-09-12', 34, 'B-', '+919870001037', 'manpreet.gill@gmail.com', 'Sec 125, Sunny Enclave', 'Mohali', 'Kharar', '140301', current_date - interval '140 days', current_date - interval '50 days', 'available', null, null),
('Gaurav Dutta', 'Rajesh Dutta', 'Male', '1993-04-05', 33, 'AB-', '+919870001038', 'gaurav.d@gmail.com', 'VIP Road, Zirakpur', 'Mohali', 'Zirakpur', '140603', current_date - interval '15 days', current_date + interval '75 days', 'not_available', null, null),
('Amanpreet Sandhu', 'Nazer Sandhu', 'Male', '1987-10-10', 38, 'O+', '+919870001039', 'aman.sandhu@gmail.com', 'Rose Avenue, Dera Bassi', 'Mohali', 'Dera Bassi', '140507', current_date - interval '95 days', current_date - interval '5 days', 'available', null, null),
('Shelly Narang', 'KL Narang', 'Female', '1996-01-25', 30, 'B+', '+919870001040', 'shelly.n@gmail.com', 'Phase 5, Mohali', 'Mohali', 'Sahibzada Ajit Singh Nagar (Mohali)', '160059', current_date - interval '240 days', current_date - interval '150 days', 'available', null, null),

-- Patiala & Bathinda (10)
('Simranpal Singh', 'Kuldeep Singh', 'Male', '1992-04-15', 34, 'O+', '+919870001041', 'simranpal.s@gmail.com', 'Lower Mall Road', 'Patiala', 'Patiala', '147001', current_date - interval '110 days', current_date - interval '20 days', 'available', 'c0000000-0000-0000-0000-000000000006', null),
('Nisha Sharma', 'SK Sharma', 'Female', '1995-08-19', 30, 'A+', '+919870001042', 'nisha.s@gmail.com', 'Urban Estate Phase 1', 'Patiala', 'Patiala', '147002', current_date - interval '18 days', current_date + interval '72 days', 'not_available', 'c0000000-0000-0000-0000-000000000006', null),
('Manmeet Ahluwalia', 'GS Ahluwalia', 'Male', '1988-12-05', 37, 'B+', '+919870001043', 'manmeet.a@gmail.com', 'SST Nagar', 'Patiala', 'Patiala', '147003', current_date - interval '150 days', current_date - interval '60 days', 'available', null, null),
('Kamaljeet Kaur', 'Ajit Singh', 'Female', '1990-07-28', 35, 'AB+', '+919870001044', 'kamal.k@gmail.com', 'Nabha Estate, Nabha', 'Patiala', 'Nabha', '147201', current_date - interval '320 days', current_date - interval '230 days', 'available', null, null),
('Gursewak Singh', 'Ujjagar Singh', 'Male', '1982-10-10', 43, 'O-', '+919870001045', 'gursewak.s@gmail.com', 'Model Town, Nabha Road', 'Patiala', 'Patiala', '147001', current_date - interval '50 days', current_date + interval '40 days', 'not_available', 'c0000000-0000-0000-0000-000000000006', null),
('Bikramjit Singh', 'Jaswant Singh', 'Male', '1994-02-12', 32, 'O+', '+919870001046', 'bikram.s@gmail.com', 'Thermal Colony Sec 2', 'Bathinda', 'Bathinda', '151001', current_date - interval '130 days', current_date - interval '40 days', 'available', null, null),
('Jaswinder Kaur', 'Gora Singh', 'Female', '1991-09-08', 34, 'A+', '+919870001047', 'jaswinder.k@gmail.com', 'Model Town Phase 3', 'Bathinda', 'Bathinda', '151005', current_date - interval '35 days', current_date + interval '55 days', 'not_available', null, null),
('Abhijeet Sidhu', 'Karan Sidhu', 'Male', '1996-03-30', 30, 'B+', '+919870001048', 'abhi.sidhu@gmail.com', 'Street 4, Maur Mandi', 'Bathinda', 'Mauri', '151509', current_date - interval '210 days', current_date - interval '120 days', 'available', null, null),
('Harpal Khosa', 'Ninder Khosa', 'Male', '1985-05-18', 41, 'AB+', '+919870001049', 'harpal.khosa@gmail.com', 'Civil Lines area', 'Bathinda', 'Bathinda', '151001', current_date - interval '180 days', current_date - interval '90 days', 'available', null, null),
('Ramandeep Chahal', 'Prem Chahal', 'Female', '1993-07-22', 32, 'O-', '+919870001050', 'raman.chahal@gmail.com', 'Talwandi Road, Jaitu', 'Faridkot', 'Jaitu', '151202', current_date - interval '82 days', current_date + interval '8 days', 'not_available', null, null);

-- 4. SEED MEMBERS (15 members)
insert into public.members (name, designation, email, blood_group, phone, years_of_service, photo_url, status, display_order) values
('Dr. Manoj Prabhakar', 'President & Chief Pathologist', 'manoj.president@azaadhumanrights.org', 'O+', '+919876543210', 8, 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&fit=crop', 'active', 1),
('Dr. Archana Sen', 'Vice President & Medical Officer', 'archana.vp@azaadhumanrights.org', 'A+', '+919876543211', 6, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&fit=crop', 'active', 2),
('Sardar Gurcharan Singh', 'General Secretary', 'gurcharan.sec@azaadhumanrights.org', 'B+', '+919876543212', 7, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&fit=crop', 'active', 3),
('Manpreet Singh Dhillon', 'Treasurer & Compliance Officer', 'manpreet.treasurer@azaadhumanrights.org', 'O-', '+919876543213', 5, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&fit=crop', 'active', 4),
('Harvinder Grewal', 'Coordinator - Ludhiana District', 'harvinder.ludhiana@azaadhumanrights.org', 'AB+', '+919876543214', 4, null, 'active', 5),
('Simranpreet Kaur', 'Coordinator - Amritsar District', 'simran.amritsar@azaadhumanrights.org', 'O+', '+919876543215', 3, null, 'active', 6),
('Jasmit Bajaj', 'Coordinator - Jalandhar District', 'jasmit.jalandhar@azaadhumanrights.org', 'A-', '+919876543216', 4, null, 'active', 7),
('Amit Lal', 'Data Entry Supervisor', 'amit.data@azaadhumanrights.org', 'B-', '+919876543217', 3, null, 'active', 8),
('Kamaldeep Sandhu', 'Volunteer Lead', 'kamal.volunteer@azaadhumanrights.org', 'AB-', '+919876543218', 2, null, 'active', 9),
('Navneet Sodhi', 'Data Operator', 'navneet.operator@azaadhumanrights.org', 'O+', '+919876543219', 2, null, 'active', 10),
('Gurpreet Bajwa', 'Field Logistics Lead', 'gurpreet.field@azaadhumanrights.org', 'A+', '+919876543220', 3, null, 'active', 11),
('Kiran Bala', 'Donor Welfare Officer', 'kiran.welfare@azaadhumanrights.org', 'B+', '+919876543221', 4, null, 'active', 12),
('Davinder Kahlon', 'Emergency Dispatch Lead', 'davinder.dispatch@azaadhumanrights.org', 'O-', '+919876543222', 2, null, 'active', 13),
('Rajesh Verma', 'Database Backup Manager', 'rajesh.backup@azaadhumanrights.org', 'AB+', '+919876543223', 3, null, 'active', 14),
('Baltej Brar', 'Volunteer Liaison', 'baltej.volunteer@azaadhumanrights.org', 'O+', '+919876543224', 1, null, 'active', 15);

-- 5. SEED TESTIMONIALS (20 testimonials)
insert into public.testimonials (name, blood_group, story, photo_url, lives_impacted, is_featured) values
('Siddharth Roy', 'AB-', 'Connected with an AB- donor within 35 minutes when my chemotherapy levels dropped critically in Fortis Jalandhar. Highly professional and extremely rapid coordination.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop', '1 Life Saved', true),
('Dr. Archana Sen', 'A+', 'Emergency surgery cannot wait. Having a searchable registry where we can filter donors by city and immediate availability saves hours of administrative telephone calls. This is the healthcare standard.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop', '120+ Surgeries', true),
('Manpreet Singh', 'O-', 'I check my eligibility status directly on the portal. Once the 90 days are up, I get notified and book a slot at the nearest camp. The entire process is premium, digital, and completely transparent.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop', '9 Donations Logged', true),
('Ramanpreet Kaur', 'B+', 'My grandmother needed B+ blood during her cardiac bypass at Fortis Mohali. We filed a request, and two registered volunteers came within the hour. Outstanding service!', null, '1 Family Supported', true),
('Surinder Pal', 'O+', 'As a regular donor, being able to track when I am eligible to donate again keeps me accountable. The camp organization is clean, medically sterile, and very professional.', null, '4 Donations Logged', false),
('Nirmal Singh', 'A-', 'Our son needed emergency transfusion in Amritsar. The volunteer database helped us contact eligible donors nearby instantly. We got the unit within 45 minutes.', null, '1 Child Saved', false),
('Gaurav Chhabra', 'AB+', 'I donated blood at the Jalandhar IT Park drive. The priority RSVP scheduling meant I did not have to wait in line. Clean setup and very cooperative staff.', null, '3 Lives Impacted', false),
('Prof. GS Patiala', 'O-', 'In emergencies, time is everything. This NGO has bridged the coordination gap in Punjab by providing open, verified lookup logs without charging patients.', null, '50+ Students Coordinated', false),
('Jaswinder Brar', 'A+', 'I registered as a donor after my daughter received blood from a volunteer. Paying it forward is the least we can do. Extremely trustworthy organization.', null, '2 Donations Logged', false),
('Kiran Bala', 'B-', 'Found rare B- blood for emergency delivery at Bathinda. The attendant contact was verified and prompt. Truly lifesavers!', null, 'Mother & Child Saved', false),
('Major SS Pathankot', 'O+', 'Our soldiers and civilian families frequently coordinate drives. The live inventory dashboard helps us see when local levels drop below safety targets.', null, '200+ Units Monitored', false),
('Sandeep Sodhi', 'A-', 'Donating blood at the local SGPC camp in Amritsar was extremely fast. The digital check-in took 2 minutes. Highly recommend registering.', null, '3 Lives Saved', false),
('Aman Gill', 'B+', 'A B+ request was approved and dispatched to Max Hospital Bathinda. The coordination between the hospital blood bank and the NGO volunteer was flawless.', null, 'Emergency Resolved', false),
('Kavita Mehta', 'AB-', 'My daughter needed AB- platelets. The dispatch alert went out to registered donors in Jalandhar, and three donors arrived to support us.', null, 'Life Saved', false),
('Balkar Singh', 'O+', 'The team is transparent. Being able to see audit logs gives me confidence that donations are logged accurately and inventory is dispatched strictly to verified hospitals.', null, 'Active Supporter', false),
('Dr. VK Rajpura', 'A+', 'We rely on this public donor search during peak dengue seasons when platelet demand is high. It bypasses bureaucratic blood bank exchange delays.', null, 'Clinical Support Partner', false),
('Jasleen Khera', 'B+', 'Very clean and sterile environment during their college donation campaigns. The team is well trained and explains eligibility criteria clearly.', null, 'First Time Donor', false),
('Gurpreet Bajwa', 'O-', 'O- is universal and always in short supply. Being part of this verified registry allows me to serve when critical trauma operations are logged.', null, '5 Lives Impacted', false),
('Priya Malhotra', 'AB+', 'The WhatsApp broadcast template generated during my request helped us share the requirement across local groups instantly with all key details.', null, 'Attendant Saved Time', false),
('Harvinder Pal', 'A+', 'Highly responsive team. The secretary approved my hospital requests within 10 minutes of filing on the portal.', null, 'Emergency Met', false);

-- 6. SEED BLOOD REQUESTS (20 requests)
insert into public.blood_requests (patient_name, hospital_name, blood_group, units_required, urgency, attendant_name, phone, district, city, required_date, notes, status) values
('Ramesh Kumar', 'Fortis Hospital', 'A+', 2, 'urgent', 'Suresh Kumar', '+919888123451', 'Mohali', 'Sahibzada Ajit Singh Nagar (Mohali)', current_date + interval '1 day', 'Patient undergoing emergency hip replacement surgery.', 'pending'),
('Bibi Gurdev Kaur', 'Civil Hospital', 'O-', 3, 'critical', 'Manjit Singh', '+919888123452', 'Amritsar', 'Amritsar', current_date, 'Severe blood loss due to gastrointestinal hemorrhage. O- required immediately.', 'pending'),
('Baby of Simran', 'Apollo Clinic', 'B+', 1, 'normal', 'Harpreet Singh', '+919888123453', 'Ludhiana', 'Ludhiana', current_date + interval '4 days', 'Neo-natal jaundice treatment requiring exchange transfusion.', 'pending'),
('Davinder Pal', 'Max Hospital', 'AB-', 2, 'critical', 'Rajesh Pal', '+919888123454', 'Bathinda', 'Bathinda', current_date, 'Cardiac bypass surgery patient. Platelets required urgently.', 'pending'),
('Karan Malhotra', 'GMC Patiala', 'O+', 2, 'urgent', 'Priya Malhotra', '+919888123455', 'Patiala', 'Patiala', current_date + interval '2 days', 'Accident trauma victim with internal bleeding.', 'pending'),
('Satish Verma', 'Christian Medical College', 'A-', 3, 'normal', 'Vijay Verma', '+919888123456', 'Ludhiana', 'Ludhiana', current_date + interval '6 days', 'Scheduled chemotherapy support transfusion.', 'pending'),
('Gurnam Dhillon', 'Ivy Hospital', 'B-', 2, 'urgent', 'Jaspreet Dhillon', '+919888123457', 'Mohali', 'Sahibzada Ajit Singh Nagar (Mohali)', current_date + interval '1 day', 'Severe anemia under oncology supervision.', 'pending'),
('Harshdeep Sharma', 'Civil Hospital', 'AB+', 1, 'normal', 'Rakesh Sharma', '+919888123458', 'Ludhiana', 'Ludhiana', current_date + interval '5 days', 'Thalassemia major regular transfusion cycle.', 'pending'),
('Madan Bhagat', 'Fortis Jalandhar', 'O+', 2, 'urgent', 'Tarun Bhagat', '+919888123459', 'Jalandhar', 'Jalandhar', current_date + interval '2 days', 'Chronic kidney disease, blood transfusion support.', 'pending'),
('Neetu Bala', 'Sacred Heart Hospital', 'B+', 3, 'critical', 'Raj Kumar', '+919888123460', 'Jalandhar', 'Jalandhar', current_date, 'Post-partum hemorrhage emergency.', 'pending'),
('Kuldeep Singh', 'CMC Ludhiana', 'O+', 2, 'approved', 'Simranpal Singh', '+919888123461', 'Ludhiana', 'Ludhiana', current_date - interval '2 days', 'Approved request and units dispatched successfully.', 'approved'),
('Amritpal Bajwa', 'Fortis Amritsar', 'A-', 1, 'fulfilled', 'Sohan Bajwa', '+919888123462', 'Amritsar', 'Amritsar', current_date - interval '4 days', 'Fulfilled request. Patient discharged in stable condition.', 'fulfilled'),
('Nisha Sharma', 'Rajindra Hospital', 'A+', 2, 'cancelled', 'SK Sharma', '+919888123463', 'Patiala', 'Patiala', current_date - interval '5 days', 'Cancelled as family managed replacement donors.', 'cancelled'),
('Jaswinder Kaur', 'Civil Hospital', 'O+', 2, 'approved', 'Gora Singh', '+919888123464', 'Bathinda', 'Bathinda', current_date - interval '1 day', 'Dispatched units from Thermal Colony camp collection.', 'approved'),
('Gursewak Singh', 'Ivy Hospital Hoshiarpur', 'O-', 1, 'fulfilled', 'Ujjagar Singh', '+919888123465', 'Hoshiarpur', 'Hoshiarpur', current_date - interval '8 days', 'Universal O- dispatched immediately.', 'fulfilled'),
('Ankita Pathak', 'Capitol Hospital', 'A+', 2, 'pending', 'Sunil Pathak', '+919888123466', 'Jalandhar', 'Jalandhar', current_date + interval '3 days', 'Hysterectomy surgical reserve units.', 'pending'),
('Ishaan Gupta', 'Max Mohali', 'O-', 2, 'urgent', 'Vijay Gupta', '+919888123467', 'Mohali', 'Sahibzada Ajit Singh Nagar (Mohali)', current_date + interval '1 day', 'Emergency dialysis support transfusion.', 'pending'),
('Sandeep Sodhi', 'Sri Guru Ram Das Hospital', 'A-', 3, 'critical', 'Manjit Sodhi', '+919888123468', 'Amritsar', 'Amritsar', current_date, 'Surgical bleeding management.', 'pending'),
('Gurjant Bhullar', 'Amandeep Hospital', 'AB-', 2, 'normal', 'Darshan Bhullar', '+919888123469', 'Amritsar', 'Amritsar', current_date + interval '5 days', 'Orthopedic knee replacement reserve units.', 'pending'),
('Balpreet Walia', 'CMC Ludhiana', 'A-', 2, 'urgent', 'Jagir Walia', '+919888123470', 'Ludhiana', 'Ludhiana', current_date + interval '2 days', 'Post-surgery support transfusion.', 'pending');
