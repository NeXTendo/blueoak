-- ============================================================
-- BlueOak — Currency-Aware Analytics & Strict Filtering
-- Updates the admin RPCs to return analytics based on the requested currency
-- and enforces strict status/role filtering.
-- ============================================================

-- 1. Dashboard Stats (High Level Context)
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats(
  p_currency text default 'ZMW' 
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_users           int;
  v_buyers          int;
  v_sellers         int;
  v_properties      int;
  v_sold_properties int;
  v_total_revenue   numeric := 0;
  v_revenue_col     text;
BEGIN
  -- Strict role counting
  SELECT count(*) INTO v_users FROM public.profiles;
  SELECT count(*) INTO v_buyers FROM public.profiles WHERE role = 'buyer' AND status = 'active';
  SELECT count(*) INTO v_sellers FROM public.profiles WHERE role = 'seller' OR role = 'admin';

  -- Strict property counting: "Assets Indexed" means live or sold (not pending/draft)
  SELECT count(*) INTO v_properties FROM public.properties WHERE status IN ('active', 'sold');
  SELECT count(*) INTO v_sold_properties FROM public.properties WHERE status = 'sold';

  -- Dynamic Revenue Calculation based on explicit currency
  IF p_currency = 'USD' THEN
    SELECT coalesce(sum(price_usd), 0) INTO v_total_revenue FROM public.properties WHERE status = 'sold';
  ELSIF p_currency = 'ZAR' THEN
    SELECT coalesce(sum(price_zar), 0) INTO v_total_revenue FROM public.properties WHERE status = 'sold';
  ELSIF p_currency = 'KES' THEN
    SELECT coalesce(sum(price_kes), 0) INTO v_total_revenue FROM public.properties WHERE status = 'sold';
  ELSIF p_currency = 'BWP' THEN
    SELECT coalesce(sum(price_bwp), 0) INTO v_total_revenue FROM public.properties WHERE status = 'sold';
  ELSE
    SELECT coalesce(sum(price_zmw), 0) INTO v_total_revenue FROM public.properties WHERE status = 'sold';
  END IF;

  RETURN jsonb_build_object(
    'totalUsers', v_users,
    'verifiedBuyers', v_buyers,
    'activeSellers', v_sellers,
    'totalProperties', v_properties,
    'soldProperties', v_sold_properties,
    'totalRevenue', v_total_revenue,
    'activeCurrency', upper(p_currency)
  );
END;
$$;


-- 2. Revenue Chart Data (Trends over the last 6 months)
CREATE OR REPLACE FUNCTION public.get_admin_revenue_stats(
  p_currency text default 'ZMW'
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_result jsonb;
BEGIN
  -- Using a CTE to generate the last 6 months and join with sold properties
  WITH months AS (
    SELECT generate_series(
      date_trunc('month', (current_date - interval '5 months')),
      date_trunc('month', current_date),
      interval '1 month'
    )::date AS month_start
  ),
  monthly_revenue AS (
    SELECT 
      date_trunc('month', updated_at)::date AS sold_month,
      sum(
        CASE 
          WHEN p_currency = 'USD' THEN coalesce(price_usd, 0)
          WHEN p_currency = 'ZAR' THEN coalesce(price_zar, 0)
          WHEN p_currency = 'KES' THEN coalesce(price_kes, 0)
          WHEN p_currency = 'BWP' THEN coalesce(price_bwp, 0)
          ELSE coalesce(price_zmw, 0)
        END
      ) AS revenue
    FROM public.properties
    WHERE status = 'sold'
      AND updated_at >= date_trunc('month', (current_date - interval '5 months'))
    GROUP BY 1
  )
  SELECT jsonb_agg(
    jsonb_build_object(
      'month', to_char(m.month_start, 'Mon YYYY'),
      'revenue', coalesce(mr.revenue, 0)
    )
    ORDER BY m.month_start ASC
  ) INTO v_result
  FROM months m
  LEFT JOIN monthly_revenue mr ON mr.sold_month = m.month_start;

  RETURN coalesce(v_result, '[]'::jsonb);
END;
$$;
