--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3 (Debian 16.3-1.pgdg120+1)
-- Dumped by pg_dump version 16.3

-- Started on 2024-07-14 20:16:32 UTC

--
-- TOC entry 3479 (class 0 OID 16868)
-- Dependencies: 226
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: hopeaero
--

INSERT INTO public.category (id, name, description, "createAt", "updateAt", "deleteAt", "indicatorId") VALUES (1, 'FURULAAA', NULL, '2024-06-19 01:30:47.901073+00', '2024-06-19 01:30:47.901073+00', NULL, 1);
INSERT INTO public.category (id, name, description, "createAt", "updateAt", "deleteAt", "indicatorId") VALUES (2, 'Criteria caballero', 'q ladilla', '2024-06-19 01:42:20.517123+00', '2024-06-19 01:42:20.517123+00', NULL, 1);

--
-- TOC entry 3473 (class 0 OID 16824)
-- Dependencies: 220
-- Data for Name: contribution; Type: TABLE DATA; Schema: public; Owner: hopeaero
--

INSERT INTO public.contribution (id, uuid, link, description, "createAt", "updateAt", "deleteAt", "userId", "categoryId") VALUES (13, '6af84f1f-fd14-4e9a-8694-9f103803ec97', '[{"URL": "Faceboodasdask.com", "description": "El perfil de Greenie"}, {"URL": "Facebook/pandadsa.com", "description": "El perfil de pan con un meme"}]', 'sexo chill', '2024-07-04 03:31:56.28564+00', '2024-07-04 03:31:56.703226+00', NULL, 1, 1);
INSERT INTO public.contribution (id, uuid, link, description, "createAt", "updateAt", "deleteAt", "userId", "categoryId") VALUES (14, '7e6f5537-0303-4afc-8d40-e59eda3ff5fe', '[{"URL": "Faceboodasdask.com", "description": "El perfil de Greenie"}, {"URL": "Facebook/pandadsa.com", "description": "El perfil de pan con un meme"}]', 'sexo chill', '2024-07-04 03:37:37.068819+00', '2024-07-04 03:37:37.486479+00', NULL, 1, 2);
INSERT INTO public.contribution (id, uuid, link, description, "createAt", "updateAt", "deleteAt", "userId", "categoryId") VALUES (11, 'bb961cae-4b06-4388-a922-2c088d2c80cf', '[{"URL": "Salvaa", "description": "Salvando"}]', 'Maricooo', '2024-06-24 17:18:33.730885+00', '2024-07-13 18:23:11.745234+00', NULL, 1, 1);
INSERT INTO public.contribution (id, uuid, link, description, "createAt", "updateAt", "deleteAt", "userId", "categoryId") VALUES (9, '6782c53b-4846-49ce-a4e8-a517c25207d0', '{"URL": "tututucu.com", "description": "ni idea"}', 'CABALLEROOOOO', '2024-06-19 02:03:15.334415+00', '2024-06-24 17:01:52.270874+00', NULL, 1, 2);
INSERT INTO public.contribution (id, uuid, link, description, "createAt", "updateAt", "deleteAt", "userId", "categoryId") VALUES (15, '26f79d91-b458-4e49-9c24-5b4ecc54ad22', '[{"URL": "Salvaa", "description": "Salvando"}]', 'Maricooo', '2024-07-13 17:38:25.500159+00', '2024-07-13 18:32:32.625569+00', NULL, 1, 1);


--
-- TOC entry 3488 (class 0 OID 17288)
-- Dependencies: 235
-- Data for Name: contribution_settings; Type: TABLE DATA; Schema: public; Owner: hopeaero
--

--
-- TOC entry 3481 (class 0 OID 16879)
-- Dependencies: 228
-- Data for Name: criteria; Type: TABLE DATA; Schema: public; Owner: hopeaero
--

INSERT INTO public.criteria (id, name, index, description, "createAt", "updateAt", "deleteAt", "indicatorId", "categoriesId") VALUES (1, 'aloooo', 1, 'Metrics used to know about the setting of the campus', '2024-06-19 01:31:34.230236+00', '2024-06-19 01:42:20.517123+00', NULL, 1, 2);


--
-- TOC entry 3475 (class 0 OID 16837)
-- Dependencies: 222
-- Data for Name: dpto; Type: TABLE DATA; Schema: public; Owner: hopeaero
--

INSERT INTO public.dpto (id, name, "createdAt", "updatedAt", "deleteAt") VALUES (1, 'CABALLERO', '2024-06-19 01:29:52.291515+00', '2024-06-19 01:29:52.291515+00', NULL);


--
-- TOC entry 3486 (class 0 OID 16993)
-- Dependencies: 233
-- Data for Name: dpto_category; Type: TABLE DATA; Schema: public; Owner: hopeaero
--



--
-- TOC entry 3471 (class 0 OID 16813)
-- Dependencies: 218
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: hopeaero
--

