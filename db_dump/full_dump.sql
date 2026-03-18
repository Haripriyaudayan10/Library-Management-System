--
-- PostgreSQL database dump
--

\restrict 8MqmqfkJaxIngCbCNCm8vT3UbpgWgy4gTuhGiaLitYpaJcJpbenNq4DVirOu2v8

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
-- Data for Name: book; Type: TABLE DATA; Schema: public; Owner: lms_user
--

COPY public.book (bookid, title, authorname, categoryid, cover_image_url) FROM stdin;
1	Clean Code	Robert C. Martin	1	\N
2	Introduction to Algorithms	Thomas H. Cormen	1	\N
3	Artificial Intelligence: A Modern Approach	Stuart Russell	10	\N
4	Engineering Mathematics	B.S. Grewal	5	\N
6	Randamoozham	M.T.Vasudevan Nair	7	\N
7	Aadujeevitham	Benyamin	17	\N
9	Normal People	Sally Rooney	20	\N
10	A Little Life	Hanya Yanagihara	21	\N
11	The Emperor of All Maladies	Siddhartha Mukherjee	22	\N
12	I Am Malala	Malala Yousafzai	22	\N
13	Pride and Prejudice	Jane Austen	20	\N
14	Khasakkinte Ithihasam	O.V. Vijayan	17	\N
16	Agnisakshi	Lalithambika Antharjanam	17	\N
\.


--
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: lms_user
--

COPY public.category (categoryid, categoryname) FROM stdin;
3	Mechanical Engineering
4	Civil Engineering
5	Mathematics
6	Physics
7	Literature
8	History
9	Competitive Exams
10	Artificial Intelligence
11	Electronics and Communication
13	Fiction
14	AutoBiography
15	string
16	Fantasy
1	Modern Literature
17	Novel
18	Film
19	Literary Fiction
20	Romance
21	Drama
22	Biography
\.


--
-- Data for Name: copy; Type: TABLE DATA; Schema: public; Owner: lms_user
--

COPY public.copy (copyid, status, bookid) FROM stdin;
1	AVAILABLE	1
4	AVAILABLE	4
6	AVAILABLE	1
8	AVAILABLE	3
9	AVAILABLE	4
11	AVAILABLE	1
12	AVAILABLE	2
13	AVAILABLE	3
16	AVAILABLE	4
2	AVAILABLE	2
3	ISSUED	3
17	ISSUED	6
18	ISSUED	6
19	ISSUED	6
14	AVAILABLE	4
22	AVAILABLE	9
23	AVAILABLE	9
24	AVAILABLE	9
25	AVAILABLE	9
26	AVAILABLE	9
28	AVAILABLE	10
29	AVAILABLE	10
30	AVAILABLE	10
31	AVAILABLE	10
33	AVAILABLE	11
34	AVAILABLE	11
35	AVAILABLE	12
36	AVAILABLE	12
37	AVAILABLE	12
32	ISSUED	11
7	AVAILABLE	2
38	AVAILABLE	13
39	AVAILABLE	13
40	AVAILABLE	13
41	AVAILABLE	14
20	ISSUED	7
27	ISSUED	10
45	AVAILABLE	16
48	AVAILABLE	16
44	ISSUED	16
\.


--
-- Data for Name: fine; Type: TABLE DATA; Schema: public; Owner: lms_user
--

COPY public.fine (fineid, transactionid, amount, paidstatus, loanid, paid_date, paid) FROM stdin;
\.


--
-- Data for Name: loan; Type: TABLE DATA; Schema: public; Owner: lms_user
--

COPY public.loan (loanid, userid, copyid, due_date, issue_date, return_date, status) FROM stdin;
4	6f7f6c21-5b2c-4ff8-8941-617db39a6a84	2	2026-03-12	2026-02-26	2026-02-26	RETURNED
5	6f7f6c21-5b2c-4ff8-8941-617db39a6a84	14	2026-03-12	2026-02-26	2026-03-01	RETURNED
7	590accd5-2b68-4598-b184-81c3cebe3b47	20	2026-03-23	2026-03-09	2026-03-09	RETURNED
9	8b0d81c7-6b94-4d50-9e5d-653040f97c7a	32	2026-03-23	2026-03-09	\N	ACTIVE
6	590accd5-2b68-4598-b184-81c3cebe3b47	7	2026-03-17	2026-03-01	2026-03-09	RETURNED
10	cf2d4eb2-f468-4b72-8515-1b065b47ecf6	41	2026-03-24	2026-03-10	2026-03-10	RETURNED
11	cf2d4eb2-f468-4b72-8515-1b065b47ecf6	20	2026-03-24	2026-03-10	2026-03-10	RETURNED
12	8efb6936-4c1d-411c-8190-14fd3da0f2bf	20	2026-03-24	2026-03-10	\N	ACTIVE
13	51bd0c00-74b0-49ee-95a8-b155780c312c	27	2026-03-25	2026-03-11	\N	ACTIVE
14	e4ae6db5-6421-48c2-b6f0-96162206cd00	44	2026-03-25	2026-03-11	\N	ACTIVE
\.


