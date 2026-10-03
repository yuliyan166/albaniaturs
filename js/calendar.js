/**
 * AlbaniaTours - Calendar & iCal Manager
 * Integrates Flatpickr and parses RFC 5545 (.ics) files
 */

export class CalendarManager {
    /**
     * Initializes Flatpickr with blocked dates from iCal/DB
     * @param {string} elementId - ID of the input field
     * @param {Array} blockedDates - Array of date strings ['2024-10-01', '2024-10-02']
     * @param {Object} options - Flatpickr config overrides
     */
    static initFlatpickr(elementId, blockedDates = [], options = {}) {
        const defaultOptions = {
            disable: blockedDates,
            dateFormat: "Y-m-d",
            mode: "range",
            minDate: "today",
            onChange: (selectedDates, dateStr, instance) => {
                document.dispatchEvent(new CustomEvent('datesChanged', {
                    detail: { selectedDates, dateStr }
                }));
            }
        };

        return flatpickr(`#${elementId}`, { ...defaultOptions, ...options });
    }

    /**
     * Parses a raw iCal (.ics) string into an array of blocked dates
     * @param {string} icsData - The content of the .ics file
     * @returns {Array} Array of ISO date strings
     */
    static parseICal(icsData) {
        const blockedDates = [];
        // Simple regex to find VEVENT blocks and their DTSTART/DTEND
        const events = icsData.split("BEGIN:VEVENT");
        
        events.shift(); // Remove header

        events.forEach(event => {
            const startMatch = event.match(/DTSTART;?VALUE=DATE:(\d{8})/);
            const endMatch = event.match(/DTEND;?VALUE=DATE:(\d{8})/);

            if (startMatch && endMatch) {
                let start = this.formatICalDate(startMatch[1]);
                let end = this.formatICalDate(endMatch[1]);

                // Add all dates between start and end to blocked list
                let current = new Date(start);
                while (current <= new Date(end)) {
                    blockedDates.push(current.toISOString().split('T')[0]);
                    current.setDate(current.getDate() + 1);
                }
            }
        });

        return [...new Set(blockedDates)]; // Remove duplicates
    }

    /**
     * Helper to convert iCal YYYYMMDD to YYYY-MM-DD
     */
    static formatICalDate(dateStr) {
        return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
    }

    /**
     * Fetches and parses blocked dates for a property from Supabase/External
     * @param {Object} supabaseClient - The initialized Supabase client
     * @param {string} propertyId - ID of the property
     */
    static async getBlockedDates(supabaseClient, propertyId) {
        // 1. Try to get cached events from our DB first
        const { data: cachedEvents, error } = await supabaseClient
            .from('ical_events')
            .select('start_date, end_date')
            .eq('property_id', propertyId);

        if (error) return [];

        // Convert cached events to simple date list
        const dates = [];
        cachedEvents.forEach(event => {
            let current = new Date(event.start_date);
            const end = new Date(event.end_date);
            while (current <= end) {
                dates.push(current.toISOString().split('T')[0]);
                current.setDate(current.getDate() + 1);
            }
        });

        return dates;
    }
}