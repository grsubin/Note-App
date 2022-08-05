CREATE DATABASE note


CREATE TABLE IF NOT EXISTS public.note
(
    id integer NOT NULL DEFAULT nextval('note_id_seq'::regclass),
    user_id integer NOT NULL,
    guid uuid NOT NULL,
    title character varying COLLATE pg_catalog."default",
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    body character varying(225) COLLATE pg_catalog."default",
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    CONSTRAINT note_pkey PRIMARY KEY (id),
    CONSTRAINT note_guid_key UNIQUE (guid),
    CONSTRAINT note_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

CREATE TABLE IF NOT EXISTS public.user_authentication
(
    id integer NOT NULL DEFAULT nextval('user_authentication_id_seq'::regclass),
    token character varying COLLATE pg_catalog."default" NOT NULL,
    user_id integer NOT NULL,
    guid uuid NOT NULL,
    created_at timestamp with time zone,
    deleted_at timestamp with time zone,
    CONSTRAINT user_authentication_pkey PRIMARY KEY (id),
    CONSTRAINT user_authentication_guid_key UNIQUE (guid),
    CONSTRAINT user_authentication_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

CREATE TABLE IF NOT EXISTS public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    username character varying(225) COLLATE pg_catalog."default" NOT NULL,
    first_name character varying(225) COLLATE pg_catalog."default" NOT NULL,
    last_name character varying(225) COLLATE pg_catalog."default" NOT NULL,
    email character varying(225) COLLATE pg_catalog."default" NOT NULL,
    password character varying(225) COLLATE pg_catalog."default" NOT NULL,
    phone character varying(225) COLLATE pg_catalog."default" NOT NULL,
    guid uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_guid_key UNIQUE (guid)
)