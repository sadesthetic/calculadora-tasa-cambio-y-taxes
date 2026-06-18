// DOM Elements - Exchange Rate Calculator
const taxAmountInput = document.getElementById('tax-amount');
const rateBankInput = document.getElementById('rate-bank');
const rateStreetInput = document.getElementById('rate-street');

const savingPctBadge = document.getElementById('saving-pct-badge');
const savingUsdMain = document.getElementById('saving-usd-main');
const savingVesMain = document.getElementById('saving-ves-main');

const vesToPayEl = document.getElementById('ves-to-pay');
const usdNeededRealEl = document.getElementById('usd-needed-real');

const barOriginalLabel = document.getElementById('bar-original-label');
const barSpentLabel = document.getElementById('bar-spent-label');
const progressBarSpent = document.getElementById('progress-bar-spent');
const progressBarSaved = document.getElementById('progress-bar-saved');

const conversionFactorDisplay = document.getElementById('conversion-factor-display');
const streetFactorDisplay = document.getElementById('street-factor-display');

// DOM Elements - APR Calculator
const aprModeSelect = document.getElementById('apr-mode');
const aprPrincipalInput = document.getElementById('apr-principal');
const aprRateInput = document.getElementById('apr-rate');
const aprTimeInput = document.getElementById('apr-time');
const aprTimeUnitSelect = document.getElementById('apr-time-unit');
const aprCompoundingSelect = document.getElementById('apr-compounding');

// Labels to be updated dynamically based on mode
const aprPrincipalLabel = document.getElementById('apr-principal-label');
const aprPrincipalHelper = document.getElementById('apr-principal-helper');
const aprCompoundingLabel = document.getElementById('apr-compounding-label');
const aprCompoundingHelper = document.getElementById('apr-compounding-helper');
const aprBadgeText = document.getElementById('apr-badge-text');
const aprTotalLabel = document.getElementById('apr-total-label');
const aprInterestSubLabel = document.getElementById('apr-interest-sub-label');
const barPrincipalTitle = document.getElementById('bar-principal-title');
const barInterestTitle = document.getElementById('bar-interest-title');
const legendPrincipalText = document.getElementById('legend-principal-text');
const legendInterestText = document.getElementById('legend-interest-text');
const detailInterestTitle = document.getElementById('detail-interest-title');
const detailInterestDesc = document.getElementById('detail-interest-desc');
const detailPaymentTitle = document.getElementById('detail-payment-title');
const detailPaymentDesc = document.getElementById('detail-payment-desc');

const aprTotalMain = document.getElementById('apr-total-main');
const aprInterestSub = document.getElementById('apr-interest-sub');
const aprInterestDetail = document.getElementById('apr-interest-detail');
const aprMonthlyDetail = document.getElementById('apr-monthly-detail');
let aprApyDisplay = document.getElementById('apr-apy-display');

const barPrincipalLabel = document.getElementById('bar-principal-label');
const barInterestLabel = document.getElementById('bar-interest-label');
const progressBarPrincipal = document.getElementById('progress-bar-principal');
const progressBarInterest = document.getElementById('progress-bar-interest');

// DOM Elements - App Navigation & Footer Info
const navTabs = document.querySelectorAll('.nav-tab');
const appViews = document.querySelectorAll('.app-view');
const infoExchangeFooter = document.getElementById('info-exchange-footer');
const infoAprFooter = document.getElementById('info-apr-footer');
const themeToggleBtn = document.getElementById('theme-toggle');

// Initialize theme
const getSavedTheme = () => localStorage.getItem('theme') || 'dark';
const setBgTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update theme toggle icon
    const themeIcon = themeToggleBtn.querySelector('i');
    if (themeIcon) {
        if (theme === 'light') {
            themeIcon.setAttribute('data-lucide', 'sun');
        } else {
            themeIcon.setAttribute('data-lucide', 'moon');
        }
        // Re-render Lucide icons
        lucide.createIcons();
    }
};

