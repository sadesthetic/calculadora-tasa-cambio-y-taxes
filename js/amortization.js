/**
 * Aura Finance - Motor de Amortización Francesa y Simulación de Pagos Anticipados
 */

const AmortizationEngine = (() => {
    /**
     * Calcula la cuota mensual fija (Sistema Francés)
     */
    const calculateMonthlyPayment = (principal, annualRate, months) => {
        if (principal <= 0 || months <= 0) return 0;
        const r = (annualRate / 100) / 12;
        if (r <= 0) return principal / months;
        return principal * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    };

    /**
     * Calcula el plan de amortización estándar completo
     */
    const calculateOriginalPlan = (principal, annualRate, months) => {
        const monthlyPayment = calculateMonthlyPayment(principal, annualRate, months);
        const totalPayment = monthlyPayment * months;
        const totalInterest = Math.max(0, totalPayment - principal);
        const apy = (Math.pow(1 + (annualRate / 1200), 12) - 1) * 100;

        return {
            principal,
            annualRate,
            months,
            monthlyPayment,
            totalPayment,
            totalInterest,
            apy
        };
    };

    /**
     * Simula la amortización con adelanto de pagos (Abonos a capital)
     * Soporta 3 estrategias:
     * - 'higher_payment': Cuota fija mensual mayor (ej. $400 en vez de $200) o abono extra mensual
     * - 'target_time': Liquidar la deuda en un plazo reducido (ej. 2 años en lugar de 5)
     * - 'lump_sum': Pago único extraordinario en un mes específico
     */
    const simulateEarlyRepayment = ({
        principal,
        annualRate,
        originalMonths,
        strategy = 'higher_payment',
        customMonthlyPayment = 0,
        extraMonthly = 0,
        targetMonths = 24,
        lumpSumAmount = 0,
        lumpSumMonth = 1
    }) => {
        const originalPlan = calculateOriginalPlan(principal, annualRate, originalMonths);
        const r = (annualRate / 100) / 12;

        let targetPayment = originalPlan.monthlyPayment;
        let monthlyExtraAmount = 0;

        if (strategy === 'target_time') {
            const validTargetMonths = Math.min(originalMonths, Math.max(1, targetMonths));
            targetPayment = calculateMonthlyPayment(principal, annualRate, validTargetMonths);
        } else if (strategy === 'higher_payment') {
            if (customMonthlyPayment > 0) {
                targetPayment = customMonthlyPayment;
                monthlyExtraAmount = Math.max(0, customMonthlyPayment - originalPlan.monthlyPayment);
            } else if (extraMonthly > 0) {
                targetPayment = originalPlan.monthlyPayment + extraMonthly;
                monthlyExtraAmount = extraMonthly;
            }
        }

        const schedule = [];
        let balance = principal;
        let totalInterestPaid = 0;
        let totalPaid = 0;
        let month = 0;
        const maxMonths = 1200; // Salvaguarda contra bucles infinitos

        while (balance > 0.005 && month < maxMonths) {
            month++;
            const interest = r > 0 ? balance * r : 0;
            let paymentDue = targetPayment;

            // Abono único extraordinario si aplica en este mes
            let singleExtra = 0;
            if (strategy === 'lump_sum' && month === lumpSumMonth && lumpSumAmount > 0) {
                singleExtra = lumpSumAmount;
            }

            let plannedPayment = paymentDue + singleExtra;
            const payoffAmount = balance + interest;

            let actualPayment = 0;
            let principalPaid = 0;

            if (plannedPayment >= payoffAmount) {
                // Último pago que liquida la deuda
                actualPayment = payoffAmount;
                principalPaid = balance;
                balance = 0;
            } else {
                actualPayment = plannedPayment;
                principalPaid = actualPayment - interest;
                if (principalPaid < 0) principalPaid = 0;
                balance -= principalPaid;
            }

            totalInterestPaid += interest;
            totalPaid += actualPayment;

            schedule.push({
                month,
                payment: actualPayment,
                principalPaid,
                interestPaid: interest,
                extraPaid: strategy === 'higher_payment' ? monthlyExtraAmount : singleExtra,
                remainingBalance: Math.max(0, balance)
            });
        }

        const newMonths = month;
        const monthsSaved = Math.max(0, originalMonths - newMonths);
        const interestSaved = Math.max(0, originalPlan.totalInterest - totalInterestPaid);
        const percentInterestSaved = originalPlan.totalInterest > 0
            ? (interestSaved / originalPlan.totalInterest) * 100
            : 0;

        return {
            originalPlan,
            strategy,
            targetPayment,
            newMonths,
            monthsSaved,
            totalInterestPaid,
            interestSaved,
            percentInterestSaved,
            totalPaid,
            schedule
        };
    };

    /**
     * Helper para desglosar meses en formato legible (Años y Meses)
     */
    const formatDuration = (totalMonths) => {
        const years = Math.floor(totalMonths / 12);
        const remainingMonths = totalMonths % 12;

        if (years > 0 && remainingMonths > 0) {
            return `${years} año${years > 1 ? 's' : ''} y ${remainingMonths} mes${remainingMonths > 1 ? 'es' : ''}`;
        } else if (years > 0) {
            return `${years} año${years > 1 ? 's' : ''}`;
        }
        return `${remainingMonths} mes${remainingMonths > 1 ? 'es' : ''}`;
    };

    return {
        calculateMonthlyPayment,
        calculateOriginalPlan,
        simulateEarlyRepayment,
        formatDuration
    };
})();

if (typeof window !== 'undefined') {
    window.AmortizationEngine = AmortizationEngine;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AmortizationEngine;
}
