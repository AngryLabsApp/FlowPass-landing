-- Tabla para el formulario de soporte de /contacto (reclamos y consultas).
-- Correr en el proyecto de Supabase del CRM (FlowPass-CRM), en el SQL Editor.
-- Separada de `leads`: un reclamo no es una oportunidad de venta.

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  nombre text not null,
  email text not null,
  telefono text,                      -- E.164, opcional
  mensaje text not null,
  status text not null default 'open'
    check (status in ('open', 'in_progress', 'resolved', 'closed')),
  -- Si el correo o teléfono coincide con un lead/cliente, n8n puede enlazarlo
  lead_id uuid references public.leads(id),
  assigned_user_id uuid references auth.users(id),
  resolved_at timestamptz,
  internal_notes text,
  pagina text,
  referrer text
);

create index if not exists support_tickets_status_idx on public.support_tickets (status, created_at desc);

-- Solo el backend (n8n con service_role) escribe; nadie lee desde el navegador.
alter table public.support_tickets enable row level security;