// Tabs Switching Logic
const initNavigation = () => {
    // Check for last active view
    const lastActiveView = localStorage.getItem('active_view') || 'view-exchange';
    switchView(lastActiveView);

    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetViewId = tab.getAttribute('data-target');
            switchView(targetViewId);
        });
    });
};

const switchView = (viewId) => {
    // Update Active Tab Class
    navTabs.forEach(t => {
        if (t.getAttribute('data-target') === viewId) {
            t.classList.add('active');
        } else {
            t.classList.remove('active');
        }
    });

    // Update Active View Visibility
    appViews.forEach(view => {
        if (view.id === viewId) {
            view.classList.add('active');
        } else {
            view.classList.remove('active');
        }
    });

    // Toggle Footer Info
    if (viewId === 'view-exchange') {
        infoExchangeFooter.classList.remove('hidden');
        infoAprFooter.classList.add('hidden');
    } else {
        infoExchangeFooter.classList.add('hidden');
        infoAprFooter.classList.remove('hidden');
    }

    // Cache active view
    localStorage.setItem('active_view', viewId);
};

// APR Calculator Configurations based on selected mode (Investment vs Loan)
const APR_MODES_CONFIG = {
    investment: {
        principalLabel: 'Monto Principal (Capital Inicial)',
        principalHelper: 'El monto de dinero invertido originalmente.',
        compoundingLabel: 'Tipo de Interés / Capitalización',
        compoundingHelper: 'Frecuencia con la que se suma el interés al capital.',
        badgeText: 'Retorno Estimado',
        totalLabel: 'Balance Total Estimado',
        interestSubLabel: 'Intereses totales:',
        barPrincipalTitle: 'Principal',
        barInterestTitle: 'Intereses',
        legendPrincipalText: 'Capital Inicial',
        legendInterestText: 'Interés Acumulado',
        detailInterestTitle: 'Interés Generado',
        detailInterestDesc: 'Monto total ganado por intereses.',
        detailPaymentTitle: 'Rendimiento Mensual',
        detailPaymentDesc: 'Ganancia mensual promedio equivalente.',
        footerText: '<strong>Tasa de Rendimiento Efectiva (APY):</strong> <span id="apr-apy-display">0.00%</span> (Refleja el interés real considerando la capitalización)',
        compoundingOptions: [
            { value: 'simple', text: 'Interés Simple (Sin reinversión)' },
            { value: 'monthly', text: 'Compuesto - Mensual' },
            { value: 'annually', text: 'Compuesto - Anual' }
        ],
        defaultCompounding: 'annually'
    },
    loan: {
        principalLabel: 'Monto del Préstamo (Principal)',
        principalHelper: 'El monto total de la deuda solicitada.',
        compoundingLabel: 'Método de Pago / Amortización',
        compoundingHelper: 'Estructura en la que se devuelve el préstamo.',
        badgeText: 'Pago Estimado',
        totalLabel: 'Total a Pagar',
        interestSubLabel: 'Intereses totales a pagar:',
        barPrincipalTitle: 'Préstamo',
        barInterestTitle: 'Costo de Interés',
        legendPrincipalText: 'Capital Prestado',
        legendInterestText: 'Intereses Totales',
        detailInterestTitle: 'Interés Pagado',
        detailInterestDesc: 'Monto total pagado en intereses.',
        detailPaymentTitle: 'Cuota Mensual',
        detailPaymentDesc: 'Cuota mensual amortizada (Principal + Intereses).',
        footerText: '<strong>Tasa de Costo Efectivo (CAT / APY):</strong> <span id="apr-apy-display">0.00%</span> (Refleja el costo real del préstamo considerando la capitalización)',
        compoundingOptions: [
            { value: 'amortized', text: 'Cuota Fija (Amortización Francesa)' },
            { value: 'bullet', text: 'Pago Único (Capital + Interés al final)' }
        ],
        defaultCompounding: 'amortized'
    }
};

