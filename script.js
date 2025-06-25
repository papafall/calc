// Basic math functions
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    return "Error: Division by zero!";
  }
  return a / b;
}

// Operate function
function operate(operator, a, b) {
  switch (operator) {
    case "+":
      return add(a, b);
    case "-":
      return subtract(a, b);
    case "*":
      return multiply(a, b);
    case "/":
      return divide(a, b);
    default:
      return null;
  }
}

// For testing in the console
// console.log(operate('+', 3, 5));

// Calculator state
let currentInput = "";
const display = document.getElementById("display");

// Update display function
function updateDisplay(value) {
  display.textContent = value;
}

// Handle button clicks
const buttons = document.querySelectorAll(".btn");
buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const digit = button.getAttribute("data-digit");
    const action = button.getAttribute("data-action");

    if (digit !== null) {
      // Append digit to current input
      if (currentInput.length < 12) {
        // limit display length
        currentInput += digit;
        updateDisplay(currentInput);
      }
    } else if (action === "clear") {
      currentInput = "";
      updateDisplay("0");
    }
    // Operators and other actions will be handled later
  });
});

// Initialize display
updateDisplay("0");
