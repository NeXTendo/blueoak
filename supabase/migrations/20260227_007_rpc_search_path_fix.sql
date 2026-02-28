-- ============================================================
-- BlueOak — RPC Search Path Fix
-- Corrects "infinite loading" by ensuring PostGIS is found
-- ============================================================

-- Update all Security Definer functions with proper search_path
-- We need 'extensions' for postgis functions like st_makepoint, st_dwithin

ALTER FUNCTION public.is_admin() SET search_path = public, extensions, pg_catalog;
ALTER FUNCTION public.is_super_admin() SET search_path = public, extensions, pg_catalog;
ALTER FUNCTION public.get_user_type() SET search_path = public, extensions, pg_catalog;
ALTER FUNCTION public.handle_new_user() SET search_path = public, extensions, pg_catalog;
ALTER FUNCTION public.get_unread_notification_count() SET search_path = public, extensions, pg_catalog;
ALTER FUNCTION public.mark_all_notifications_read() SET search_path = public, extensions, pg_catalog;
ALTER FUNCTION public.record_property_view(uuid) SET search_path = public, extensions, pg_catalog;
ALTER FUNCTION public.toggle_saved_property(uuid) SET search_path = public, extensions, pg_catalog;
ALTER FUNCTION public.get_or_create_conversation(uuid, uuid) SET search_path = public, extensions, pg_catalog;
ALTER FUNCTION public.get_platform_stats() SET search_path = public, extensions, pg_catalog;
ALTER FUNCTION public.get_admin_stats() SET search_path = public, extensions, pg_catalog;
ALTER FUNCTION public.admin_approve_property(uuid) SET search_path = public, extensions, pg_catalog;
ALTER FUNCTION public.admin_reject_property(uuid, text) SET search_path = public, extensions, pg_catalog;
ALTER FUNCTION public.admin_verify_user(uuid, boolean) SET search_path = public, extensions, pg_catalog;
ALTER FUNCTION public.admin_update_role(uuid, public.user_type) SET search_path = public, extensions, pg_catalog;
ALTER FUNCTION public.admin_ban_user(uuid, boolean) SET search_path = public, extensions, pg_catalog;
ALTER FUNCTION public.get_user_saved_properties() SET search_path = public, extensions, pg_catalog;
ALTER FUNCTION public.get_user_conversations() SET search_path = public, extensions, pg_catalog;
ALTER FUNCTION public.get_conversation_messages(uuid) SET search_path = public, extensions, pg_catalog;
ALTER FUNCTION public.get_homepage_data() SET search_path = public, extensions, pg_catalog;
ALTER FUNCTION public.get_property_detail(text) SET search_path = public, extensions, pg_catalog;

-- Update Search with technical specs
ALTER FUNCTION public.search_properties(
  text, text, text, text, numeric, numeric, int, int, numeric, numeric, 
  numeric, numeric, numeric, text, text[], text, int, int,
  numeric, numeric, numeric, boolean, boolean
) SET search_path = public, extensions, pg_catalog;

-- Update Creation RPC
ALTER FUNCTION public.create_property_listing(jsonb, jsonb[], jsonb[]) SET search_path = public, extensions, pg_catalog;
