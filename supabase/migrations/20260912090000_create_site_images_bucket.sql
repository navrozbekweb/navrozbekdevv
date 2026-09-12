-- Public storage bucket for images uploaded through the admin dashboard
-- (avatar photo, project screenshots). Files are uploaded server-side with
-- the service role key, so no extra write policy is required; the bucket
-- is public so anonymous visitors can view the images on the site.
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-images', 'site-images', true)
ON CONFLICT (id) DO NOTHING;
