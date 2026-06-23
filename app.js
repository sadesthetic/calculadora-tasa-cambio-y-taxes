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
const aprPrincipalInput = document.getElementById('apr-principal');
const aprRateInput = document.getElementById('apr-rate');
const aprTimeInput = document.getElementById('apr-time');
const aprTimeUnitSelect = document.getElementById('apr-time-unit');
const aprCompoundingSelect = document.getElementById('apr-compounding');

const aprTotalMain = document.getElementById('apr-total-main');
const aprInterestSub = document.getElementById('apr-interest-sub');
const aprInterestDetail = document.getElementById('apr-interest-detail');
const aprMonthlyDetail = document.getElementById('apr-monthly-detail');
const aprApyDisplay = document.getElementById('apr-apy-display');

const barPrincipalLabel = document.getElementById('bar-principal-label');
const barInterestLabel = document.getElementById('bar-interest-label');
const progressBarPrincipal = document.getElementById('progress-bar-principal');
const progressBarInterest = document.getElementById('progress-bar-interest');

// DOM Elements - App Navigation & Footer Info
const navTabs = document.querySelectorAll('.nav-tab');
const appViews = document.querySelectorAll('.app-view');
const infoExchangeFooter = document.getElementById('info-exchange-footer');
const infoAprFooter = document.getElementById('info-apr-footer');
const infoAdvalFooter = document.getElementById('info-adval-footer');
const themeToggleBtn = document.getElementById('theme-toggle');

// DOM Elements - Ad Valorem Calculator
const advalValueInput = document.getElementById('adval-value');
const toggleFleteCheckbox = document.getElementById('toggle-flete');
const toggleSeguroCheckbox = document.getElementById('toggle-seguro');
const valFleteInput = document.getElementById('val-flete');
const pctSeguroInput = document.getElementById('pct-seguro');
const valSeguroCalcSpan = document.getElementById('val-seguro-calc');
const advalBadgeRateSpan = document.getElementById('adval-badge-rate');
const advalTotalMain = document.getElementById('adval-total-main');
const advalTaxSub = document.getElementById('adval-tax-sub');

const barFobLabel = document.getElementById('bar-fob-label');
const barTaxLabel = document.getElementById('bar-tax-label');
const progressBarFob = document.getElementById('progress-bar-fob');
const progressBarFleteSeguro = document.getElementById('progress-bar-flete-seguro');
const progressBarAdvalTax = document.getElementById('progress-bar-adval-tax');

const advalCifDetail = document.getElementById('adval-cif-detail');
const advalTaxDetail = document.getElementById('adval-tax-detail');
const advalCifFormula = document.getElementById('adval-cif-formula');

