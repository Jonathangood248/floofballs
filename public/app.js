// ============================================
// Floofballs Landing Page — JavaScript
// ============================================
// This file handles all interactive behaviour
// on the Floofballs landing page, including:
//   - CTA button click handler
//   - Live counter animation
// ============================================

// ============================================
// CTA BUTTON CLICK HANDLER
// ============================================
// This grabs the main "Get Floofballed" button
// and listens for click events. Right now the
// click handler is empty — that's Task 7!

// ============================================
// TASK 7: Make the CTA button show an alert
// ============================================
// The "Get Floofballed" button below has an
// empty click handler. Add an alert() inside
// with a funny message — something like:
// "You've been Floofballed! 🟠"
// ============================================

const ctaButton = document.getElementById('cta-button');

ctaButton.addEventListener('click', function () {
  // Add your alert() here for Task 7!
});

// ============================================
// LIVE COUNTER
// ============================================
// This section sets up a counter that shows
// "X Floofballs sold today". It uses setInterval
// to update the number every 3 seconds.

// The counter starts at 0
let floofCount = 0;

// Get a reference to the counter element in the DOM
const counterElement = document.getElementById('floof-counter');

// ============================================
// TASK 8: Make the counter count up
// ============================================
// The setInterval below runs a function every
// 3 seconds, but the function is empty.
// Make it:
// 1. Increment floofCount by a random amount
//    between 1 and 5:
//    floofCount += Math.floor(Math.random() * 5) + 1;
// 2. Update the counter text:
//    counterElement.textContent = floofCount + ' Floofballs sold today';
// ============================================

setInterval(function () {
  // Add your counter logic here for Task 8!
}, 3000);
