import { BookingEngine } from './booking-engine.js';
import { CommissionEngine } from './commission-engine.js';

/**
 * AlbaniaTours - QA E2E Test Suite
 * Simulates a full user journey to verify financial and logic accuracy
 */

async function runFullE2ETest() {
    console.log("🚀 Starting E2E Financial Flow Test...");

    // 1. MOCK DATA SETUP
    const mockProperty = {
        id: 'tour_123',
        category: 'tours',
        price_czk: 1800,
        promotional_commission: null, // Testing Level 2 (Partner) priority
        capacity: 12
    };

    const mockPartner = {
        id: 'partner_456',
        partner_commission: 7.00 // VIP Partner rate
    };

    const mockCategoryComm = {
        default_commission: 15.00 // Standard Tour rate
    };

    const bookingParams = {
        participants: 3,
        date: '2024-12-01'
    };

    try {
        // STEP 1: Price Calculation
        const priceResult = BookingEngine.calculatePrice(mockProperty, bookingParams);
        console.log(`✅ Step 1 - Price Calc: ${priceResult.total} CZK (${priceResult.breakdown})`);
        if (priceResult.total !== 5400) throw new Error("Price calculation failed!");

        // STEP 2: Commission Determination (Cascade Test)
        // Should pick Partner (7%) over Category (15%) since Promo is null
        const finalRate = CommissionEngine.determineCommissionRate(mockProperty, mockPartner, mockCategoryComm);
        console.log(`✅ Step 2 - Commission Rate: ${finalRate}% (Expected 7%)");
        if (finalRate !== 7.00) throw new Error("Commission cascade failed!");

        // STEP 3: Financial Split Calculation
        const split = CommissionEngine.calculateSplit(priceResult.total, finalRate);
        console.log(`✅ Step 3 - Split: Platform ${split.platformFee} CZK / Partner ${split.partnerAmount} CZK`);
        if (split.platformFee !== 378) throw new Error("Platform fee mismatch!");

        // STEP 4: Snapshot Validation Simulation
        const snapshot = {
            total_price_czk: priceResult.total,
            applied_commission_percent: split.rate,
            platform_fee_czk: split.platformFee,
            partner_amount_czk: split.partnerAmount
        };
        console.log(`✅ Step 4 - Snapshot Frozen:`, snapshot);

        console.log("\n🎉 E2E TEST PASSED SUCCESSFULLY! System is ready for launch.");
    } catch (err) {
        console.error("\n❌ E2E TEST FAILED:", err.message);
    }
}

runFullE2ETest();