const cardFlete = document.getElementById('card-flete');
const cardSeguro = document.getElementById('card-seguro');
const segmentBtns = document.querySelectorAll('.segment-btn');

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
    infoExchangeFooter.classList.add('hidden');
    infoAprFooter.classList.add('hidden');
    infoAdvalFooter.classList.add('hidden');

    if (viewId === 'view-exchange') {
        infoExchangeFooter.classList.remove('hidden');
    } else if (viewId === 'view-apr') {
        infoAprFooter.classList.remove('hidden');
    } else if (viewId === 'view-advalorem') {
        infoAdvalFooter.classList.remove('hidden');
    }

    // Cache active view
    localStorage.setItem('active_view', viewId);
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
    aprPrincipalInput.value = localStorage.getItem('apr_principal') || '1000';
    aprRateInput.value = localStorage.getItem('apr_rate') || '12';
    aprTimeInput.value = localStorage.getItem('apr_time') || '12';
    aprTimeUnitSelect.value = localStorage.getItem('apr_time_unit') || 'months';
    aprCompoundingSelect.value = localStorage.getItem('apr_compounding') || 'amortized';

    calculateApr();

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

    // --- Ad Valorem Calculator Setup ---
    advalValueInput.value = localStorage.getItem('adval_value') || '15000';
    
    const savedRate = localStorage.getItem('adval_rate') || '37';
    segmentBtns.forEach(btn => {
        if (btn.getAttribute('data-rate') === savedRate) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    toggleFleteCheckbox.checked = localStorage.getItem('adval_toggle_flete') !== 'false';
    toggleSeguroCheckbox.checked = localStorage.getItem('adval_toggle_seguro') !== 'false';
    valFleteInput.value = localStorage.getItem('adval_val_flete') || '3500';
    pctSeguroInput.value = localStorage.getItem('adval_pct_seguro') || '2.5';

    updateCardState(toggleFleteCheckbox, cardFlete);
    updateCardState(toggleSeguroCheckbox, cardSeguro);

    calculateAdValorem();

    [advalValueInput, valFleteInput, pctSeguroInput].forEach(input => {
        input.addEventListener('input', () => {
            localStorage.setItem('adval_value', advalValueInput.value);
            localStorage.setItem('adval_val_flete', valFleteInput.value);
            localStorage.setItem('adval_pct_seguro', pctSeguroInput.value);
            calculateAdValorem();
        });
    });

    toggleFleteCheckbox.addEventListener('change', () => {
        localStorage.setItem('adval_toggle_flete', toggleFleteCheckbox.checked);
        updateCardState(toggleFleteCheckbox, cardFlete);
        calculateAdValorem();
    });

    toggleSeguroCheckbox.addEventListener('change', () => {
        localStorage.setItem('adval_toggle_seguro', toggleSeguroCheckbox.checked);
        updateCardState(toggleSeguroCheckbox, cardSeguro);
        calculateAdValorem();
    });

    segmentBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            segmentBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            localStorage.setItem('adval_rate', btn.getAttribute('data-rate'));
            calculateAdValorem();
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

// APR / Interest Calculations (Loan-only)
const calculateApr = () => {
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

// Ad Valorem Calculations
const calculateAdValorem = () => {
    const fob = parseFloat(advalValueInput.value) || 0;
    const isFleteActive = toggleFleteCheckbox.checked;
    const isSeguroActive = toggleSeguroCheckbox.checked;

    const flete = isFleteActive ? (parseFloat(valFleteInput.value) || 0) : 0;
    const seguroPercent = parseFloat(pctSeguroInput.value) || 0;
    const seguro = isSeguroActive ? (fob * (seguroPercent / 100)) : 0;

    // Update Seguro calculated value display
    valSeguroCalcSpan.textContent = `$${formatCurrency(seguro)}`;

    if (fob <= 0) {
        resetAdValoremOutputs();
        return;
    }

    const cif = fob + flete + seguro;
    
    // Find active rate
    let rate = 37;
    const activeBtn = document.querySelector('.segment-btn.active');
    if (activeBtn) {
        rate = parseFloat(activeBtn.getAttribute('data-rate')) || 37;
    }

    advalBadgeRateSpan.textContent = `${rate}%`;

    const tax = cif * (rate / 100);
    const total = cif + tax;

    // Update main outputs
    animateValue(advalTotalMain, parseFloat(advalTotalMain.textContent) || 0, total);
    advalTaxSub.textContent = `$${formatCurrency(tax)} USD`;
    advalCifDetail.textContent = formatCurrency(cif);
    advalTaxDetail.textContent = formatCurrency(tax);
    advalCifFormula.textContent = `$${formatCurrency(cif)}`;

    // Update Progress Bar
    const fobPercent = (fob / total) * 100;
    const extraPercent = ((flete + seguro) / total) * 100;
    const taxPercent = (tax / total) * 100;

    progressBarFob.style.width = `${fobPercent}%`;
    progressBarFleteSeguro.style.width = `${extraPercent}%`;
    progressBarAdvalTax.style.width = `${taxPercent}%`;

    barFobLabel.textContent = `$${formatCurrency(fob)}`;
    barTaxLabel.textContent = `$${formatCurrency(tax)}`;

    // Update Comparison Table
    const rates = [37, 52, 72];
    rates.forEach(r => {
        const row = document.getElementById(`row-rate-${r}`);
        if (row) {
            const rowTax = cif * (r / 100);
            const rowTotal = cif + rowTax;
            row.querySelector('.tax-col').textContent = `$${formatCurrency(rowTax)}`;
            row.querySelector('.total-col').textContent = `$${formatCurrency(rowTotal)}`;
        }
    });
};

const resetAdValoremOutputs = () => {
    advalTotalMain.textContent = '0.00';
    advalTaxSub.textContent = '$0.00 USD';
    advalCifDetail.textContent = '0.00';
    advalTaxDetail.textContent = '0.00';
    advalCifFormula.textContent = '$0.00';
    valSeguroCalcSpan.textContent = '$0.00';

    progressBarFob.style.width = '100%';
    progressBarFleteSeguro.style.width = '0%';
    progressBarAdvalTax.style.width = '0%';

    barFobLabel.textContent = '$0.00';
    barTaxLabel.textContent = '$0.00';

    [37, 52, 72].forEach(r => {
        const row = document.getElementById(`row-rate-${r}`);
        if (row) {
            row.querySelector('.tax-col').textContent = '$0.00';
            row.querySelector('.total-col').textContent = '$0.00';
        }
    });
};

const updateCardState = (checkbox, card) => {
    if (checkbox.checked) {
        card.classList.add('active');
    } else {
        card.classList.remove('active');
    }
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
