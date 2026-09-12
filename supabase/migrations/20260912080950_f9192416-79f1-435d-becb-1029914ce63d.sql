REVOKE ALL ON public.contact_messages FROM anon, authenticated;
GRANT ALL ON public.contact_messages TO service_role;
DROP POLICY IF EXISTS "No public access to contact messages" ON public.contact_messages;
CREATE POLICY "No public access to contact messages" ON public.contact_messages FOR SELECT TO authenticated USING (false);