INSERT INTO public.files (id, name, description, path, type, size, "createdAt", "updatedAt", "deletedAt", "contributionId") VALUES (3, 'Documento importante', 'evidencia de los JUDEIN', 'http://localhost:8000/public/1718762595150-InglÃ©s desde Cero.pdf', 'pdf', 6201675, '2024-06-19 02:03:15.436754+00', '2024-06-19 02:03:15.436754+00', NULL, 9);
INSERT INTO public.files (id, name, description, path, type, size, "createdAt", "updatedAt", "deletedAt", "contributionId") VALUES (8, 'Documento importante', 'evidencia de los JUDEIN', 'http://localhost:3000/public/1720063916019-202415-INFO-plan_de_estudioVersion Nueva.pdf', 'pdf', 143458, '2024-07-04 03:31:56.386804+00', '2024-07-04 03:31:56.386804+00', NULL, 13);
INSERT INTO public.files (id, name, description, path, type, size, "createdAt", "updatedAt", "deletedAt", "contributionId") VALUES (9, 'Documento importante 3', 'evidencia de los JUDEIN', 'http://localhost:3000/public/1720063916019-73862929.jpeg', 'jpeg', 25449, '2024-07-04 03:31:56.395696+00', '2024-07-04 03:31:56.395696+00', NULL, 13);
INSERT INTO public.files (id, name, description, path, type, size, "createdAt", "updatedAt", "deletedAt", "contributionId") VALUES (10, 'Documento importante', 'evidencia de los JUDEIN', 'http://localhost:3000/public/1720064256808-202415-INFO-plan_de_estudioVersion Nueva.pdf', 'pdf', 143458, '2024-07-04 03:37:37.169004+00', '2024-07-04 03:37:37.169004+00', NULL, 14);
INSERT INTO public.files (id, name, description, path, type, size, "createdAt", "updatedAt", "deletedAt", "contributionId") VALUES (11, 'Documento importante 3', 'evidencia de los JUDEIN', 'http://localhost:3000/public/1720064256808-73862929.jpeg', 'jpeg', 25449, '2024-07-04 03:37:37.177856+00', '2024-07-04 03:37:37.177856+00', NULL, 14);
INSERT INTO public.files (id, name, description, path, type, size, "createdAt", "updatedAt", "deletedAt", "contributionId") VALUES (16, 'Documento importante de locos', 'evidencia de los JUDEIN', 'http://localhost:3000/public/1720894991426-1517471234679.jpeg', 'jpeg', 38112, '2024-07-13 18:23:11.800079+00', '2024-07-13 18:23:11.800079+00', NULL, 11);
INSERT INTO public.files (id, name, description, path, type, size, "createdAt", "updatedAt", "deletedAt", "contributionId") VALUES (19, 'Documento importante de locos', 'evidencia de los JUDEIN', 'http://localhost:3000/public/1720895552308-brasil.jpg', 'image/jpeg', 55567, '2024-07-13 18:32:32.776313+00', '2024-07-13 18:32:32.776313+00', NULL, 15);


--
-- TOC entry 3483 (class 0 OID 16890)
-- Dependencies: 230
-- Data for Name: indicator; Type: TABLE DATA; Schema: public; Owner: hopeaero
--

INSERT INTO public.indicator (id, name, index, description, "createAt", "updateAt", "deleteAt") VALUES (1, 'Infrastructure', 1, 'Metrics used to know about the setting of the campus', '2024-06-19 01:30:32.280118+00', '2024-06-19 01:30:32.280118+00', NULL);


--
-- TOC entry 3485 (class 0 OID 16901)
-- Dependencies: 232
-- Data for Name: link; Type: TABLE DATA; Schema: public; Owner: hopeaero
--



--
-- TOC entry 3469 (class 0 OID 16804)
-- Dependencies: 216
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: hopeaero
--



--
-- TOC entry 3489 (class 0 OID 17294)
-- Dependencies: 236
-- Data for Name: setting; Type: TABLE DATA; Schema: public; Owner: hopeaero
--

INSERT INTO public.setting (key, "contributionSettings", "createAt", "updateAt", "deleteAt") VALUES ('7abe3a19-92e9-4048-a8da-26ff071d5e20', '{"endDate": "2024-12-31T17:34:59.989Z", "initDate": "2024-07-13T17:34:59.989Z", "recordatory": true, "getNotificationForContribution": true}', '2024-07-13 17:37:46.629661+00', '2024-07-13 17:37:46.629661+00', NULL);


--
-- TOC entry 3477 (class 0 OID 16854)
-- Dependencies: 224
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: hopeaero
--

INSERT INTO public."user" (id, name, email, password, birthdate, role, "createdAt", "updatedAt", "deletedAt", "departmentId") VALUES (1, 'Emmanuel', 'admin@gmail.com', '$2a$10$T/aqO/Zh5tmFSn1A2BDuxuqyktWCiX01gJyVXNoUS7/QvSFtiXO1e', '2001-02-23', 'admin', '2024-06-19 01:29:57.885817+00', '2024-06-19 01:29:57.885817+00', NULL, 1);