const updateAprUiAndOptions = (mode, selectedCompounding = null) => {
    const config = APR_MODES_CONFIG[mode];
    if (!config) return;

    // Update labels and helper texts
    aprPrincipalLabel.textContent = config.principalLabel;
    aprPrincipalHelper.textContent = config.principalHelper;
    aprCompoundingLabel.textContent = config.compoundingLabel;
    aprCompoundingHelper.textContent = config.compoundingHelper;
    aprBadgeText.textContent = config.badgeText;
    aprTotalLabel.textContent = config.totalLabel;
    aprInterestSubLabel.textContent = config.interestSubLabel;
    barPrincipalTitle.textContent = config.barPrincipalTitle;
    barInterestTitle.textContent = config.barInterestTitle;
    legendPrincipalText.textContent = config.legendPrincipalText;
    legendInterestText.textContent = config.legendInterestText;
    detailInterestTitle.textContent = config.detailInterestTitle;
    detailInterestDesc.textContent = config.detailInterestDesc;
    detailPaymentTitle.textContent = config.detailPaymentTitle;
    detailPaymentDesc.textContent = config.detailPaymentDesc;

    // Update Footer HTML
    infoAprFooter.innerHTML = `<p>${config.footerText}</p>`;
    // Re-bind aprApyDisplay element reference
    aprApyDisplay = document.getElementById('apr-apy-display');

    // Update Compounding Select Options
    aprCompoundingSelect.innerHTML = '';
    config.compoundingOptions.forEach(opt => {
        const optionEl = document.createElement('option');
        optionEl.value = opt.value;
        optionEl.textContent = opt.text;
        aprCompoundingSelect.appendChild(optionEl);
    });

    // Set value
    const targetCompounding = selectedCompounding || localStorage.getItem('apr_compounding') || config.defaultCompounding;
    const exists = config.compoundingOptions.some(opt => opt.value === targetCompounding);
    aprCompoundingSelect.value = exists ? targetCompounding : config.defaultCompounding;
    localStorage.setItem('apr_compounding', aprCompoundingSelect.value);
};

// Initialize Rates and Forms
const initApp = () => {
    // Re-render icons
    lucide.createIcons();

    // Theme and Navigation setup
    setBgTheme(getSavedTheme());
    initNavigation();

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        setBgTheme(currentTheme === 'light' ? 'dark' : 'light');
    });

    // --- Exchange Calculator Setup ---
    taxAmountInput.value = localStorage.getItem('calc_tax_amount') || '100';
    rateBankInput.value = localStorage.getItem('calc_rate_bank') || '39.60';
    rateStreetInput.value = localStorage.getItem('calc_rate_street') || '45.50';

    calculateExchange();

    [taxAmountInput, rateBankInput, rateStreetInput].forEach(input => {
        input.addEventListener('input', () => {
            localStorage.setItem('calc_tax_amount', taxAmountInput.value);
            localStorage.setItem('calc_rate_bank', rateBankInput.value);
            localStorage.setItem('calc_rate_street', rateStreetInput.value);
            calculateExchange();
        });
    });

    // --- APR Calculator Setup ---
    const aprMode = localStorage.getItem('apr_mode') || 'investment';
    aprModeSelect.value = aprMode;
    aprPrincipalInput.value = localStorage.getItem('apr_principal') || '1000';
    aprRateInput.value = localStorage.getItem('apr_rate') || '12';
    aprTimeInput.value = localStorage.getItem('apr_time') || '12';
    aprTimeUnitSelect.value = localStorage.getItem('apr_time_unit') || 'months';

    // Populate dynamic UI labels and compounding select based on current mode
    updateAprUiAndOptions(aprMode);

    calculateApr();

    // Mode listener
    aprModeSelect.addEventListener('change', () => {
        const mode = aprModeSelect.value;
        localStorage.setItem('apr_mode', mode);
        updateAprUiAndOptions(mode);
        calculateApr();
    });

    [aprPrincipalInput, aprRateInput, aprTimeInput, aprTimeUnitSelect, aprCompoundingSelect].forEach(input => {
        input.addEventListener('input', () => {
            localStorage.setItem('apr_principal', aprPrincipalInput.value);
            localStorage.setItem('apr_rate', aprRateInput.value);
            localStorage.setItem('apr_time', aprTimeInput.value);
            localStorage.setItem('apr_time_unit', aprTimeUnitSelect.value);
            localStorage.setItem('apr_compounding', aprCompoundingSelect.value);
            calculateApr();
        });
    });
};

