// DOM Elements
const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const resultDiv = document.getElementById("result");
const resultMessage = document.getElementById("result-message");
const rewardDetails = document.getElementById("reward-details");
const rewardPin = document.getElementById("reward-pin");
const copyBtn = document.getElementById("copy-btn");
const eventStatusDiv = document.getElementById("event-status");

// Reward Configuration with Probabilities
const REWARD_CONFIG = {
  totalSpins: 5,
  cooldownTime: 1 * 60 * 60 * 1000, // 1 hour
  probabilities: {
    realPinChance: 0.3, // 30% chance of getting a real pin
    pinTypes: [
      { name: "N200 Recharge Pin", value: 200, probability: 0.1 },
      { name: "N100 Recharge Pin", value: 100, probability: 0.2 },
      { name: "False Recharge", value: 0, probability: 0.7 }
    ]
  }
};

// Utility function to generate random pin
function generateRandomPin(length = 15) {
  return Array.from(
    { length }, 
    () => Math.floor(Math.random() * 10)
  ).join('');
}

// Generate rewards based on probability
function generateRewards() {
  const rewards = [];
  const { probabilities } = REWARD_CONFIG;

  // Create real pins with different probabilities
  const realPinTypes = probabilities.pinTypes.filter(pin => pin.value > 0);
  
  realPinTypes.forEach(pinType => {
    const count = Math.ceil(probabilities.realPinChance * 10 * pinType.probability);
    for (let i = 0; i < count; i++) {
      rewards.push({
        name: pinType.name,
        pin: generateRandomPin(),
        isReal: true,
        value: pinType.value
      });
    }
  });

  // Fill remaining slots with fake pins
  const fakePinCount = 15 - rewards.length;
  const fakePins = Array.from({ length: fakePinCount }, () => ({
    name: "False Recharge",
    pin: generateRandomPin(),
    isReal: false,
    value: 0
  }));

  return [...rewards, ...fakePins].sort(() => Math.random() - 0.5);
}

// Event State Control
let eventState = "active";
let spinsLeft = localStorage.getItem("spinsLeft") || REWARD_CONFIG.totalSpins;
let spinCooldown = localStorage.getItem("spinCooldown");

// Update spins after cooldown
if (spinCooldown && Date.now() > spinCooldown) {
  spinsLeft = REWARD_CONFIG.totalSpins;
  localStorage.removeItem("spinCooldown");
}

// Generate rewards
const rewards = generateRewards();

// Initialize the wheel and event
function initialize() {
  if (eventState !== "active") {
    displayEventStatus(`The event is currently ${eventState}. Please check back later!`);
    return;
  }

  createWheel();
  updateSpinButton();
}

// Create the spinning wheel
function createWheel() {
  wheel.innerHTML = ''; // Clear existing wheel
  rewards.forEach((reward, i) => {
    const section = document.createElement("div");
    section.className = "section";
    section.style.transform = `rotate(${(360 / rewards.length) * i}deg)`;
    section.innerHTML = `<p>${reward.name}</p>`;
    wheel.appendChild(section);
  });
}

// Spin the wheel with crazy fast animation
function spinWheel() {
  if (spinsLeft <= 0) {
    alert(`No spins left! Try again after ${REWARD_CONFIG.cooldownTime / (60 * 60 * 1000)} hour.`);
    return;
  }

  // Disable spin button during spin
  spinBtn.disabled = true;

  spinsLeft--;
  localStorage.setItem("spinsLeft", spinsLeft);
  if (spinsLeft === 0) {
    const cooldownTime = Date.now() + REWARD_CONFIG.cooldownTime;
    localStorage.setItem("spinCooldown", cooldownTime);
  }
  updateSpinButton();

  // Crazy spin animation
  wheel.style.transition = "transform 0.1s linear";
  
  // Create an intense spin effect
  const spinIntensity = 10; // Number of rapid rotations
  const finalAngle = 360 * spinIntensity + Math.random() * 360;
  
  // Rapid spin stages
  let currentRotation = 0;
  const spinInterval = setInterval(() => {
    currentRotation += 360;
    wheel.style.transform = `rotate(${currentRotation}deg)`;
  }, 50); // Very fast interval

  // Stop spinning and select result
  setTimeout(() => {
    clearInterval(spinInterval);
    
    // Final positioned spin
    wheel.style.transition = "transform 1s cubic-bezier(0.25, 0.1, 0.25, 1)";
    wheel.style.transform = `rotate(${finalAngle}deg)`;
    
    // Determine result after spin
    setTimeout(() => {
      const selectedIndex = Math.floor(
        ((finalAngle % 360) / (360 / rewards.length))
      );
      const reward = rewards[selectedIndex];
      showResult(reward);
      
      // Re-enable spin button
      spinBtn.disabled = false;
    }, 1000);
  }, 500); // Total spin duration
}

// Show the spin result
function showResult(reward) {
  resultDiv.classList.remove("hidden");
  rewardDetails.classList.remove("hidden");
  
  if (reward.isReal) {
    // Winning scenario
    resultMessage.textContent = `Congratulations! You've won a ${reward.name} worth N${reward.value}!`;
    resultMessage.style.color = '#50fa7b'; // Neon green from previous CSS
    rewardPin.value = reward.pin;
    
    // Optional: Special celebration for real prize
    animateCelebration();
  } else {
    // Losing scenario
    resultMessage.textContent = "Oops! This is a false recharge pin. Try again!";
    resultMessage.style.color = '#ff5555'; // Neon red from previous CSS
    rewardPin.value = reward.pin;
  }
}

// Celebration animation
function animateCelebration() {
  // Create celebratory elements
  const celebrationContainer = document.createElement('div');
  celebrationContainer.style.position = 'fixed';
  celebrationContainer.style.top = '0';
  celebrationContainer.style.left = '0';
  celebrationContainer.style.width = '100%';
  celebrationContainer.style.height = '100%';
  celebrationContainer.style.pointerEvents = 'none';
  celebrationContainer.style.zIndex = '9999';

  // Create multiple celebratory elements
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = '10px';
    particle.style.height = '10px';
    particle.style.borderRadius = '50%';
    particle.style.background = getRandomColor();
    
    // Random starting position
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.left = `${Math.random() * 100}%`;
    
    // Animate particle
    particle.animate([
      { transform: 'scale(0)', opacity: 0 },
      { transform: 'scale(1)', opacity: 1 },
      { transform: 'translateY(-100vh) scale(0)', opacity: 0 }
    ], {
      duration: 2000,
      delay: Math.random() * 1000,
      easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    });

    celebrationContainer.appendChild(particle);
  }

  document.body.appendChild(celebrationContainer);

  // Remove celebration after animation
  setTimeout(() => {
    document.body.removeChild(celebrationContainer);
  }, 3000);
}

// Get random vibrant color
function getRandomColor() {
  const colors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#ff9ff3', 
    '#54a0ff', '#5f27cd', '#01a3a4', '#222f3e'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Copy reward pin
copyBtn.addEventListener("click", () => {
  rewardPin.select();
  document.execCommand("copy");
  alert("Pin copied to clipboard!");
});

// Update the spin button based on spins left
function updateSpinButton() {
  spinBtn.textContent = spinsLeft > 0 ? `Spin (${spinsLeft} left)` : "No spins left";
}

// Display event status message
function displayEventStatus(message) {
  eventStatusDiv.classList.remove("hidden");
  eventStatusDiv.textContent = message;
  spinBtn.disabled = true;
}

// Initialize the app
initialize();

// Event Listeners
spinBtn.addEventListener("click", spinWheel);