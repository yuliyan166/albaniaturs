/**
 * AlbaniaTours - Cascade Commission Engine
 * Logic: Product-level -> Partner-level -> Category-level -> Global Default
 */

export class CommissionEngine {
    static GLOBAL_DEFAULT_COMMISSION = 10.00; // Базова комисиона на платформата (Ниво 4)

    /**
     * Determines the applicable commission percentage based on priority hierarchy
     * @param {Object} property - The property object (contains promotional_commission)
     * @param {Object} partner - The partner profile (contains partner_commission)
     * @param {Object} categoryComm - The category commission object from DB
     * @returns {number} The final commission percentage to apply
     */
    static determineCommissionRate(property, partner, categoryComm) {
        // Ниво 1: Промоционална (Product-level)
        if (property.promotional_commission !== null && property.promotional_commission !== undefined) {
            return parseFloat(property.promotional_commission);
        }

        // Ниво 2: Партньорска (Partner-level)
        if (partner && partner.partner_commission !== null && partner.partner_commission !== undefined) {
            return parseFloat(partner.partner_commission);
        }

        // Ниво 3: Категорийна (Category-level)
        if (categoryComm && categoryComm.default_commission !== null) {
            return parseFloat(categoryComm.default_commission);
        }

        // Ниво 4: Глобален Дефолт
        return this.GLOBAL_DEFAULT_COMMISSION;
    }

    /**
     * Calculates the financial split for a transaction
     * @param {number} totalPrice - Total amount paid by customer in CZK
     * @param {number} commissionPercent - The determined rate (e.g., 12.5)
     * @returns {Object} { platformFee: number, partnerAmount: number, rate: number }
     */
    static calculateSplit(totalPrice, commissionPercent) {
        const platformFee = (totalPrice * (commissionPercent / 100));
        const partnerAmount = totalPrice - platformFee;

        return {
            platformFee: Math.round(platformFee * 100) / 100, // Round to 2 decimals
            partnerAmount: Math.round(partnerAmount * 100) / 100,
            rate: commissionPercent
        };
    }
}