/**
 * AlbaniaTours - Cascade Commission Engine
 */
export class CommissionEngine {
  static readonly GLOBAL_DEFAULT_COMMISSION = 10.0;

  /**
   * Determines the applicable commission percentage based on priority hierarchy
   *
   * Level 1: Product-level promotional override (highest priority)
   * Level 2: Partner-specific override
   * Level 3: Category default from site_settings.category_commissions
   * Level 4: Global fallback
   */
  static determineCommissionRate(
    property: { promotional_commission?: number | null },
    partner?: { partner_commission?: number | null } | null,
    categoryComm?: { default_commission?: number | null } | null
  ): number {
    if (property.promotional_commission != null) {
      return parseFloat(String(property.promotional_commission));
    }

    if (partner?.partner_commission != null) {
      return parseFloat(String(partner.partner_commission));
    }

    if (categoryComm?.default_commission != null) {
      return parseFloat(String(categoryComm.default_commission));
    }

    return this.GLOBAL_DEFAULT_COMMISSION;
  }

  /**
   * Calculates financial split for a transaction
   */
  static calculateSplit(
    totalPrice: number,
    commissionPercent: number
  ): { platformFee: number; partnerAmount: number; rate: number } {
    const platformFee = totalPrice * (commissionPercent / 100);
    const partnerAmount = totalPrice - platformFee;

    return {
      platformFee: Math.round(platformFee * 100) / 100,
      partnerAmount: Math.round(partnerAmount * 100) / 100,
      rate: commissionPercent,
    };
  }
}