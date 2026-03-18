--
-- PostgreSQL database dump
--

\restrict aXzsyqCketO69MBoRwfpadONEi9jeKoK3siA6ikLz5XLelVBqGpfscHVcEvD8HN

-- Dumped from database version 14.21 (Debian 14.21-1.pgdg13+1)
-- Dumped by pg_dump version 14.21 (Debian 14.21-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: book; Type: TABLE; Schema: public; Owner: lms_user
--

CREATE TABLE public.book (
    bookid bigint NOT NULL,
    title character varying(200) NOT NULL,
    authorname character varying(150) NOT NULL,
    categoryid bigint NOT NULL,
    cover_image_url text
);


ALTER TABLE public.book OWNER TO lms_user;

--
-- Name: book_bookid_seq; Type: SEQUENCE; Schema: public; Owner: lms_user
--

CREATE SEQUENCE public.book_bookid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.book_bookid_seq OWNER TO lms_user;

--
-- Name: book_bookid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lms_user
--

ALTER SEQUENCE public.book_bookid_seq OWNED BY public.book.bookid;


--
-- Name: category; Type: TABLE; Schema: public; Owner: lms_user
--

CREATE TABLE public.category (
    categoryid bigint NOT NULL,
    categoryname character varying(100) NOT NULL
);


ALTER TABLE public.category OWNER TO lms_user;

--
-- Name: category_categoryid_seq; Type: SEQUENCE; Schema: public; Owner: lms_user
--

CREATE SEQUENCE public.category_categoryid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.category_categoryid_seq OWNER TO lms_user;

--
-- Name: category_categoryid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lms_user
--

ALTER SEQUENCE public.category_categoryid_seq OWNED BY public.category.categoryid;


--
-- Name: copy; Type: TABLE; Schema: public; Owner: lms_user
--

CREATE TABLE public.copy (
    copyid bigint NOT NULL,
    status character varying(20) NOT NULL,
    bookid bigint NOT NULL,
    CONSTRAINT copy_status_check CHECK (((status)::text = ANY ((ARRAY['AVAILABLE'::character varying, 'ISSUED'::character varying, 'RESERVED'::character varying])::text[])))
);


ALTER TABLE public.copy OWNER TO lms_user;

--
-- Name: copy_copyid_seq; Type: SEQUENCE; Schema: public; Owner: lms_user
--

CREATE SEQUENCE public.copy_copyid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.copy_copyid_seq OWNER TO lms_user;

--
-- Name: copy_copyid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lms_user
--

ALTER SEQUENCE public.copy_copyid_seq OWNED BY public.copy.copyid;


--
-- Name: fine; Type: TABLE; Schema: public; Owner: lms_user
--

CREATE TABLE public.fine (
    fineid bigint NOT NULL,
    transactionid character varying(100) NOT NULL,
    amount double precision NOT NULL,
    paidstatus character varying(20) NOT NULL,
    loanid bigint NOT NULL,
    paid_date date,
    paid boolean NOT NULL,
    CONSTRAINT fine_paidstatus_check CHECK (((paidstatus)::text = ANY ((ARRAY['PAID'::character varying, 'UNPAID'::character varying])::text[])))
);


ALTER TABLE public.fine OWNER TO lms_user;

--
-- Name: fine_fineid_seq; Type: SEQUENCE; Schema: public; Owner: lms_user
--

CREATE SEQUENCE public.fine_fineid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.fine_fineid_seq OWNER TO lms_user;

--
-- Name: fine_fineid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lms_user
--

ALTER SEQUENCE public.fine_fineid_seq OWNED BY public.fine.fineid;


--
-- Name: loan; Type: TABLE; Schema: public; Owner: lms_user
--

CREATE TABLE public.loan (
    loanid bigint NOT NULL,
    userid uuid NOT NULL,
    copyid bigint NOT NULL,
    due_date date,
    issue_date date,
    return_date date,
    status character varying(255)
);


ALTER TABLE public.loan OWNER TO lms_user;

--
-- Name: loan_loanid_seq; Type: SEQUENCE; Schema: public; Owner: lms_user
--

CREATE SEQUENCE public.loan_loanid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.loan_loanid_seq OWNER TO lms_user;

--
-- Name: loan_loanid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lms_user
--

ALTER SEQUENCE public.loan_loanid_seq OWNED BY public.loan.loanid;


--
-- Name: notification; Type: TABLE; Schema: public; Owner: lms_user
--

CREATE TABLE public.notification (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    is_read boolean NOT NULL,
    message character varying(1000),
    title character varying(255),
    userid uuid NOT NULL
);


ALTER TABLE public.notification OWNER TO lms_user;

--
-- Name: notification_id_seq; Type: SEQUENCE; Schema: public; Owner: lms_user
--

CREATE SEQUENCE public.notification_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notification_id_seq OWNER TO lms_user;

--
-- Name: notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lms_user
--

ALTER SEQUENCE public.notification_id_seq OWNED BY public.notification.id;


--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: lms_user
--

CREATE TABLE public.refresh_tokens (
    id bigint NOT NULL,
    expiry_date timestamp(6) with time zone NOT NULL,
    token character varying(512) NOT NULL,
    user_id uuid NOT NULL
);


ALTER TABLE public.refresh_tokens OWNER TO lms_user;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: lms_user
--

CREATE SEQUENCE public.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.refresh_tokens_id_seq OWNER TO lms_user;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lms_user
--

ALTER SEQUENCE public.refresh_tokens_id_seq OWNED BY public.refresh_tokens.id;


--
-- Name: reservation; Type: TABLE; Schema: public; Owner: lms_user
--

CREATE TABLE public.reservation (
    reservationid bigint NOT NULL,
    status character varying(20) NOT NULL,
    userid uuid NOT NULL,
    bookid bigint NOT NULL,
    reservation_id bigint NOT NULL,
    expiry_date date,
    reservation_date date,
    queue_position integer NOT NULL,
    CONSTRAINT reservation_status_check CHECK (((status)::text = ANY ((ARRAY['WAITING'::character varying, 'READY_FOR_PICKUP'::character varying, 'COMPLETED'::character varying, 'EXPIRED'::character varying, 'CANCELLED'::character varying])::text[])))
);


ALTER TABLE public.reservation OWNER TO lms_user;

--
-- Name: reservation_reservation_id_seq; Type: SEQUENCE; Schema: public; Owner: lms_user
--

CREATE SEQUENCE public.reservation_reservation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.reservation_reservation_id_seq OWNER TO lms_user;

--
-- Name: reservation_reservation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lms_user
--

ALTER SEQUENCE public.reservation_reservation_id_seq OWNED BY public.reservation.reservation_id;


--
-- Name: reservation_reservationid_seq; Type: SEQUENCE; Schema: public; Owner: lms_user
--

CREATE SEQUENCE public.reservation_reservationid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.reservation_reservationid_seq OWNER TO lms_user;

--
-- Name: reservation_reservationid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lms_user
--

ALTER SEQUENCE public.reservation_reservationid_seq OWNED BY public.reservation.reservationid;


--
-- Name: users; Type: TABLE; Schema: public; Owner: lms_user
--

CREATE TABLE public.users (
    userid uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(20) NOT NULL,
    phone_number character varying(15),
    profile_image_url character varying(255),
    about character varying(1000),
    suspended boolean DEFAULT false NOT NULL,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['ADMIN'::character varying, 'MEMBER'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO lms_user;

--
-- Name: book bookid; Type: DEFAULT; Schema: public; Owner: lms_user
--

ALTER TABLE ONLY public.book ALTER COLUMN bookid SET DEFAULT nextval('public.book_bookid_seq'::regclass);


--
-- Name: category categoryid; Type: DEFAULT; Schema: public; Owner: lms_user
--

ALTER TABLE ONLY public.category ALTER COLUMN categoryid SET DEFAULT nextval('public.category_categoryid_seq'::regclass);


--
-- Name: copy copyid; Type: DEFAULT; Schema: public; Owner: lms_user
--

ALTER TABLE ONLY public.copy ALTER COLUMN copyid SET DEFAULT nextval('public.copy_copyid_seq'::regclass);


--
-- Name: fine fineid; Type: DEFAULT; Schema: public; Owner: lms_user
--

ALTER TABLE ONLY public.fine ALTER COLUMN fineid SET DEFAULT nextval('public.fine_fineid_seq'::regclass);


--
-- Name: loan loanid; Type: DEFAULT; Schema: public; Owner: lms_user
--

ALTER TABLE ONLY public.loan ALTER COLUMN loanid SET DEFAULT nextval('public.loan_loanid_seq'::regclass);


--
-- Name: notification id; Type: DEFAULT; Schema: public; Owner: lms_user
--

ALTER TABLE ONLY public.notification ALTER COLUMN id SET DEFAULT nextval('public.notification_id_seq'::regclass);


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: public; Owner: lms_user
--

ALTER TABLE ONLY public.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('public.refresh_tokens_id_seq'::regclass);


--
-- Name: reservation reservationid; Type: DEFAULT; Schema: public; Owner: lms_user
--

ALTER TABLE ONLY public.reservation ALTER COLUMN reservationid SET DEFAULT nextval('public.reservation_reservationid_seq'::regclass);


--
-- Name: reservation reservation_id; Type: DEFAULT; Schema: public; Owner: lms_user
--

ALTER TABLE ONLY public.reservation ALTER COLUMN reservation_id SET DEFAULT nextval('public.reservation_reservation_id_seq'::regclass);


--
-- Name: book book_pkey; Type: CONSTRAINT; Schema: public; Owner: lms_user
--

ALTER TABLE ONLY public.book
    ADD CONSTRAINT book_pkey PRIMARY KEY (bookid);


--
-- Name: category category_categoryname_key; Type: CONSTRAINT; Schema: public; Owner: lms_user
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_categoryname_key UNIQUE (categoryname);


--
-- Name: category category_pkey; Type: CONSTRAINT; Schema: public; Owner: lms_user
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (categoryid);


--
-- Name: copy copy_pkey; Type: CONSTRAINT; Schema: public; Owner: lms_user
--

ALTER TABLE ONLY public.copy
    ADD CONSTRAINT copy_pkey PRIMARY KEY (copyid);


--
-- Name: fine fine_pkey; Type: CONSTRAINT; Schema: public; Owner: lms_user
--

ALTER TABLE ONLY public.fine
    ADD CONSTRAINT fine_pkey PRIMARY KEY (fineid);


--
-- Name: fine fine_transactionid_key; Type: CONSTRAINT; Schema: public; Owner: lms_user
--

ALTER TABLE ONLY public.fine
    ADD CONSTRAINT fine_transactionid_key UNIQUE (transactionid);


--
-- Name: loan loan_pkey; Type: CONSTRAINT; Schema: public; Owner: lms_user
--

ALTER TABLE ONLY public.loan
    ADD CONSTRAINT loan_pkey PRIMARY KEY (loanid);


--
-- Name: notification notification_pkey; Type: CONSTRAINT; Schema: public; Owner: lms_user
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: lms_user
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: reservation reservation_pkey; Type: CONSTRAINT; Schema: public; Owner: lms_user
--

ALTER TABLE ONLY public.reservation
    ADD CONSTRAINT reservation_pkey PRIMARY KEY (reservationid);


--
-- Name: refresh_tokens uk_ghpmfn23vmxfu3spu3lfg4r2d; Type: CONSTRAINT; Schema: public; Owner: lms_user
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT uk_ghpmfn23vmxfu3spu3lfg4r2d UNIQUE (token);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: lms_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_phone_number_key; Type: CONSTRAINT; Schema: public; Owner: lms_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_number_key UNIQUE (phone_number);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: lms_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (userid);


--
-- Name: refresh_tokens fk1lih5y2npsf8u5o3vhdb9y0os; Type: FK CONSTRAINT; Schema: public; Owner: lms_user
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT fk1lih5y2npsf8u5o3vhdb9y0os FOREIGN KEY (user_id) REFERENCES public.users(userid);


--
-- Name: notification fk9ug8agf2ouqkinqmlmtdrv714; Type: FK CONSTRAINT; Schema: public; Owner: lms_user
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT fk9ug8agf2ouqkinqmlmtdrv714 FOREIGN KEY (userid) REFERENCES public.users(userid);


--
-- Name: book fk_book_category; Type: FK CONSTRAINT; Schema: public; Owner: lms_user
--

ALTER TABLE ONLY public.book
    ADD CONSTRAINT fk_book_category FOREIGN KEY (categoryid) REFERENCES public.category(categoryid) ON DELETE CASCADE;


--
-- Name: copy fk_copy_book; Type: FK CONSTRAINT; Schema: public; Owner: lms_user
--

ALTER TABLE ONLY public.copy
    ADD CONSTRAINT fk_copy_book FOREIGN KEY (bookid) REFERENCES public.book(bookid) ON DELETE CASCADE;


--
-- Name: fine fk_fine_loan; Type: FK CONSTRAINT; Schema: public; Owner: lms_user
--

ALTER TABLE ONLY public.fine
    ADD CONSTRAINT fk_fine_loan FOREIGN KEY (loanid) REFERENCES public.loan(loanid) ON DELETE CASCADE;


--
-- Name: loan fk_loan_copy; Type: FK CONSTRAINT; Schema: public; Owner: lms_user
--

ALTER TABLE ONLY public.loan
    ADD CONSTRAINT fk_loan_copy FOREIGN KEY (copyid) REFERENCES public.copy(copyid) ON DELETE CASCADE;


--
-- Name: loan fk_loan_user; Type: FK CONSTRAINT; Schema: public; Owner: lms_user
--

ALTER TABLE ONLY public.loan
    ADD CONSTRAINT fk_loan_user FOREIGN KEY (userid) REFERENCES public.users(userid) ON DELETE CASCADE;


--
-- Name: reservation fk_reservation_book; Type: FK CONSTRAINT; Schema: public; Owner: lms_user
--

ALTER TABLE ONLY public.reservation
    ADD CONSTRAINT fk_reservation_book FOREIGN KEY (bookid) REFERENCES public.book(bookid) ON DELETE CASCADE;


--
-- Name: reservation fk_reservation_user; Type: FK CONSTRAINT; Schema: public; Owner: lms_user
--

ALTER TABLE ONLY public.reservation
    ADD CONSTRAINT fk_reservation_user FOREIGN KEY (userid) REFERENCES public.users(userid) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict aXzsyqCketO69MBoRwfpadONEi9jeKoK3siA6ikLz5XLelVBqGpfscHVcEvD8HN

