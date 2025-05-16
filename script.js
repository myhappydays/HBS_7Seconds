document.addEventListener('DOMContentLoaded', () => {
    const timerElement = document.getElementById('timer');
    const messageElement = document.getElementById('message');
    const effectContainer = document.getElementById('effect-container');
    const titleElement = document.getElementById('title');
    
    let timer = null;
    let startTime = null;
    let isRunning = false;
    let isWaiting = false;
    let currentTime = 0;
    
    const TARGET_TIME = 7.00;
    const SUCCESS_MARGIN = 0.02; // Within 0.02 seconds is considered a success
    
    // Function to format time to 2 decimal places
    function formatTime(time) {
        return time.toFixed(2);
    }
    
    // Update the timer display
    function updateTimer() {
        if (!isRunning) return;
        
        const now = performance.now();
        currentTime = (now - startTime) / 1000;
        timerElement.textContent = formatTime(currentTime);
        
        requestAnimationFrame(updateTimer);
    }
    
    // Start the timer
    function startTimer() {
        if (isRunning) return;
        
        resetUI();
        isRunning = true;
        isWaiting = false;
        startTime = performance.now();
        timerElement.classList.add('running');
        titleElement.classList.add('hidden');
        
        requestAnimationFrame(updateTimer);
    }
    
    // Stop the timer and show results
    function stopTimer() {
        if (!isRunning) return;
        
        isRunning = false;
        isWaiting = true;
        timerElement.classList.remove('running');
        
        const timeDifference = Math.abs(currentTime - TARGET_TIME);
        
        if (timeDifference <= SUCCESS_MARGIN) {
            // Success! They hit close to 7.00 seconds
            // Correct display to show exactly 7.00
            timerElement.textContent = formatTime(TARGET_TIME);
            showSuccess();
        } else {
            // They missed the target time
            showFailure(timeDifference);
        }
    }
    
    // Reset the UI elements
    function resetUI() {
        timerElement.classList.remove('success', 'fail');
        messageElement.classList.remove('show');
        messageElement.textContent = '';
        currentTime = 0;
        timerElement.textContent = formatTime(currentTime);
        
        // Clear existing effects
        effectContainer.innerHTML = '';
    }
    
    // Set waiting state (ready for next start)
    function setWaitingState() {
        isWaiting = false;
        resetUI();
        titleElement.classList.remove('hidden');
    }
    
    // Show success message and effects
    function showSuccess() {
        timerElement.classList.add('success');
        messageElement.textContent = '축하합니다!\n정확히 7초를 맞추셨습니다!';
        messageElement.classList.add('show');
        
        // Create confetti effect
        createConfetti();
        
        // Create wave effect
        createWaveEffect();
    }
    
    // Show failure message and effect
    function showFailure(difference) {
        timerElement.classList.add('fail');
        
        const formattedDiff = formatTime(difference);
        const tooEarlyOrLate = currentTime < TARGET_TIME ? '일찍' : '늦게';
        
        messageElement.textContent = `아쉽습니다!\n${formattedDiff}초 ${tooEarlyOrLate} 멈추셨습니다.`;
        messageElement.classList.add('show');
        
        // Create fail effect
        createFailEffect();
    }
    
    // Create confetti particles for success
    function createConfetti() {
        const colors = ['#4ecca3', '#ffffff', '#eeeeee', '#7ee8fa', '#eec0c6'];
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.animationDuration = `${2 + Math.random() * 2}s`;
            confetti.style.animationDelay = `${Math.random() * 0.5}s`;
            
            effectContainer.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }
    }
    
    // Create wave effect for success
    function createWaveEffect() {
        for (let i = 0; i < 3; i++) {
            const wave = document.createElement('div');
            wave.className = 'wave-effect';
            wave.style.left = '50%';
            wave.style.top = '40%';
            wave.style.animationDelay = `${i * 0.3}s`;
            
            effectContainer.appendChild(wave);
            
            // Remove wave after animation
            setTimeout(() => {
                wave.remove();
            }, 1500);
        }
    }
    
    // Create fail effect
    function createFailEffect() {
        const failEffect = document.createElement('div');
        failEffect.className = 'fail-effect';
        
        effectContainer.appendChild(failEffect);
        
        // Remove fail effect after animation
        setTimeout(() => {
            failEffect.remove();
        }, 500);
    }
    
    // Handle space bar press
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            event.preventDefault();
            
            if (isWaiting) {
                setWaitingState();
            } else if (!isRunning) {
                startTimer();
            } else {
                stopTimer();
            }
        }
    });
    
    // Handle clicks anywhere
    document.addEventListener('click', () => {
        if (isWaiting) {
            setWaitingState();
        } else if (!isRunning) {
            startTimer();
        } else {
            stopTimer();
        }
    });
}); 