// Helper function to format currency
const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-VE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(val);
};

// Exchange Rate Calculations
const calculateExchange = () => {
    const taxUsd = parseFloat(taxAmountInput.value) || 0;
    const rateBank = parseFloat(rateBankInput.value) || 0;
    const rateStreet = parseFloat(rateStreetInput.value) || 0;

    if (taxUsd <= 0 || rateBank <= 0 || rateStreet <= 0) {
        resetExchangeOutputs();
        return;
    }

    const vesToPay = taxUsd * rateBank;
    const usdNeededReal = vesToPay / rateStreet;
    const savingUsd = taxUsd - usdNeededReal;
    const savingVes = savingUsd * rateStreet;

    let savingPct = 0;
    if (rateStreet > 0) {
        savingPct = (1 - (rateBank / rateStreet)) * 100;
    }

    const conversionFactor = rateBank / rateStreet;

    savingPctBadge.textContent = `${savingPct.toFixed(2)}%`;
    animateValue(savingUsdMain, parseFloat(savingUsdMain.textContent) || 0, savingUsd, 300);
    savingVesMain.textContent = `${formatCurrency(savingVes)} Bs.`;
    
    vesToPayEl.textContent = formatCurrency(vesToPay);
    usdNeededRealEl.textContent = formatCurrency(usdNeededReal);

    conversionFactorDisplay.textContent = conversionFactor.toFixed(4);
    streetFactorDisplay.textContent = `$${conversionFactor.toFixed(4)}`;

    const spentPercent = (usdNeededReal / taxUsd) * 100;
    const savedPercent = (savingUsd / taxUsd) * 100;

    progressBarSpent.style.width = `${spentPercent}%`;
    progressBarSaved.style.width = `${savedPercent}%`;

    barOriginalLabel.textContent = `$${formatCurrency(taxUsd)}`;
    barSpentLabel.textContent = `$${formatCurrency(usdNeededReal)}`;
};

const resetExchangeOutputs = () => {
    savingPctBadge.textContent = '0.00%';
    savingUsdMain.textContent = '0.00';
    savingVesMain.textContent = '0,00 Bs.';
    vesToPayEl.textContent = '0,00';
    usdNeededRealEl.textContent = '0,00';
    conversionFactorDisplay.textContent = '1.0000';
    streetFactorDisplay.textContent = '$1.00';
    progressBarSpent.style.width = '100%';
    progressBarSaved.style.width = '0%';
    barOriginalLabel.textContent = '$0,00';
    barSpentLabel.textContent = '$0,00';
};

