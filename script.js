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

let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

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
      if (waitingForSecondOperand) {
        currentInput = digit;
        waitingForSecondOperand = false;
      } else if (currentInput.length < 12) {
        currentInput += digit;
      }
      updateDisplay(currentInput);
    } else if (action === "clear") {
      currentInput = "";
      firstOperand = null;
      operator = null;
      waitingForSecondOperand = false;
      updateDisplay("0");
    } else if (["add", "subtract", "multiply", "divide"].includes(action)) {
      const opMap = { add: "+", subtract: "-", multiply: "*", divide: "/" };
      const nextOperator = opMap[action];
      if (operator && waitingForSecondOperand) {
        operator = nextOperator;
        return;
      }
      if (firstOperand === null && currentInput !== "") {
        firstOperand = parseFloat(currentInput);
      } else if (operator) {
        const result = operate(
          operator,
          firstOperand,
          parseFloat(currentInput)
        );
        firstOperand = typeof result === "number" ? result : firstOperand;
        updateDisplay(result);
      }
      operator = nextOperator;
      waitingForSecondOperand = true;
    }
    // Equals and other actions will be handled later
  });
});

// Initialize display
updateDisplay("0");
