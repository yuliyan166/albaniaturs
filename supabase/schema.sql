-- ===============================================================
-- ALBANIA TOURS - DATABASE SCHEMA (PostgreSQL/Supabase)
-- ===============================================================

-- 1. Профили на потребителите
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    role TEXT CHECK (role IN ('customer', 'host', 'admin')) DEFAULT 'customer',
    preferred_lang VARCHAR(5) DEFAULT 'cs',
    partner_commission NUMERIC(5, 2), -- Индивидуална комисиона за VIP партньори (Ниво 2)
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Стандартни комисиони по категории
CREATE TABLE category_commissions (
    category_id TEXT PRIMARY KEY,
    category_name_en TEXT NOT NULL,
    default_commission NUMERIC(5, 2) NOT NULL -- (Ниво 3)
);

-- Инсертиране на базовите категории според ТЗ
INSERT INTO category_commissions (category_id, category_name_en, default_commission)
VALUES 
    ('accommodation', 'Accommodation', 10.00),
    ('car_rental', 'Car Rental', 12.00),
    ('tours', 'Tours', 15.00),
    ('transfers', 'Transfers', 8.00);

-- 3. Обяви / Продукти
CREATE TABLE properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    host_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    category TEXT REFERENCES category_commissions(category_id),
    
    -- Мултиезични полета (CS, EN, SQ)
    titles JSONB NOT NULL, -- { "cs": "...", "en": "...", "sq": "..." }
    descriptions JSONB NOT NULL,
    
    price_czk NUMERIC(10, 2) NOT NULL,
    is_demo BOOLEAN DEFAULT false,
    status TEXT CHECK (status IN ('pending', 'active', 'rejected')) DEFAULT 'pending',
    
    -- Специфични за категорията полета
    ical_url TEXT, -- За настаняване
    capacity INTEGER, -- За турове
    departure_times TEXT[], -- Масив от часове за турове
    
    promotional_commission NUMERIC(5, 2), -- Промоционална комисиона (Ниво 1)
    images TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Резервации
CREATE TABLE bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id UUID REFERENCES properties(id),
    customer_id UUID REFERENCES profiles(id),
    
    -- Данни за резервацията
    booking_details JSONB, -- { "checkin": "...", "flight_number": "..." }
    total_price_czk NUMERIC(10, 2) NOT NULL,
    payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed')) DEFAULT 'pending',
    
    -- ФИНАНСОВ SNAPSHOT (Immutability)
    applied_commission_percent NUMERIC(5, 2) NOT NULL,
    platform_fee_czk NUMERIC(10, 2) NOT NULL,
    partner_amount_czk NUMERIC(10, 2) NOT NULL,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Кеш за iCal събития
CREATE TABLE ical_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===============================================================
-- ROW LEVEL SECURITY (RLS)
-- ===============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Политики за Профили: Всеки вижда своя профил
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);

-- Политики за Обяви: 
-- 1. Клиентите виждат само активни обяви
CREATE POLICY "Customers view active properties" ON properties FOR SELECT 
    USING (status = 'active');

-- 2. Партньорите виждат своите обяви
CREATE POLICY "Hosts manage own properties" ON properties FOR ALL 
    USING (auth.uid() = host_id);

-- Политики за Резервации:
-- 1. Клиентът вижда своите резервации
CREATE POLICY "Customers view own bookings" ON bookings FOR SELECT 
    USING (auth.uid() = customer_id);

-- 2. Партньорът вижда резервации за своите имоти
CREATE POLICY "Hosts view property bookings" ON bookings FOR SELECT 
    USING (
        EXISTS (SELECT 1 FROM properties WHERE id = bookings.property_id AND host_id = auth.uid())
    );