--
-- Data for Name: notification; Type: TABLE DATA; Schema: public; Owner: lms_user
--

COPY public.notification (id, created_at, is_read, message, title, userid) FROM stdin;
1	2026-02-27 18:09:50.947074	f	Dear Arjun Nair,\n\nYour reserved book 'Randamoozham' is now available for pickup.\nPlease collect it within 7 days.	Book Available for Pickup	90c2d20b-90ca-42dc-afc9-9edfd9116854
3	2026-03-10 14:06:23.432046	t	"Khasakkinte Ithihasam" is now available. Please pick it up within 3 days.	Book Ready for Pickup	b1f02731-9ad0-4699-a088-101a8bc704c4
2	2026-03-02 22:42:33.575826	t	Your reserved book 'Aadujeevitham' is now available for pickup. Please collect within 7 days.	Book Available	590accd5-2b68-4598-b184-81c3cebe3b47
4	2026-03-10 16:22:47.678345	t	"Aadujeevitham" is now available. Please pick it up within 3 days.	Book Ready for Pickup	8efb6936-4c1d-411c-8190-14fd3da0f2bf
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: lms_user
--

COPY public.refresh_tokens (id, expiry_date, token, user_id) FROM stdin;
\.


--
-- Data for Name: reservation; Type: TABLE DATA; Schema: public; Owner: lms_user
--

COPY public.reservation (reservationid, status, userid, bookid, reservation_id, expiry_date, reservation_date, queue_position) FROM stdin;
2	CANCELLED	90c2d20b-90ca-42dc-afc9-9edfd9116854	6	2	\N	2026-03-01	1
3	CANCELLED	590accd5-2b68-4598-b184-81c3cebe3b47	7	3	\N	2026-03-02	1
1	EXPIRED	90c2d20b-90ca-42dc-afc9-9edfd9116854	6	1	2026-03-06	2026-02-27	1
4	EXPIRED	590accd5-2b68-4598-b184-81c3cebe3b47	7	4	2026-03-09	2026-03-02	1
6	READY_FOR_PICKUP	b1f02731-9ad0-4699-a088-101a8bc704c4	14	6	2026-03-13	2026-03-10	1
5	COMPLETED	8efb6936-4c1d-411c-8190-14fd3da0f2bf	7	5	\N	2026-03-09	1
7	CANCELLED	590accd5-2b68-4598-b184-81c3cebe3b47	7	7	\N	2026-03-10	2
8	WAITING	b486d319-7c74-487b-8276-57fd2ab75063	7	8	\N	2026-03-11	1
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: lms_user
--

