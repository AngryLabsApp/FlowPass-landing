-- País de la reunión de Cal.com → leads.pais
-- Correr en Supabase FlowPass-CRM (SQL Editor) DESPUÉS de crear en Cal.com la pregunta
-- "País" (tipo Seleccionar, identificador `pais`, opciones Perú / México / Otro).

-- 1) extract_cal_booking_data: agrega 'pais' (respuesta de la pregunta). Resto sin cambios.
CREATE OR REPLACE FUNCTION public.extract_cal_booking_data(payload jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_phone text;
BEGIN
    v_phone := COALESCE(
        payload->'body'->'payload'->'attendees'->0->>'phoneNumber',
        payload->'body'->'payload'->'responses'->'attendeePhoneNumber'->>'value'
    );

    RETURN jsonb_build_object(
        'trigger_event', payload->'body'->>'triggerEvent',
        'booking_status', payload->'body'->'payload'->>'status',
        'provider_event_id', payload->'body'->'payload'->>'uid',
        'booking_id', payload->'body'->'payload'->>'bookingId',
        'nombre', COALESCE(
            payload->'body'->'payload'->'attendees'->0->>'firstName',
            payload->'body'->'payload'->'responses'->'name'->'value'->>'firstName'
        ),
        'apellido', COALESCE(
            payload->'body'->'payload'->'attendees'->0->>'lastName',
            payload->'body'->'payload'->'responses'->'name'->'value'->>'lastName'
        ),
        'email', COALESCE(
            payload->'body'->'payload'->'responses'->'Correo-de-contacto'->>'value',
            payload->'body'->'payload'->'responses'->'email'->>'value',
            payload->'body'->'payload'->'attendees'->0->>'email'
        ),
        'telefono', v_phone,
        'pais_telefono', public.get_country_from_phone(v_phone),
        -- NUEVO: país que eligió en la reserva (Perú / México / Otro)
        'pais', payload->'body'->'payload'->'responses'->'pais'->>'value',
        'academia', payload->'body'->'payload'->'responses'->'Nombre-de-tu-academia'->>'value',
        'tipo_academia', payload->'body'->'payload'->'responses'->'Tipo-de-academia'->>'value',
        'cantidad_alumnos', payload->'body'->'payload'->'responses'->'Tama-o-de-tu-academia'->>'value',
        'como_gestiona_hoy',
            CASE
                WHEN jsonb_typeof(payload->'body'->'payload'->'responses'->'-C-mo-gestionas-hoy'->'value') = 'array'
                THEN payload->'body'->'payload'->'responses'->'-C-mo-gestionas-hoy'->'value'->>0
                ELSE payload->'body'->'payload'->'responses'->'-C-mo-gestionas-hoy'->>'value'
            END,
        'event_type', payload->'body'->'payload'->>'type',
        'starts_at', payload->'body'->'payload'->>'startTime',
        'ends_at', payload->'body'->'payload'->>'endTime',
        'meeting_url', COALESCE(
            payload->'body'->'payload'->'metadata'->>'videoCallUrl',
            payload->'body'->'payload'->'videoCallData'->>'url'
        ),
        'attendee_timezone', payload->'body'->'payload'->'attendees'->0->>'timeZone'
    );
END;
$function$;

-- 2) find_or_create_lead: guarda `pais` (elegido; si falta, el del teléfono) y origen 'cal_com'.
CREATE OR REPLACE FUNCTION public.find_or_create_lead(data jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_lead public.leads%ROWTYPE;
    v_nombre text := NULLIF(trim(data->>'nombre'), '');
    v_apellido text := NULLIF(trim(data->>'apellido'), '');
    v_email text := lower(NULLIF(trim(data->>'email'), ''));
    v_telefono text := NULLIF(trim(data->>'telefono'), '');
    v_academia text := NULLIF(trim(data->>'academia'), '');
    v_pais_telefono text := data->>'pais_telefono';
    v_pais text := COALESCE(NULLIF(trim(data->>'pais'), ''), data->>'pais_telefono');
    v_timezone text := data->>'attendee_timezone';
    v_tipo_academia text := data->>'tipo_academia';
    v_alumnos text := data->>'cantidad_alumnos';
    v_gestion_actual text := data->>'como_gestiona_hoy';
BEGIN
    IF v_email IS NOT NULL AND (v_email LIKE '%@sms.cal.com' OR v_email LIKE '%@flow-pass.com'
        OR v_email IN ('flowpass.app.contacto@gmail.com','greciadm2596@gmail.com')) THEN
        v_email := NULL;
    END IF;

    IF v_telefono IS NOT NULL THEN
        SELECT * INTO v_lead FROM public.leads WHERE telefono = v_telefono LIMIT 1;
        IF FOUND THEN
            UPDATE public.leads SET
                nombre = COALESCE(nombre, v_nombre), apellido = COALESCE(apellido, v_apellido),
                email = CASE WHEN email IS NULL OR email LIKE '%@sms.cal.com' THEN COALESCE(v_email, email) ELSE email END,
                negocio = COALESCE(negocio, v_academia), tipo_academia = COALESCE(tipo_academia, v_tipo_academia),
                alumnos = COALESCE(alumnos, v_alumnos), gestion_actual = COALESCE(gestion_actual, v_gestion_actual),
                pais_telefono = COALESCE(pais_telefono, v_pais_telefono), pais = COALESCE(pais, v_pais),
                preferred_timezone = COALESCE(preferred_timezone, v_timezone),
                submission_count = submission_count + 1, updated_at = now()
            WHERE id = v_lead.id RETURNING * INTO v_lead;
            RETURN jsonb_build_object('action','found_by_phone','lead_id',v_lead.id,'submission_count',v_lead.submission_count);
        END IF;
    END IF;

    IF v_email IS NOT NULL THEN
        SELECT * INTO v_lead FROM public.leads
        WHERE lower(email) = v_email AND (v_telefono IS NULL OR telefono IS NULL OR telefono = v_telefono) LIMIT 1;
        IF FOUND THEN
            UPDATE public.leads SET
                nombre = COALESCE(nombre, v_nombre), apellido = COALESCE(apellido, v_apellido),
                telefono = COALESCE(telefono, v_telefono), negocio = COALESCE(negocio, v_academia),
                tipo_academia = COALESCE(tipo_academia, v_tipo_academia), alumnos = COALESCE(alumnos, v_alumnos),
                gestion_actual = COALESCE(gestion_actual, v_gestion_actual),
                pais_telefono = COALESCE(pais_telefono, v_pais_telefono), pais = COALESCE(pais, v_pais),
                preferred_timezone = COALESCE(preferred_timezone, v_timezone),
                submission_count = submission_count + 1, updated_at = now()
            WHERE id = v_lead.id RETURNING * INTO v_lead;
            RETURN jsonb_build_object('action','found_by_email','lead_id',v_lead.id,'submission_count',v_lead.submission_count);
        END IF;
    END IF;

    IF v_telefono IS NULL THEN
        RAISE EXCEPTION 'Reserva sin teléfono: no se puede crear el lead';
    END IF;

    INSERT INTO public.leads (nombre, apellido, email, telefono, negocio, tipo_academia, alumnos, gestion_actual,
                              pais_telefono, pais, preferred_timezone, fuente, origen)
    VALUES (COALESCE(v_nombre,'Sin nombre'), COALESCE(v_apellido,''), v_email, v_telefono, v_academia, v_tipo_academia,
            v_alumnos, v_gestion_actual, v_pais_telefono, v_pais, v_timezone, 'cal.com', 'cal_com')
    RETURNING * INTO v_lead;
    RETURN jsonb_build_object('action','created','lead_id',v_lead.id,'submission_count',v_lead.submission_count);
END;
$function$;

-- Las funciones nuevas heredan los permisos: solo el backend (service_role) las ejecuta.
REVOKE EXECUTE ON FUNCTION public.extract_cal_booking_data(jsonb), public.find_or_create_lead(jsonb) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.extract_cal_booking_data(jsonb), public.find_or_create_lead(jsonb) TO service_role;
