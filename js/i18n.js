/**
 * AlbaniaTours - Localization Engine
 * Supports: cs (Czech), en (English), sq (Albanian)
 */

const translations = {
    cs: {
        common: {
            welcome: "Vítejte v Albánii",
            book_now: "Rezervovat nyní",
            price: "Cena",
            demo_label: "DEMO OFERTA",
            language_switch: "Jazyk"
        },
        customer: {
            accommodation: "Ubytování",
            car_rental: "Autopůjčovna",
            tours: "Výlety",
            transfers: "Transfery",
            search_placeholder: "Kam vyrazíte?"
        },
        partner: {
            dashboard: "Partnerovský Panel",
            add_property: "Přidat ubytování/službu",
            my_earnings: "Moje výdělky",
            status_pending: "Čeká na schválení"
        },
        admin: {
            moderation: "Moderace ob jími",
            approve: "Schválit",
            reject: "Odmítnout",
            commissions: "Správa komisí"
        }
    },
    en: {
        common: {
            welcome: "Welcome to Albania",
            book_now: "Book Now",
            price: "Price",
            demo_label: "DEMO OFFER",
            language_switch: "Language"
        },
        customer: {
            accommodation: "Accommodation",
            car_rental: "Car Rental",
            tours: "Tours",
            transfers: "Transfers",
            search_placeholder: "Where are you going?"
        },
        partner: {
            dashboard: "Partner Dashboard",
            add_property: "Add Property/Service",
            my_earnings: "My Earnings",
            status_pending: "Pending Approval"
        },
        admin: {
            moderation: "Moderation",
            approve: "Approve",
            reject: "Reject",
            commissions: "Commission Management"
        }
    },
    sq: {
        common: {
            welcome: "Mirësevini në Albani",
            book_now: "Rezervo Tani",
            price: "Çmimi",
            demo_label: "OFERTË DEMO",
            language_switch: "Gjuha"
        },
        customer: {
            accommodation: "Akomodhim",
            car_rental: "Qira Makinash",
            tours: "Ekskursione",
            transfers: "Transfera",
            search_placeholder: "Ku do të shkoni?"
        },
        partner: {
            dashboard: "Paneli i Partnerit",
            add_property: "Shto një Pronë/Shërbim",
            my_earnings: "Fitimet e Mia",
            status_pending: "Në pritje të miratimit"
        },
        admin: {
            moderation: "Moderimi",
            approve: "Mirato",
            reject: "Refuzo",
            commissions: "Menaxhimi i Komisioneve"
        }
    }
};

class I18nEngine {
    constructor(defaultLang = 'cs') {
        this.currentLang = localStorage.getItem('at_lang') || defaultLang;
    }

    setLanguage(lang) {
        if (translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('at_lang', lang);
            document.dispatchEvent(new CustomEvent('langChanged', { detail: lang }));
        }
    }

    getLanguage() {
        return this.currentLang;
    }

    /**
     * Translate a key based on role and language
     * @param {string} path - Path to the translation (e.g., 'common.welcome' or 'partner.dashboard')
     * @returns {string} Translated text
     */
    t(path) {
        const keys = path.split('.');
        let result = translations[this.currentLang];

        for (const key of keys) {
            if (result[key]) {
                result = result[key];
            } else {
                return path; // Return the path if key not found
            }
        }
        return result;
    }
}

export const i18n = new I18nEngine();