COPY public.users (userid, name, email, password, role, phone_number, profile_image_url, about, suspended) FROM stdin;
8efb6936-4c1d-411c-8190-14fd3da0f2bf	Anjali Thomas	anjali.thomas@library.com	$2a$10$swtiqHWDA3gaMAOfSJrKi.1zUVpYnhMM1wU9tu.Y3Xb4BX/dUtdue	MEMBER	9539162860	/uploads/profile-images/2a0b7584-1a89-4fc2-97a5-5b7ffbb4bfc3.png	i'm a good reader\n	f
90c2d20b-90ca-42dc-afc9-9edfd9116854	Arjun Nair	arjun.nair@library.com	$2a$10$GViTE/sWgqvOGnTKLVD6R.M/pgbWFWeawYhOgxCOEMf83F/Q.HAg.	MEMBER	9741237562	/uploads/profile-images/3b74918f-add9-429c-b4c0-279e8b79804c.png	\N	f
6f7f6c21-5b2c-4ff8-8941-617db39a6a84	Sneha Menon	sneha.menon@library.com	$2a$10$NSnW5cxWubWfygMvToxLjuzOzLB/Fst6tdngXGp0HmNJ3ABR01WAC	MEMBER	9996257321	/uploads/profile-images/562b1a23-3ce6-4a35-a48c-a4840fffbc75.png	\N	f
590accd5-2b68-4598-b184-81c3cebe3b47	Rahul Varma	rahul.varma@library.com	$2a$10$SGUyYOqRZPgBPi.Ck63zS.VMJ9tueCqTV2Tyx5ts7FYFkAsHfJci2	MEMBER	8085470612	/uploads/profile-images/771eb34b-36cc-4279-874d-9ec127e2f8e3.png	\N	f
99ba5400-e065-426a-ba1b-28ba5b013741	Dr. Meera Krishnan	admin.meera@library.com	$2a$10$RGLdMZD5oD25EhVMb0IRUuGwPiphUShr1Nq7rXzOAu/QtrsECOVVW	ADMIN	9876543210	\N	\N	f
8b0d81c7-6b94-4d50-9e5d-653040f97c7a	Harisankar A K	hari.sankar@library.com	$2a$10$2JhR9g54GERxx0NtX/8c.ePv78zI.66ITUkYPYQzlKmB2HY8IBwW.	MEMBER	9539162960	/uploads/profile-images/eba63c09-a99f-46d2-8864-81416feaf6a2.png	\N	f
cf2d4eb2-f468-4b72-8515-1b065b47ecf6	Haripriya A K	hari.priya@library.com	$2a$10$mfainxQpQuihdvuuLGHUaeQYl8Pyb2FI4tVz7gxRg7BmqJd4OBj9G	MEMBER	7689145734	/uploads/profile-images/06ff257b-3f32-4e74-884b-9f339f8fb8aa.png	\N	f
b1f02731-9ad0-4699-a088-101a8bc704c4	Akash R Pillai	akash.pillai@library.com	$2a$10$iCMy6ezP5VJn42DazMMcp.rfVVC1m2ElUkRzTOkXISJ5BzlC4zhPC	MEMBER	7004625792	/uploads/profile-images/3f49847f-e25d-4ff2-83b8-0b28658b1f87.png	\N	f
e4ae6db5-6421-48c2-b6f0-96162206cd00	Aravind V	aravind.v@library.com	$2a$10$KdLPCVI1NTjeC.fpe9wEv.b9nr2lZ/OihsPifAAxJI1t/SJVk9Bda	MEMBER	9004625793	\N	\N	f
51bd0c00-74b0-49ee-95a8-b155780c312c	Vivek Raj	vivek.raj@library.com	$2a$10$D3lFnmucc4Ra.WexWqRTWugqlg.OUbFTwWQ.QdvakLDjbmJguR2WO	MEMBER	9849275533	/uploads/profile-images/7f5bc103-cfd7-4c07-8555-5aadd80a37e0.png	\N	f
b486d319-7c74-487b-8276-57fd2ab75063	Sudarshana	sudar.shana@library.com	$2a$10$oQjAq1BhFiZcrUk6t3HPk.0ajiECkQnrhOm6GZj6nftw.S/lruuBu	MEMBER	9946985540	\N	\N	f
bdf8ced9-92f0-40f9-8ac6-a60097b51954	Ankitha Sargam	ankitha.sargam@library.com	$2a$10$1QcWornncv/9lKdotS9U7.fd5KKJbarg.qrZNm70nMWE/IengTSGW	MEMBER	8665073540	/uploads/profile-images/c3b44460-4c66-4d77-a053-13647851135e.png	\N	f
\.


--
-- Name: book_bookid_seq; Type: SEQUENCE SET; Schema: public; Owner: lms_user
--

SELECT pg_catalog.setval('public.book_bookid_seq', 18, true);


--
-- Name: category_categoryid_seq; Type: SEQUENCE SET; Schema: public; Owner: lms_user
--

SELECT pg_catalog.setval('public.category_categoryid_seq', 22, true);


--
-- Name: copy_copyid_seq; Type: SEQUENCE SET; Schema: public; Owner: lms_user
--

SELECT pg_catalog.setval('public.copy_copyid_seq', 52, true);


--
-- Name: fine_fineid_seq; Type: SEQUENCE SET; Schema: public; Owner: lms_user
--

SELECT pg_catalog.setval('public.fine_fineid_seq', 6, true);


--
-- Name: loan_loanid_seq; Type: SEQUENCE SET; Schema: public; Owner: lms_user
--

SELECT pg_catalog.setval('public.loan_loanid_seq', 14, true);


--
-- Name: notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lms_user
--

SELECT pg_catalog.setval('public.notification_id_seq', 4, true);


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lms_user
--

SELECT pg_catalog.setval('public.refresh_tokens_id_seq', 27, true);


--
-- Name: reservation_reservation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lms_user
--

SELECT pg_catalog.setval('public.reservation_reservation_id_seq', 8, true);


--
-- Name: reservation_reservationid_seq; Type: SEQUENCE SET; Schema: public; Owner: lms_user
--

SELECT pg_catalog.setval('public.reservation_reservationid_seq', 8, true);


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

\unrestrict 8MqmqfkJaxIngCbCNCm8vT3UbpgWgy4gTuhGiaLitYpaJcJpbenNq4DVirOu2v8

