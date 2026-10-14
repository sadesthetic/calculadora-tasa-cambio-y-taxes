/**
 * Aura Finance - Controlador de UI para Pagos Anticipados y Ahorro en Amortización
 */

const EarlyPaymentUI = (() => {
    // Referencias a elementos del DOM
    let toggleEarlyPay;
    let earlyPayBody;
    let cardEarlyPay;
    let strategyBtns;
    let strategyPanes;

    // Inputs de estrategias
    let customPaymentInput;
    let customPaymentHelper;
    let targetTimeInput;
    let targetTimeUnitSelect;
    let targetTimeHelper;
    let lumpAmountInput;
    let lumpMonthInput;

    // Elementos de resultados
    let savingsHeroBanner;
    let savingsHeroAmount;
    let savingsPctChip;
    let savingsHeroFooter;
    let comparisonMatrix;
    let scheduleContainer;
    let scheduleTableBody;
    let scheduleTriggerBtn;

    // Referencias a inputs principales del préstamo
    let principalInput;
    let rateInput;
    let timeInput;
    let timeUnitSelect;
    let compoundingSelect;

    let activeStrategy = 'higher_payment';

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('es-VE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(val || 0);
    };

    const init = () => {
        // Elementos de control
        toggleEarlyPay = document.getElementById('toggle-early-pay');
        earlyPayBody = document.getElementById('early-pay-body');
        cardEarlyPay = document.getElementById('card-early-pay');
        strategyBtns = document.querySelectorAll('.strategy-btn');
        strategyPanes = document.querySelectorAll('.strategy-pane');

        // Inputs
        customPaymentInput = document.getElementById('early-custom-payment');
        customPaymentHelper = document.getElementById('early-custom-helper');
        targetTimeInput = document.getElementById('early-target-time');
        targetTimeUnitSelect = document.getElementById('early-target-unit');
        targetTimeHelper = document.getElementById('early-target-helper');
        lumpAmountInput = document.getElementById('early-lump-amount');
        lumpMonthInput = document.getElementById('early-lump-month');

        // Resultados
        savingsHeroBanner = document.getElementById('early-savings-banner');
        savingsHeroAmount = document.getElementById('early-savings-amount');
        savingsPctChip = document.getElementById('early-savings-pct');
        savingsHeroFooter = document.getElementById('early-savings-footer');
        comparisonMatrix = document.getElementById('early-comparison-matrix');
        scheduleContainer = document.getElementById('early-schedule-container');
        scheduleTableBody = document.getElementById('early-schedule-tbody');
        scheduleTriggerBtn = document.getElementById('early-schedule-trigger');

        // Préstamo principal
        principalInput = document.getElementById('apr-principal');
        rateInput = document.getElementById('apr-rate');
        timeInput = document.getElementById('apr-time');
        timeUnitSelect = document.getElementById('apr-time-unit');
        compoundingSelect = document.getElementById('apr-compounding');

        if (!toggleEarlyPay) return;

        // Recuperar preferencias guardadas
        const savedEnabled = localStorage.getItem('early_pay_enabled') === 'true';
        toggleEarlyPay.checked = savedEnabled;
        if (savedEnabled) {
            earlyPayBody.classList.remove('hidden');
        } else {
            earlyPayBody.classList.add('hidden');
        }

        activeStrategy = localStorage.getItem('early_pay_strategy') || 'higher_payment';
        setStrategy(activeStrategy);

        // Valores por defecto o guardados
        customPaymentInput.value = localStorage.getItem('early_custom_payment') || '';
        targetTimeInput.value = localStorage.getItem('early_target_time') || '2';
        targetTimeUnitSelect.value = localStorage.getItem('early_target_unit') || 'years';
        lumpAmountInput.value = localStorage.getItem('early_lump_amount') || '1000';
        lumpMonthInput.value = localStorage.getItem('early_lump_month') || '6';

        // Listeners de eventos
        toggleEarlyPay.addEventListener('change', () => {
            const isChecked = toggleEarlyPay.checked;
            localStorage.setItem('early_pay_enabled', isChecked);
            if (isChecked) {
                earlyPayBody.classList.remove('hidden');
            } else {
                earlyPayBody.classList.add('hidden');
            }
            update();
        });

        strategyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const strat = btn.getAttribute('data-strategy');
                setStrategy(strat);
                localStorage.setItem('early_pay_strategy', strat);
                update();
            });
        });

        [customPaymentInput, targetTimeInput, targetTimeUnitSelect, lumpAmountInput, lumpMonthInput].forEach(el => {
            if (!el) return;
            el.addEventListener('input', () => {
                saveInputValues();
                update();
            });
            el.addEventListener('change', () => {
                saveInputValues();
                update();
            });
        });

        if (scheduleTriggerBtn) {
            scheduleTriggerBtn.addEventListener('click', () => {
                const isExpanded = scheduleContainer.classList.toggle('expanded');
                scheduleTriggerBtn.innerHTML = isExpanded 
                    ? '<i data-lucide="chevron-up"></i> Ocultar Cronograma de Pagos'
                    : '<i data-lucide="calendar"></i> Ver Cronograma de Pagos (Mes a Mes)';
                if (window.lucide) window.lucide.createIcons();
            });
        }
    };

    const saveInputValues = () => {
        if (customPaymentInput) localStorage.setItem('early_custom_payment', customPaymentInput.value);
        if (targetTimeInput) localStorage.setItem('early_target_time', targetTimeInput.value);
        if (targetTimeUnitSelect) localStorage.setItem('early_target_unit', targetTimeUnitSelect.value);
        if (lumpAmountInput) localStorage.setItem('early_lump_amount', lumpAmountInput.value);
        if (lumpMonthInput) localStorage.setItem('early_lump_month', lumpMonthInput.value);
    };

    const setStrategy = (strat) => {
        activeStrategy = strat;
        strategyBtns.forEach(b => {
            if (b.getAttribute('data-strategy') === strat) {
                b.classList.add('active');
            } else {
                b.classList.remove('active');
            }
        });

        strategyPanes.forEach(pane => {
            if (pane.getAttribute('data-strategy-pane') === strat) {
                pane.classList.add('active');
            } else {
                pane.classList.remove('active');
            }
        });
    };

    const isEnabled = () => {
        return toggleEarlyPay && toggleEarlyPay.checked && compoundingSelect.value === 'amortized';
    };

    const update = () => {
        if (!isEnabled()) {
            if (savingsHeroBanner) savingsHeroBanner.classList.add('hidden');
            if (comparisonMatrix) comparisonMatrix.classList.add('hidden');
            if (scheduleContainer) scheduleContainer.classList.remove('expanded');
            if (scheduleTriggerBtn) scheduleTriggerBtn.classList.add('hidden');
            return;
        }

        const principal = parseFloat(principalInput.value) || 0;
        const rate = parseFloat(rateInput.value) || 0;
        const timeVal = parseFloat(timeInput.value) || 0;
        const timeUnit = timeUnitSelect.value;
        const originalMonths = timeUnit === 'months' ? timeVal : timeVal * 12;

        if (principal <= 0 || rate < 0 || originalMonths <= 0) {
            if (savingsHeroBanner) savingsHeroBanner.classList.add('hidden');
            if (comparisonMatrix) comparisonMatrix.classList.add('hidden');
            if (scheduleTriggerBtn) scheduleTriggerBtn.classList.add('hidden');
            return;
        }

        const originalPlan = AmortizationEngine.calculateOriginalPlan(principal, rate, originalMonths);

        // Configuración de la estrategia activa
        let customMonthlyPayment = parseFloat(customPaymentInput.value) || 0;
        if (!customPaymentInput.value && activeStrategy === 'higher_payment') {
            // Sugerir por defecto un 25% extra si está vacío
            customMonthlyPayment = Math.round(originalPlan.monthlyPayment * 1.25);
            customPaymentInput.placeholder = formatCurrency(customMonthlyPayment);
        }

        // Helper dinámico para Cuota Mayor
        if (customPaymentHelper) {
            if (customMonthlyPayment > originalPlan.monthlyPayment) {
                const extra = customMonthlyPayment - originalPlan.monthlyPayment;
                customPaymentHelper.innerHTML = `Cuota base: $${formatCurrency(originalPlan.monthlyPayment)} | <strong style="color:var(--accent-emerald);">+$${formatCurrency(extra)} USD extra directo a capital</strong>`;
            } else {
                customPaymentHelper.textContent = `Cuota base calculada: $${formatCurrency(originalPlan.monthlyPayment)} USD/mes`;
            }
        }

        // Parámetros de Plazo Objetivo
        const targetVal = parseFloat(targetTimeInput.value) || 1;
        const targetMonths = targetTimeUnitSelect.value === 'months' ? targetVal : targetVal * 12;

        if (targetTimeHelper) {
            const reqPayment = AmortizationEngine.calculateMonthlyPayment(principal, rate, targetMonths);
            const extraReq = Math.max(0, reqPayment - originalPlan.monthlyPayment);
            targetTimeHelper.innerHTML = `Cuota necesaria: <strong>$${formatCurrency(reqPayment)} USD/mes</strong> (+${formatCurrency(extraReq)} vs cuota base)`;
        }

        // Simulación con AmortizationEngine
        const simulation = AmortizationEngine.simulateEarlyRepayment({
            principal,
            annualRate: rate,
            originalMonths,
            strategy: activeStrategy,
            customMonthlyPayment,
            targetMonths,
            lumpSumAmount: parseFloat(lumpAmountInput.value) || 0,
            lumpSumMonth: parseInt(lumpMonthInput.value) || 1
        });

        // Mostrar u ocultar componentes de resultados
        if (savingsHeroBanner) savingsHeroBanner.classList.remove('hidden');
        if (comparisonMatrix) comparisonMatrix.classList.remove('hidden');
        if (scheduleTriggerBtn) scheduleTriggerBtn.classList.remove('hidden');

        // Actualizar Banner Hero de Ahorro
        if (savingsHeroAmount) {
            savingsHeroAmount.innerHTML = `<span class="currency">$</span>${formatCurrency(simulation.interestSaved)}`;
        }
        if (savingsPctChip) {
            savingsPctChip.textContent = `-${simulation.percentInterestSaved.toFixed(1)}%`;
        }
        if (savingsHeroFooter) {
            const durationStr = AmortizationEngine.formatDuration(simulation.newMonths);
            const savedDurationStr = AmortizationEngine.formatDuration(simulation.monthsSaved);
            if (simulation.monthsSaved > 0) {
                savingsHeroFooter.innerHTML = `Liquidación en <strong>${durationStr}</strong> (¡Te ahorras <strong>${savedDurationStr}</strong> de deuda!)`;
            } else {
                savingsHeroFooter.innerHTML = `Liquidación en <strong>${durationStr}</strong>`;
            }
        }

        // Actualizar Matriz Comparativa (Original vs Anticipado)
        updateComparisonMatrix(simulation);

        // Actualizar Tabla de Cronograma de Pagos
        updateScheduleTable(simulation.schedule);

        if (window.lucide) window.lucide.createIcons();
    };

    const updateComparisonMatrix = (sim) => {
        const origPlan = sim.originalPlan;

        const elOrigMonths = document.getElementById('matrix-orig-months');
        const elOrigPayment = document.getElementById('matrix-orig-payment');
        const elOrigInterest = document.getElementById('matrix-orig-interest');
        const elOrigTotal = document.getElementById('matrix-orig-total');

        const elNewMonths = document.getElementById('matrix-new-months');
        const elNewPayment = document.getElementById('matrix-new-payment');
        const elNewInterest = document.getElementById('matrix-new-interest');
        const elNewTotal = document.getElementById('matrix-new-total');

        if (elOrigMonths) elOrigMonths.textContent = `${origPlan.months} meses (${(origPlan.months / 12).toFixed(1)} años)`;
        if (elOrigPayment) elOrigPayment.textContent = `$${formatCurrency(origPlan.monthlyPayment)}`;
        if (elOrigInterest) elOrigInterest.textContent = `$${formatCurrency(origPlan.totalInterest)}`;
        if (elOrigTotal) elOrigTotal.textContent = `$${formatCurrency(origPlan.totalPayment)}`;

        if (elNewMonths) {
            const timeSavedNotice = sim.monthsSaved > 0 ? ` (-${sim.monthsSaved} m)` : '';
            elNewMonths.textContent = `${sim.newMonths} meses${timeSavedNotice}`;
        }
        if (elNewPayment) {
            elNewPayment.textContent = `$${formatCurrency(sim.targetPayment)}`;
        }
        if (elNewInterest) {
            elNewInterest.textContent = `$${formatCurrency(sim.totalInterestPaid)}`;
        }
        if (elNewTotal) {
            elNewTotal.textContent = `$${formatCurrency(sim.totalPaid)}`;
        }
    };

    const updateScheduleTable = (schedule) => {
        if (!scheduleTableBody) return;
        scheduleTableBody.innerHTML = '';

        schedule.forEach(row => {
            const tr = document.createElement('tr');
            if (row.remainingBalance <= 0) {
                tr.classList.add('paid-off-row');
            }

            tr.innerHTML = `
                <td>${row.month}</td>
                <td>$${formatCurrency(row.payment)}</td>
                <td>$${formatCurrency(row.interestPaid)}</td>
                <td>$${formatCurrency(row.principalPaid)}</td>
                <td>$${formatCurrency(row.remainingBalance)}</td>
            `;
            scheduleTableBody.appendChild(tr);
        });
    };

    return {
        init,
        update,
        isEnabled
    };
})();

if (typeof window !== 'undefined') {
    window.EarlyPaymentUI = EarlyPaymentUI;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EarlyPaymentUI;
}
