-- ONE-TIME TEST DATA RESET
-- This removes ALL current real-member rows from profiles.
-- Run ONLY if the current profiles are test data.
-- Photos must then be removed from Storage > member-photos manually,
-- or later through the admin cleanup flow if they were queued.

delete from public.profiles;
delete from public.deleted_photo_queue;