// APR / Interest Calculations
const calculateApr = () => {
    const mode = aprModeSelect.value;
    const principal = parseFloat(aprPrincipalInput.value) || 0;
    const aprRate = parseFloat(aprRateInput.value) || 0;
    const timeVal = parseFloat(aprTimeInput.value) || 0;
    const timeUnit = aprTimeUnitSelect.value;
    const compounding = aprCompoundingSelect.value;

    if (principal <= 0 || aprRate < 0 || timeVal <= 0) {
        resetAprOutputs();
        return;
    }

    // Convert time to years and months
    const timeYears = timeUnit === 'months' ? timeVal / 12 : timeVal;
    const timeMonths = timeUnit === 'months' ? timeVal : timeVal * 12;

    let finalAmount = 0;
    let interestEarned = 0;
    let apy = aprRate;
    let monthlyPayment = 0;

    if (mode === 'investment') {
        if (compounding === 'simple') {
            interestEarned = principal * (aprRate / 100) * timeYears;
            finalAmount = principal + interestEarned;
            apy = aprRate;
        } else if (compounding === 'monthly') {
            finalAmount = principal * Math.pow(1 + (aprRate / 1200), 12 * timeYears);
            interestEarned = finalAmount - principal;
            apy = (Math.pow(1 + (aprRate / 1200), 12) - 1) * 100;
        } else if (compounding === 'annually') {
            finalAmount = principal * Math.pow(1 + (aprRate / 100), timeYears);
            interestEarned = finalAmount - principal;
            apy = aprRate;
        }
        monthlyPayment = interestEarned / timeMonths; // average monthly yield
    } else if (mode === 'loan') {
        if (compounding === 'amortized') {
            const monthlyRate = (aprRate / 100) / 12;
            if (monthlyRate > 0 && timeMonths > 0) {
                monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, timeMonths)) / (Math.pow(1 + monthlyRate, timeMonths) - 1);
            } else if (timeMonths > 0) {
                monthlyPayment = principal / timeMonths;
            }
            finalAmount = monthlyPayment * timeMonths;
            interestEarned = finalAmount - principal;
            // Effective annual interest rate (APY) for loan compounding monthly
            apy = (Math.pow(1 + (aprRate / 1200), 12) - 1) * 100;
        } else if (compounding === 'bullet') {
            interestEarned = principal * (aprRate / 100) * timeYears;
            finalAmount = principal + interestEarned;
            monthlyPayment = finalAmount; // paid as a single payment at the end
            apy = aprRate;
        }
    }

    // Update UI elements
    animateValue(aprTotalMain, parseFloat(aprTotalMain.textContent) || 0, finalAmount);
    aprInterestSub.textContent = `$${formatCurrency(interestEarned)} USD`;
    aprInterestDetail.textContent = formatCurrency(interestEarned);
    aprMonthlyDetail.textContent = formatCurrency(monthlyPayment);
    if (aprApyDisplay) {
        aprApyDisplay.textContent = `${apy.toFixed(2)}%`;
    }

    // Update Progress Bar
    const principalPercent = (principal / finalAmount) * 100;
    const interestPercent = (interestEarned / finalAmount) * 100;

    progressBarPrincipal.style.width = `${principalPercent}%`;
    progressBarInterest.style.width = `${interestPercent}%`;

    barPrincipalLabel.textContent = `$${formatCurrency(principal)}`;
    barInterestLabel.textContent = `$${formatCurrency(interestEarned)}`;
};

const resetAprOutputs = () => {
    aprTotalMain.textContent = '0.00';
    aprInterestSub.textContent = '$0.00 USD';
    aprInterestDetail.textContent = '0.00';
    aprMonthlyDetail.textContent = '0.00';
    if (aprApyDisplay) {
        aprApyDisplay.textContent = '0.00%';
    }
    progressBarPrincipal.style.width = '100%';
    progressBarInterest.style.width = '0%';
    barPrincipalLabel.textContent = '$0.00';
    barInterestLabel.textContent = '$0.00';
};

// Counter animation helper
function animateValue(obj, start, end, duration = 300) {
    if (isNaN(start)) start = 0;
    if (isNaN(end)) end = 0;
    
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentVal = progress * (end - start) + start;
        obj.innerHTML = currentVal.toLocaleString('es-VE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            obj.innerHTML = end.toLocaleString('es-VE', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
    };
    window.requestAnimationFrame(step);
}

// Fire initialization on load
window.addEventListener('DOMContentLoaded', initApp);
