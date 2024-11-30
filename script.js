// DOM Elements
const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const resultDiv = document.getElementById("result");
const resultMessage = document.getElementById("result-message");
const rewardDetails = document.getElementById("reward-details");
const rewardPin = document.getElementById("reward-pin");
const copyBtn = document.getElementById("copy-btn");
const eventStatusDiv = document.getElementById("event-status");

// Utility function to generate random pin
function generateRandomPin(length = 15) {
  return Array.from(
    { length }, 
    () => Math.floor(Math.random() * 10)
  ).join('');
}

// Generate unique real pins
const realPins = [
  { name: "N200 Recharge Pin", pin: "123456789012345", isReal: true },
  { name: "N100 Recharge Pin", pin: "987654321098765", isReal: true },
  { name: "N100 Recharge Pin", pin: "112233445566778", isReal: true }
];

// Generate fake pins
const fakePins = Array.from({ length: 7 - realPins.length }, () => ({
  name: "False Recharge",
  pin: generateRandomPin(),
  isReal: false
}));

// Combine and shuffle pins
const rewards = [
  ...realPins, 
  ...fakePins
].sort(() => Math.random() - 0.5);

// Event State Control
let eventState = "active";
let spinsLeft = localStorage.getItem("spinsLeft") || 5;
let spinCooldown = localStorage.getItem("spinCooldown");

// Update spins after cooldown
if (spinCooldown && Date.now() > spinCooldown) {
  spinsLeft = 5;
  localStorage.removeItem("spinCooldown");
}

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
    alert("No spins left! Try again after 4 hours.");
    return;
  }

  // Disable spin button during spin
  spinBtn.disabled = true;

  spinsLeft--;
  localStorage.setItem("spinsLeft", spinsLeft);
  if (spinsLeft === 0) {
    const cooldownTime = Date.now() + 1 * 60 * 60 * 1000; // 1 hour
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
    resultMessage.textContent = `Congratulations! You've won a ${reward.name}!`;
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