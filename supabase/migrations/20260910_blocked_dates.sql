-- ===============================================================
-- MIGRATION: Blocked Dates for Availability Management
-- ===============================================================

CREATE TABLE blocked_dates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT, -- e.g., 'manual', 'ical_sync', 'maintenance'
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- Гарантира валиден период от дати
    CONSTRAINT dates_range_check CHECK (start_date <= end_date)
);

-- Включване на Row Level Security
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;

-- Политика 1: Публичен достъп за четене (за търсачките на стаи/турове)
CREATE POLICY "Anyone can view blocked dates" 
ON blocked_dates FOR SELECT 
USING (true);

-- Политика 2: Само собственикът на имота може да управлява своите блокировки
CREATE POLICY "Hosts can manage their own blocked dates" 
ON blocked_dates FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM properties 
        WHERE id = blocked_dates.property_id 
        AND host_id = auth.uid()
    )
);

-- Индекс за по-бързо търсене на наличност по имот и дата
CREATE INDEX idx_blocked_dates_property_range ON blocked_dates(property_id, start_date, end_date);