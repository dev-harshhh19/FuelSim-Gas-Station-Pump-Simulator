document.addEventListener('DOMContentLoaded', () => {
    // Constants
    const UPDATE_INTERVAL = 100; // ms
    const PRICE_UPDATE_INTERVAL = 300000; // 5 min
    const COUNTING_SPEED = 12; // ₹12 per second

    // Elements
    const petrolBtn = document.getElementById('petrolBtn');
    const dieselBtn = document.getElementById('dieselBtn');
    const xfuelBtn = document.getElementById('xfuelBtn');
    const calcModeSelect = document.getElementById('calcModeSelect');
    const amountInput = document.getElementById('amountInput');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const resetBtn = document.getElementById('resetBtn');
    const summaryFuel = document.getElementById('summaryFuel');
    const summaryQuantity = document.getElementById('summaryQuantity');
    const summaryPrice = document.getElementById('summaryPrice');
    const summaryTotal = document.getElementById('summaryTotal');
    const clickSound = document.getElementById('clickSound');
    const pumpSound = document.getElementById('pumpSound');
    const completeSound = document.getElementById('completeSound');
    const fuelBtns = [petrolBtn, dieselBtn, xfuelBtn];
    const body = document.body;

    // State
    let selectedFuel = 'petrol';
    let calculationType = calcModeSelect.value;
    let currentPrices = { petrol: 106.20, diesel: 93.10, xfuel: 120.00 };
    let targetAmount = 0;
    let currentAmount = 0;
    let isPumping = false;
    let updateInterval;

    // --- UI Update Functions ---
    function updateSummary() {
        summaryFuel.textContent = selectedFuel.charAt(0).toUpperCase() + selectedFuel.slice(1);
        summaryPrice.textContent = `₹${currentPrices[selectedFuel].toFixed(2)}`;
        if (calculationType === 'liters') {
            summaryQuantity.textContent = `${currentAmount.toFixed(2)} L`;
            summaryTotal.textContent = `₹${(currentAmount * currentPrices[selectedFuel]).toFixed(2)}`;
        } else {
            summaryQuantity.textContent = `${(currentAmount / currentPrices[selectedFuel]).toFixed(2)} L`;
            summaryTotal.textContent = `₹${currentAmount.toFixed(2)}`;
        }
    }

    function resetSummary() {
        currentAmount = 0;
        updateSummary();
    }

    function updateAmountPlaceholder() {
        amountInput.placeholder = calculationType === 'liters' ? 'Enter liters' : 'Enter price';
    }

    function updateTheme() {
        body.classList.remove('theme-petrol', 'theme-diesel', 'theme-xfuel');
        if (selectedFuel === 'petrol') body.classList.add('theme-petrol');
        else if (selectedFuel === 'diesel') body.classList.add('theme-diesel');
        else if (selectedFuel === 'xfuel') body.classList.add('theme-xfuel');
    }

    // --- Event Handlers ---
    petrolBtn.addEventListener('click', () => selectFuel('petrol'));
    dieselBtn.addEventListener('click', () => selectFuel('diesel'));
    xfuelBtn.addEventListener('click', () => selectFuel('xfuel'));

    function selectFuel(fuel) {
        selectedFuel = fuel;
        fuelBtns.forEach(btn => btn.classList.remove('active'));
        if (fuel === 'petrol') petrolBtn.classList.add('active');
        if (fuel === 'diesel') dieselBtn.classList.add('active');
        if (fuel === 'xfuel') xfuelBtn.classList.add('active');
        playClick();
        updateTheme();
        resetSummary();
    }

    calcModeSelect.addEventListener('change', () => {
        calculationType = calcModeSelect.value;
        playClick();
        updateAmountPlaceholder();
        resetSummary();
    });
    amountInput.addEventListener('input', () => {
        playClick();
        resetSummary();
    });

    startBtn.addEventListener('click', () => {
        if (isPumping) return;
        const amount = parseFloat(amountInput.value);
        if (isNaN(amount) || amount <= 0) {
            amountInput.classList.add('ring-2', 'ring-red-400');
            setTimeout(() => amountInput.classList.remove('ring-2', 'ring-red-400'), 1000);
            return;
        }
        targetAmount = amount;
        isPumping = true;
        startBtn.disabled = true;
        stopBtn.disabled = false;
        amountInput.disabled = true;
        pumpSound.currentTime = 0;
        pumpSound.play();
        updateInterval = setInterval(updatePump, UPDATE_INTERVAL);
    });

    stopBtn.addEventListener('click', () => {
        if (!isPumping) return;
        isPumping = false;
        startBtn.disabled = false;
        stopBtn.disabled = true;
        amountInput.disabled = false;
        pumpSound.pause();
        completeSound.play();
        clearInterval(updateInterval);
    });

    resetBtn.addEventListener('click', () => {
        isPumping = false;
        startBtn.disabled = false;
        stopBtn.disabled = true;
        amountInput.disabled = false;
        amountInput.value = '';
        pumpSound.pause();
        clearInterval(updateInterval);
        resetSummary();
    });

    // --- Pump Logic ---
    function updatePump() {
        if (!isPumping) return;
        let increment;
        if (calculationType === 'liters') {
            increment = COUNTING_SPEED / currentPrices[selectedFuel] * (UPDATE_INTERVAL / 1000);
            currentAmount = Math.min(currentAmount + increment, targetAmount);
        } else {
            increment = COUNTING_SPEED * (UPDATE_INTERVAL / 1000);
            currentAmount = Math.min(currentAmount + increment, targetAmount);
        }
        updateSummary();
        if (currentAmount >= targetAmount) {
            isPumping = false;
            startBtn.disabled = false;
            stopBtn.disabled = true;
            amountInput.disabled = false;
            pumpSound.pause();
            completeSound.play();
            clearInterval(updateInterval);
        }
    }

    // --- Price Update Simulation ---
    function updateFuelPrices() {
        // Simulate price change
        const change = (Math.random() - 0.5) * 0.5;
        currentPrices.petrol = Math.max(90, Math.min(120, currentPrices.petrol + change));
        currentPrices.diesel = Math.max(80, Math.min(110, currentPrices.diesel + change));
        currentPrices.xfuel = Math.max(100, Math.min(130, currentPrices.xfuel + change));
        updateSummary();
    }
    setInterval(updateFuelPrices, PRICE_UPDATE_INTERVAL);

    // --- Sound ---
    function playClick() {
        clickSound.currentTime = 0;
        clickSound.play();
    }

    // --- Init ---
    resetSummary();
    stopBtn.disabled = true;
    // Set default active
    selectFuel('petrol');
    updateAmountPlaceholder();
    updateTheme();

    // --- Feedback & Bug Reporting System ---
    
    // Feedback Form Handler
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFeedbackSubmission();
        });
    }

    // Bug Report Form Handler
    const bugReportForm = document.getElementById('bugReportForm');
    if (bugReportForm) {
        bugReportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleBugReportSubmission();
        });
    }

    function handleFeedbackSubmission() {
        const name = document.getElementById('feedbackName').value.trim();
        const email = document.getElementById('feedbackEmail').value.trim();
        const type = document.getElementById('feedbackType').value;
        const message = document.getElementById('feedbackMessage').value.trim();

        if (!message) {
            showStatus('Please enter a message', 'error');
            return;
        }

        // Simulate sending feedback (in real app, this would send to server)
        const feedbackData = {
            name: name || 'Anonymous',
            email: email || 'No email provided',
            type: type,
            message: message,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            currentFuel: selectedFuel,
            currentMode: calculationType
        };

        console.log('Feedback submitted:', feedbackData);
        
        // Show success message
        showStatus('Thank you for your feedback! We appreciate your input.', 'success');
        
        // Reset form
        feedbackForm.reset();
        
        // Play success sound
        playClick();
    }

    function handleBugReportSubmission() {
        const title = document.getElementById('bugTitle').value.trim();
        const severity = document.getElementById('bugSeverity').value;
        const steps = document.getElementById('bugSteps').value.trim();
        const details = document.getElementById('bugDetails').value.trim();

        if (!title || !steps) {
            showStatus('Please fill in the bug title and steps to reproduce', 'error');
            return;
        }

        // Simulate sending bug report (in real app, this would send to server)
        const bugData = {
            title: title,
            severity: severity,
            steps: steps,
            details: details || 'No additional details provided',
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            currentFuel: selectedFuel,
            currentMode: calculationType,
            url: window.location.href
        };

        console.log('Bug report submitted:', bugData);
        
        // Show success message
        showStatus('Bug report submitted successfully! We\'ll investigate this issue.', 'success');
        
        // Reset form
        bugReportForm.reset();
        
        // Play success sound
        playClick();
    }

    function submitQuickFeedback(type) {
        const feedbackMessages = {
            'love': 'We\'re thrilled you love FuelSim! ❤️',
            'good': 'Great to hear you find it good! 👍',
            'okay': 'Thanks for the feedback! We\'ll keep improving.',
            'improve': 'Thanks for letting us know! We\'re always working to improve.'
        };

        const quickFeedbackData = {
            type: type,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            currentFuel: selectedFuel,
            currentMode: calculationType
        };

        console.log('Quick feedback submitted:', quickFeedbackData);
        
        // Show feedback message
        showStatus(feedbackMessages[type], 'success');
        
        // Play click sound
        playClick();
    }

    function showStatus(message, type = 'success') {
        const statusDiv = document.getElementById('feedbackStatus');
        const statusMessage = document.getElementById('statusMessage');
        
        if (statusDiv && statusMessage) {
            statusMessage.textContent = message;
            
            // Update styling based on type
            statusDiv.className = type === 'error' 
                ? 'bg-red-600 text-white p-4 rounded-lg mb-4 text-center' 
                : 'bg-green-600 text-white p-4 rounded-lg mb-4 text-center';
            
            // Show status
            statusDiv.classList.remove('hidden');
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                statusDiv.classList.add('hidden');
            }, 5000);
        }
    }

    // Add smooth scrolling for feedback section
    const feedbackLink = document.querySelector('a[href="#feedback"]');
    if (feedbackLink) {
        feedbackLink.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('feedback').scrollIntoView({behavior: 'smooth'});
        });
    }

    // --- Minimalistic Floating Feedback Button Logic ---
    const feedbackToggleBtn = document.getElementById('feedbackToggleBtn');
    const feedbackPanel = document.getElementById('feedbackPanel');
    const closeFeedbackPanel = document.getElementById('closeFeedbackPanel');
    const miniFeedbackForm = document.getElementById('miniFeedbackForm');
    const miniFeedbackMsg = document.getElementById('miniFeedbackMsg');
    const miniFeedbackStatus = document.getElementById('miniFeedbackStatus');
    const cancelMiniFeedback = document.getElementById('cancelMiniFeedback');

    if (feedbackToggleBtn && feedbackPanel) {
        feedbackToggleBtn.addEventListener('click', () => {
            feedbackPanel.classList.toggle('hidden');
            miniFeedbackStatus.classList.add('hidden');
            miniFeedbackForm.reset();
        });
    }
    if (closeFeedbackPanel) {
        closeFeedbackPanel.addEventListener('click', () => {
            feedbackPanel.classList.add('hidden');
        });
    }
    if (cancelMiniFeedback) {
        cancelMiniFeedback.addEventListener('click', () => {
            feedbackPanel.classList.add('hidden');
        });
    }
    if (miniFeedbackForm) {
        miniFeedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const msg = miniFeedbackMsg.value.trim();
            if (!msg) {
                miniFeedbackStatus.textContent = 'Please enter your feedback or bug report.';
                miniFeedbackStatus.className = 'mt-2 text-center text-red-400 font-semibold';
                miniFeedbackStatus.classList.remove('hidden');
                return;
            }
            // Simulate sending feedback (could be replaced with backend call)
            miniFeedbackStatus.textContent = 'Thank you for your feedback!';
            miniFeedbackStatus.className = 'mt-2 text-center text-green-400 font-semibold';
            miniFeedbackStatus.classList.remove('hidden');
            miniFeedbackForm.reset();
            setTimeout(() => {
                feedbackPanel.classList.add('hidden');
                miniFeedbackStatus.classList.add('hidden');
            }, 2000);
        });
    }

    // --- Quick Guide Modal Logic ---
    const quickGuideBtn = document.getElementById('quickGuideBtn');
    const quickGuideModal = document.getElementById('quickGuideModal');
    const closeQuickGuide = document.getElementById('closeQuickGuide');

    if (quickGuideBtn && quickGuideModal) {
        quickGuideBtn.addEventListener('click', () => {
            quickGuideModal.classList.remove('hidden');
        });
    }
    if (closeQuickGuide && quickGuideModal) {
        closeQuickGuide.addEventListener('click', () => {
            quickGuideModal.classList.add('hidden');
        });
    }
    // Close modal on background click
    if (quickGuideModal) {
        quickGuideModal.addEventListener('click', (e) => {
            if (e.target === quickGuideModal) {
                quickGuideModal.classList.add('hidden');
            }
        });
    }
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && quickGuideModal && !quickGuideModal.classList.contains('hidden')) {
            quickGuideModal.classList.add('hidden');
        }
    });
    const lenis = new Lenis();
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
}); 
