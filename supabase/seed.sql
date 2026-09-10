-- ========================================================
-- NGO HELPER SEED DATA
-- Run this script in your Supabase SQL Editor to populate sample data
-- ========================================================

-- Create a mock NGO user ID in auth schema if using direct SQL seed
-- Note: Replace these UUIDs with actual auth user IDs from your Supabase Auth dashboard if desired.

DO $$
DECLARE
  ngo_1_id UUID := '00000000-0000-0000-0000-000000000001';
  ngo_2_id UUID := '00000000-0000-0000-0000-000000000002';
  ngo_3_id UUID := '00000000-0000-0000-0000-000000000003';
  vol_1_id UUID := '00000000-0000-0000-0000-000000000004';
  vol_2_id UUID := '00000000-0000-0000-0000-000000000005';
BEGIN

  -- Insert NGO Profiles
  INSERT INTO public.ngo_profiles (id, organization_name, phone, location, description, causes, organization_type, website, contact_person)
  VALUES 
    (ngo_1_id, 'Green Earth Foundation', '+91 98765 43210', 'Hyderabad', 'Dedicated to urban afforestation, lake cleanup, and environmental awareness across Telangana.', ARRAY['Environment', 'Community'], 'Nonprofit', 'https://greenearth.org', 'Aarav Sharma'),
    (ngo_2_id, 'Hope Healthcare Trust', '+91 98123 45678', 'Bangalore', 'Providing free medical checkups, eye screenings, and health awareness in underserved rural communities.', ARRAY['Healthcare', 'Community'], 'Trust', 'https://hopetrust.org', 'Dr. Sunita Rao'),
    (ngo_3_id, 'Bright Future Literacy', '+91 97654 32109', 'Chennai', 'Empowering children with quality after-school education, mentorship, and digital literacy tools.', ARRAY['Education', 'Youth'], 'Foundation', 'https://brightfuture.org', 'Ramesh Kumar')
  ON CONFLICT (id) DO NOTHING;

  -- Insert Volunteer Profiles
  INSERT INTO public.volunteer_profiles (id, full_name, phone, location, bio, skills, interests, availability)
  VALUES
    (vol_1_id, 'Ananya Verma', '+91 99887 76655', 'Hyderabad', 'Passionate environmentalist and computer science student keen to contribute to community welfare.', ARRAY['Teaching', 'Public Speaking', 'Event Planning'], ARRAY['Environment', 'Education'], 'Weekends'),
    (vol_2_id, 'Vikram Reddy', '+91 98711 22334', 'Bangalore', 'Software engineer with first aid certification and interest in healthcare access and tree drives.', ARRAY['First Aid', 'Logistics', 'Photography'], ARRAY['Healthcare', 'Environment'], 'Flexible')
  ON CONFLICT (id) DO NOTHING;

  -- Insert Events
  INSERT INTO public.events (id, ngo_id, title, location, date, category, spots, description)
  VALUES
    (1, ngo_1_id, 'Hussain Sagar Lake Cleanliness Drive', 'Hyderabad', CURRENT_DATE + INTERVAL '5 days', 'Environment', 25, 'Join us to restore lake bund greenery and clear plastic waste along the promenade. Gloves & refreshments provided.'),
    (2, ngo_1_id, 'Urban Sapling Plantation Marathon', 'Hyderabad', CURRENT_DATE + INTERVAL '12 days', 'Environment', 40, 'Planting 500 native saplings in Gachibowli park area. Need enthusiastic volunteers for digging, planting, and tagging.'),
    (3, ngo_2_id, 'Free Eye Screening & Diabetic Checkup Camp', 'Bangalore', CURRENT_DATE + INTERVAL '7 days', 'Healthcare', 15, 'Assisting doctors with patient registration, queue management, and basic eye test chart distribution in Whitefield.'),
    (4, ngo_3_id, 'Weekend English & Coding Workshop for Kids', 'Chennai', CURRENT_DATE + INTERVAL '3 days', 'Education', 10, 'Conducting interactive story sessions and basic Scratch coding tutorials for primary school students.'),
    (5, ngo_2_id, 'Blood Donation Drive & Wellness Camp', 'Hyderabad', CURRENT_DATE + INTERVAL '14 days', 'Healthcare', 30, 'Coordinating donor registration, refreshment distribution, and vital checks setup.'),
    (6, ngo_1_id, 'Community Food Drive & Rescue Outreach', 'Mumbai', CURRENT_DATE + INTERVAL '9 days', 'Food', 20, 'Distributing freshly cooked nutritious meals to daily wage worker shelters in Andheri.')
  ON CONFLICT (id) DO NOTHING;

  -- Insert Sample Applications
  INSERT INTO public.applications (id, event_id, volunteer_id, status)
  VALUES
    (1, 1, vol_1_id, 'accepted'),
    (2, 3, vol_2_id, 'applied'),
    (3, 4, vol_1_id, 'applied')
  ON CONFLICT (id) DO NOTHING;

END $$;
