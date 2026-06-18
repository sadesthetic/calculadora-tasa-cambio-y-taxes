// DOM Elements
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

// Initialize Rates from LocalStorage or Defaults
const initApp = () => {
    // Re-render icons
    lucide.createIcons();

    // Theme setup
    setBgTheme(getSavedTheme());

    // Event listeners
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        setBgTheme(currentTheme === 'light' ? 'dark' : 'light');
    });

    // Load saved rates or set standard Venezuelan rates as initial example
    taxAmountInput.value = localStorage.getItem('calc_tax_amount') || '100';
    rateBankInput.value = localStorage.getItem('calc_rate_bank') || '39.60';
    rateStreetInput.value = localStorage.getItem('calc_rate_street') || '45.50';

    // Calculate initial
    calculate();

    // Listen to changes
    [taxAmountInput, rateBankInput, rateStreetInput].forEach(input => {
        input.addEventListener('input', () => {
            // Save settings to localstorage
            localStorage.setItem('calc_tax_amount', taxAmountInput.value);
            localStorage.setItem('calc_rate_bank', rateBankInput.value);
            localStorage.setItem('calc_rate_street', rateStreetInput.value);
            
            calculate();
        });
    });
};

// Helper function to format currency
const formatCurrency = (val, symbol = '') => {
    return new Intl.NumberFormat('es-VE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(val);
};

// Main calculation logic
const calculate = () => {
    const taxUsd = parseFloat(taxAmountInput.value) || 0;
    const rateBank = parseFloat(rateBankInput.value) || 0;
    const rateStreet = parseFloat(rateStreetInput.value) || 0;

    // Default displays if calculation is not possible
    if (taxUsd <= 0 || rateBank <= 0 || rateStreet <= 0) {
        resetOutputs();
        return;
    }

    // 1. Bolivares to pay (Official Bank Rate)
    const vesToPay = taxUsd * rateBank;

    // 2. Real dollars needed when selling at street rate to get those Bolivares
    const usdNeededReal = vesToPay / rateStreet;

    // 3. Total savings in USD
    const savingUsd = taxUsd - usdNeededReal;

    // 4. Equivalent savings in Bolivares (valued at street rate)
    const savingVes = savingUsd * rateStreet;

    // 5. Savings percentage
    // Formulas: (savingUsd / taxUsd) * 100 = (1 - (rateBank / rateStreet)) * 100
    let savingPct = 0;
    if (rateStreet > 0) {
        savingPct = (1 - (rateBank / rateStreet)) * 100;
    }

    // 6. Conversion Factor
    const conversionFactor = rateBank / rateStreet;

    // Update outputs in UI
    savingPctBadge.textContent = `${savingPct.toFixed(2)}%`;
    
    // Animate/Update main savings
    animateValue(savingUsdMain, parseFloat(savingUsdMain.textContent) || 0, savingUsd, 300, '$');
    savingVesMain.textContent = `${formatCurrency(savingVes)} Bs.`;
    
    vesToPayEl.textContent = formatCurrency(vesToPay);
    usdNeededRealEl.textContent = formatCurrency(usdNeededReal);

    // Update footer factors
    conversionFactorDisplay.textContent = conversionFactor.toFixed(4);
    streetFactorDisplay.textContent = `$${conversionFactor.toFixed(4)}`;

    // Update Progress Bar
    const spentPercent = (usdNeededReal / taxUsd) * 100;
    const savedPercent = (savingUsd / taxUsd) * 100;

    progressBarSpent.style.width = `${spentPercent}%`;
    progressBarSaved.style.width = `${savedPercent}%`;

    // Update progress bar labels
    barOriginalLabel.textContent = `$${formatCurrency(taxUsd)}`;
    barSpentLabel.textContent = `$${formatCurrency(usdNeededReal)}`;
};

const resetOutputs = () => {
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

// Counter animation helper
function animateValue(obj, start, end, duration, prefix = '') {
    if (isNaN(start)) start = 0;
    if (isNaN(end)) end = 0;
    
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentVal = progress * (end - start) + start;
        obj.innerHTML = currentVal.toFixed(2);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            obj.innerHTML = end.toFixed(2);
        }
    };
    window.requestAnimationFrame(step);
}

// Fire initialization on load
window.addEventListener('DOMContentLoaded', initApp);
