-- ===============================================================
-- ALBANIA TOURS - SEED DATA FOR DEMO LAUNCH
-- All properties are marked as is_demo = true
-- ===============================================================

-- 1. Създаване на демо партньор (Host)
-- Забележка: В реална среда това би станало чрез auth.users, тук симулираме профила
INSERT INTO profiles (id, full_name, role, preferred_lang, partner_commission)
VALUES ('00000000-0000-0000-0000-000000000001', 'Albania Luxury Tours', 'host', 'sq', 8.50);

-- 2. ДЕМО ОФЕРТИ ПО КАТЕГОРИИ

-- Категория: Accommodation (Настаняване)
INSERT INTO properties (
    host_id, category, titles, descriptions, price_czk, is_demo, status, images
)
VALUES (
    '00000000-0000-0000-0000-000000000001', 
    'accommodation', 
    '{"cs": "Luxusní apartmán v centrum Tirany", "en": "Luxury Apartment in Tirana Center", "sq": "Apartament Luksoz në Qendër të Tiranës"}',
    '{"cs": "Krásný výhled na město, WiFi a klimatizace.", "en": "Great city view, WiFi and AC.", "sq": "Pamje e mrekullueshme të qytetit, WiFi dhe kondicioner."}',
    2500, true, 'active', ARRAY['https://images.unsplash.com/photo-1522708323590-d24ef8efd40e?w=500']
);

-- Категория: Car Rental (Коли под наем)
INSERT INTO properties (
    host_id, category, titles, descriptions, price_czk, is_demo, status, images
)
VALUES (
    '00000000-0000-0000-0000-000000000001', 
    'car_rental', 
    '{"cs": "Dacia Duster 4x4 (Ideální pro hory)", "en": "Dacia Duster 4x4 (Perfect for mountains)", "sq": "Dacia Duster 4x4 (Ideale për male)",}'
    '{"cs": "Silné auto pro albánské silnice.", "en": "Strong car for Albanian roads.", "sq": "Makinë e fortë për rrugët shqiptare."}',
    1200, true, 'active', ARRAY['https://images.unsplash.com/photo-1533473359331-01356edC44d?w=500']
);

-- Категория: Tours (Екскурзии) - С промоционална комисиона (Ниво 1)
INSERT INTO properties (
    host_id, category, titles, descriptions, price_czk, is_demo, status, capacity, promotional_commission, images
)
VALUES (
    '00000000-0000-0000-0000-000000000001', 
    'tours', 
    '{"cs": "Jednodenní výlet do Berat a Gjirokastra", "en": "Day Trip to Berat & Gjirokastra", "sq": "Ekskursion njëditor në Berat dhe Gjirokastër"}',
    '{"cs": "Návštěva muzeálních měst.", "en": "Visit the museum cities.", "sq": "Vizitë në qytetet muze."}',
    1800, true, 'active', 12, 5.00, ARRAY['https://images.unsplash.com/photo-1555992336-fb78d739656a?w=500']
);

-- Категория: Transfers (Трансфери)
INSERT INTO properties (
    host_id, category, titles, descriptions, price_czk, is_demo, status, images
)
VALUES (
    '00000000-0000-0000-0000-000000000001', 
    'transfers', 
    '{"cs": "Letiště Tirana -> Sarandë (VIP)", "en": "Tirana Airport -> Sarandë (VIP)", "sq": "Aeroporti i Tiranës -> Sarandë (VIP)",}'
    '{"cs": "Pohodlná cesta k moři.", "en": "Comfortable ride to the sea.", "sq": "Udhëtim komod drejt detit."}',
    3500, true, 'active', ARRAY['https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500']
);