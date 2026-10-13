-- Cifras para la franja de números de la landing (src/lib/data/homeData.ts).
-- Correr en el proyecto de PRODUCCIÓN de Supabase (SQL Editor). Solo lectura.
-- Regla: contar negocios ACTIVOS (con uso real), nunca "registrados".

-- 1) Revisar qué negocios entran al conteo (sacar demos/pruebas que se cuelen).
with real_gyms as (
  select id, name, country from gyms
  where status = 'active'
    and coalesce(code, '') not in ('FLOW-DANCE')
    and name !~* '(demo|test|prueba|flowdance)'
),
activos_30d as (
  select distinct gym_id from ingresos
   where created_at >= now() - interval '30 days' and deleted_at is null
  union
  select distinct gym_id from payments
   where estado = 'confirmed' and paid_at >= now() - interval '30 days'
)
select g.name, g.country, (a.gym_id is not null) as activo_ultimos_30d
from real_gyms g left join activos_30d a on a.gym_id = g.id
order by activo_ultimos_30d desc, g.name;

-- 2) Las cifras.
with real_gyms as (
  select id, country from gyms
  where status = 'active'
    and coalesce(code, '') not in ('FLOW-DANCE')
    and name !~* '(demo|test|prueba|flowdance)'
),
activos_30d as (
  -- Usaron FlowPass en los últimos 30 días: registraron asistencias o pagos
  select distinct gym_id from ingresos
   where created_at >= now() - interval '30 days' and deleted_at is null
  union
  select distinct gym_id from payments
   where estado = 'confirmed' and paid_at >= now() - interval '30 days'
)
select
  -- academias activas
  (select count(*) from real_gyms g join activos_30d a on a.gym_id = g.id)
    as academias_activas_30d,
  -- alumnos con membresía vigente (hoy)
  (select count(distinct mp.member_id) from member_plans mp
     join real_gyms g on g.id = mp.gym_id
     join members m on m.id = mp.member_id and m.deleted_at is null
    where lower(mp.estado) = 'activo' and mp.deleted_at is null
      and (mp.proxima_fecha_pago is null or mp.proxima_fecha_pago >= current_date))
    as alumnos_membresia_vigente,
  -- asistencias registradas este año (alternativa fuerte a "recordatorios")
  (select count(*) from ingresos i join real_gyms g on g.id = i.gym_id
    where i.tipo in ('MANUAL', 'SELF', 'FREE') and i.deleted_at is null
      and i.created_at >= date_trunc('year', now()))
    as asistencias_registradas_anio,
  -- recordatorios de WhatsApp entregados este año
  (select count(*) from sent_messages s join real_gyms g on g.id = s.gym_id
    where s.status = 'sended' and s.feature in ('remember', 'classes_depleted')
      and s.created_at >= date_trunc('year', now()))
    as recordatorios_enviados_anio,
  -- cobrado por los clientes este año, por moneda (no se suman entre sí)
  (select coalesce(sum(p.monto_total), 0) from payments p join real_gyms g on g.id = p.gym_id
    where p.estado = 'confirmed' and g.country = 'PE' and p.paid_at >= date_trunc('year', now()))
    as cobrado_anio_pen,
  (select coalesce(sum(p.monto_total), 0) from payments p join real_gyms g on g.id = p.gym_id
    where p.estado = 'confirmed' and g.country = 'MX' and p.paid_at >= date_trunc('year', now()))
    as cobrado_anio_mxn;
