/**
 * FuelSim - Professional Gas Station Simulator
 * Modular Architecture
 */

const FuelSim = (() => {
  // --- Configuration ---
  const CONFIG = {
    PUMP_UPDATE_INTERVAL_MS: 50,
    FLOW_RATE_LITERS_PER_SEC: 1.5,
    PRICES: {
      petrol: 111.20,
      diesel: 97.83,
      xfuel: 120.40
    },
    IDLE_TIMEOUT_MS: 120000,
    PRICE_UPDATE_INTERVAL_MS: 10000
  };

  // --- Application State ---
  const state = {
    selectedFuel: 'petrol',
    calcMode: 'liters', // 'liters' or 'price'
    targetAmount: 0,
    dispensedVolume: 0,
    totalCost: 0,
    isPumping: false,
    intervalId: null,
    idleTimerId: null
  };

  // --- DOM Elements ---
  const elements = {
    body: document.body,
    
    // Inputs
    fuelBtns: document.querySelectorAll('.fuel-btn'),
    calcMode: document.getElementById('calcMode'),
    amountInput: document.getElementById('amountInput'),
    
    // Action Buttons
    startBtn: document.getElementById('startBtn'),
    stopBtn: document.getElementById('stopBtn'),
    resetBtn: document.getElementById('resetBtn'),
    printBtn: document.getElementById('printBtn'),
    copyCryptoBtn: document.getElementById('copyCryptoBtn'),
    
    // Displays
    displayFuel: document.getElementById('displayFuel'),
    displayPrice: document.getElementById('displayPrice'),
    displayVolume: document.getElementById('displayVolume'),
    displayTotal: document.getElementById('displayTotal'),
    
    // Modal
    receiptModal: document.getElementById('receiptModal'),
    closeReceiptBtn: document.getElementById('closeReceiptBtn'),
    
    // Receipt fields
    receiptDate: document.getElementById('receiptDate'),
    receiptFuel: document.getElementById('receiptFuel'),
    receiptUnitPrice: document.getElementById('receiptUnitPrice'),
    receiptVolume: document.getElementById('receiptVolume'),
    receiptTotal: document.getElementById('receiptTotal'),
  };

  // --- Formatting Utilities ---
  const formatters = {
    currency: (value) => `₹${value.toFixed(2)}`,
    volume: (value) => `${value.toFixed(2)} L`,
    capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1)
  };

  // --- Core Logic ---
  
  const getPrice = () => CONFIG.PRICES[state.selectedFuel];

  const updateDisplays = () => {
    elements.displayFuel.textContent = formatters.capitalize(state.selectedFuel);
    elements.displayPrice.textContent = formatters.currency(getPrice());
    elements.displayVolume.textContent = formatters.volume(state.dispensedVolume);
    elements.displayTotal.textContent = formatters.currency(state.totalCost);
  };

  const setFuelType = (type) => {
    if (state.isPumping) return;
    
    // Auto reset if switching fuels and we have dispensed or targeted amount
    if (state.selectedFuel !== type && (state.dispensedVolume > 0 || state.targetAmount > 0)) {
      resetPump();
    }
    
    state.selectedFuel = type;
    elements.body.setAttribute('data-fuel', type);
    
    elements.fuelBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.type === type);
    });
    
    recalculateDerivedState();
    updateDisplays();
  };

  const setCalcMode = (mode) => {
    if (state.isPumping) return;
    
    state.calcMode = mode;
    
    if (mode === 'liters') {
      elements.amountInput.placeholder = "Enter target volume (L)";
      elements.amountInput.step = "0.01";
    } else {
      elements.amountInput.placeholder = "Enter target price (₹)";
      elements.amountInput.step = "1";
    }
  };

  const recalculateDerivedState = () => {
    // If not pumping, ensure volume and cost match
    if (!state.isPumping) {
      if (state.dispensedVolume > 0) {
        state.totalCost = state.dispensedVolume * getPrice();
      }
    }
  };

  const resetPump = () => {
    if (state.isPumping) stopPump();
    
    state.targetAmount = 0;
    state.dispensedVolume = 0;
    state.totalCost = 0;
    elements.amountInput.value = '';
    
    elements.amountInput.disabled = false;
    elements.calcMode.disabled = false;
    
    elements.startBtn.disabled = false;
    elements.stopBtn.disabled = true;
    elements.printBtn.disabled = true;
    
    updateDisplays();
  };

  const startPump = () => {
    if (state.isPumping) return;
    
    const inputValue = parseFloat(elements.amountInput.value);
    
    if (isNaN(inputValue) || inputValue <= 0) {
      elements.amountInput.focus();
      // Brief error indication
      elements.amountInput.style.borderColor = 'var(--color-error)';
      setTimeout(() => elements.amountInput.style.borderColor = '', 1000);
      return;
    }
    
    state.targetAmount = inputValue;
    state.isPumping = true;
    
    // Lock inputs
    elements.amountInput.disabled = true;
    elements.calcMode.disabled = true;
    
    // Toggle buttons
    elements.startBtn.disabled = true;
    elements.stopBtn.disabled = false;
    elements.printBtn.disabled = true;
    
    // Start interval
    const updateStep = CONFIG.PUMP_UPDATE_INTERVAL_MS / 1000; // seconds
    const volumeIncrement = CONFIG.FLOW_RATE_LITERS_PER_SEC * updateStep;
    
    state.intervalId = setInterval(() => {
      pumpTick(volumeIncrement);
    }, CONFIG.PUMP_UPDATE_INTERVAL_MS);
  };

  const stopPump = () => {
    if (!state.isPumping) return;
    
    clearInterval(state.intervalId);
    state.isPumping = false;
    
    elements.startBtn.disabled = false;
    elements.stopBtn.disabled = true;
    elements.printBtn.disabled = false; // Transaction complete, can print
  };

  const pumpTick = (volumeIncrement) => {
    const currentPrice = getPrice();
    let isComplete = false;
    
    if (state.calcMode === 'liters') {
      state.dispensedVolume += volumeIncrement;
      state.totalCost = state.dispensedVolume * currentPrice;
      
      if (state.dispensedVolume >= state.targetAmount) {
        state.dispensedVolume = state.targetAmount;
        state.totalCost = state.dispensedVolume * currentPrice;
        isComplete = true;
      }
    } else {
      // mode === 'price'
      const priceIncrement = volumeIncrement * currentPrice;
      state.totalCost += priceIncrement;
      state.dispensedVolume = state.totalCost / currentPrice;
      
      if (state.totalCost >= state.targetAmount) {
        state.totalCost = state.targetAmount;
        state.dispensedVolume = state.totalCost / currentPrice;
        isComplete = true;
      }
    }
    
    updateDisplays();
    
    if (isComplete) {
      stopPump();
    }
  };

  // --- Receipt Modal ---
  const showReceipt = () => {
    if (state.dispensedVolume === 0) return;
    
    elements.receiptDate.textContent = new Date().toLocaleString();
    elements.receiptFuel.textContent = formatters.capitalize(state.selectedFuel);
    elements.receiptUnitPrice.textContent = `${formatters.currency(getPrice())}/L`;
    elements.receiptVolume.textContent = formatters.volume(state.dispensedVolume);
    elements.receiptTotal.textContent = formatters.currency(state.totalCost);
    
    elements.receiptModal.classList.add('active');
  };

  const hideReceipt = () => {
    elements.receiptModal.classList.remove('active');
  };

  // --- Copy Crypto ---
  const copyCryptoAddress = async () => {
    const address = "0xCd47D300a28E18443D19759D9957c347B86C2E27";
    try {
      await navigator.clipboard.writeText(address);
      const span = elements.copyCryptoBtn.querySelector('span:last-child');
      const originalText = span.textContent;
      span.textContent = "(Copied!)";
      span.style.color = "var(--color-success)";
      
      setTimeout(() => {
        span.textContent = originalText;
        span.style.color = "";
      }, 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  // --- Background Tasks (Idle Timer & Live Prices) ---
  const resetIdleTimer = () => {
    if (state.idleTimerId) clearTimeout(state.idleTimerId);
    state.idleTimerId = setTimeout(() => {
      // Auto reset meters after 120s of inactivity
      if (state.dispensedVolume > 0 || state.targetAmount > 0) {
        resetPump();
        console.log("Pump auto-reset due to 120s inactivity.");
      }
    }, CONFIG.IDLE_TIMEOUT_MS);
  };

  const startLivePrices = () => {
    setInterval(() => {
      // Simulate real-time market fluctuations (+/- 0.05 to 0.15)
      Object.keys(CONFIG.PRICES).forEach(fuel => {
        const fluctuation = (Math.random() - 0.5) * 0.3;
        CONFIG.PRICES[fuel] = Math.max(10, CONFIG.PRICES[fuel] + fluctuation);
      });
      // Only update UI if not currently pumping to avoid layout shifts/distractions
      if (!state.isPumping) {
        updateDisplays();
      }
    }, CONFIG.PRICE_UPDATE_INTERVAL_MS);
  };


  // --- Initialization & Event Binding ---
  const init = () => {
    // Bind Fuel Buttons
    elements.fuelBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        setFuelType(e.target.dataset.type);
      });
    });

    // Bind Calc Mode
    elements.calcMode.addEventListener('change', (e) => {
      setCalcMode(e.target.value);
    });

    // Bind Actions
    elements.startBtn.addEventListener('click', startPump);
    elements.stopBtn.addEventListener('click', stopPump);
    elements.resetBtn.addEventListener('click', resetPump);
    elements.printBtn.addEventListener('click', showReceipt);
    
    // Bind Modal Close
    elements.closeReceiptBtn.addEventListener('click', hideReceipt);
    elements.receiptModal.addEventListener('click', (e) => {
      if (e.target === elements.receiptModal) hideReceipt();
    });

    // Support / Copy
    if (elements.copyCryptoBtn) {
      elements.copyCryptoBtn.addEventListener('click', copyCryptoAddress);
    }

    // Activity bindings for idle timer
    ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach(evt => {
      document.addEventListener(evt, resetIdleTimer, { passive: true });
    });

    // Start background tasks
    resetIdleTimer();
    startLivePrices();

    // Initial render
    setCalcMode(state.calcMode);
    updateDisplays();
  };

  return { init };
})();

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', FuelSim.init);
