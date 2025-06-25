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
const operationDisplay = document.getElementById("operation-display");

let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

// Update display function
function updateDisplay(value) {
  display.textContent = value;
}

function formatResult(result) {
  if (typeof result === "number") {
    // Round to 8 decimal places max, trim trailing zeros
    let str = result.toFixed(8).replace(/\.0+$|0+$/, "");
    // If still too long, use exponential
    if (str.length > 12) {
      str = result.toExponential(6);
    }
    return str;
  }
  return result;
}

function updateOperationDisplay() {
  if (firstOperand !== null && operator) {
    if (!waitingForSecondOperand && currentInput !== "") {
      operationDisplay.textContent = `${formatResult(
        firstOperand
      )} ${operator} ${currentInput}`;
    } else {
      operationDisplay.textContent = `${formatResult(
        firstOperand
      )} ${operator}`;
    }
  } else {
    operationDisplay.textContent = "";
  }
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
      // Trim leading zeros unless input is '0.'
      if (!currentInput.startsWith("0.") && currentInput.length > 1) {
        currentInput = currentInput.replace(/^0+/, "");
        if (currentInput === "") currentInput = "0";
      }
      updateDisplay(currentInput);
      updateOperationDisplay();
    } else if (action === "decimal") {
      if (waitingForSecondOperand) {
        currentInput = "0.";
        waitingForSecondOperand = false;
      } else if (!currentInput.includes(".")) {
        if (currentInput === "") {
          currentInput = "0.";
        } else {
          currentInput += ".";
        }
      }
      updateDisplay(currentInput);
      updateOperationDisplay();
    } else if (action === "clear") {
      currentInput = "";
      firstOperand = null;
      operator = null;
      waitingForSecondOperand = false;
      updateDisplay("0");
      updateOperationDisplay();
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
        updateDisplay(formatResult(result));
      }
      operator = nextOperator;
      waitingForSecondOperand = true;
      updateOperationDisplay();
    } else if (action === "equals") {
      if (operator && firstOperand !== null && currentInput !== "") {
        const result = operate(
          operator,
          firstOperand,
          parseFloat(currentInput)
        );
        if (typeof result === "number") {
          updateDisplay(formatResult(result));
          operationDisplay.textContent = `${formatResult(
            firstOperand
          )} ${operator} ${currentInput} = ${formatResult(result)}`;
          firstOperand = result;
          currentInput = "";
        } else {
          // Error (e.g., divide by zero)
          updateDisplay(getRandomSnark());
          operationDisplay.textContent = `${formatResult(
            firstOperand
          )} ${operator} ${currentInput} = Error`;
          firstOperand = null;
          operator = null;
          currentInput = "";
        }
        waitingForSecondOperand = true;
      }
    } else if (action === "backspace") {
      if (!waitingForSecondOperand && currentInput.length > 0) {
        currentInput = currentInput.slice(0, -1);
        updateDisplay(currentInput === "" ? "0" : currentInput);
      }
      updateOperationDisplay();
    } else if (action === "percent") {
      if (!waitingForSecondOperand && currentInput !== "") {
        currentInput = (parseFloat(currentInput) / 100).toString();
        updateDisplay(formatResult(parseFloat(currentInput)));
      }
      updateOperationDisplay();
    } else if (action === "plusminus") {
      if (!waitingForSecondOperand && currentInput !== "") {
        if (currentInput.startsWith("-")) {
          currentInput = currentInput.slice(1);
        } else {
          currentInput = "-" + currentInput;
        }
        updateDisplay(currentInput);
        updateOperationDisplay();
      }
    }
  });
});

// Initialize display
updateDisplay("0");
updateOperationDisplay();

function pressButton(selector) {
  const btn = document.querySelector(selector);
  if (btn) {
    btn.classList.add("pressed");
    setTimeout(() => btn.classList.remove("pressed"), 120);
    btn.click();
  }
}

// Keyboard support
window.addEventListener("keydown", (e) => {
  let key = e.key;
  if (key >= "0" && key <= "9") {
    pressButton(`.btn[data-digit='${key}']`);
    e.preventDefault();
  } else if (key === ".") {
    pressButton(`.btn[data-action='decimal']`);
    e.preventDefault();
  } else if (key === "+" || key === "-" || key === "*" || key === "/") {
    const opMap = {
      "+": "add",
      "-": "subtract",
      "*": "multiply",
      "/": "divide",
    };
    pressButton(`.btn[data-action='${opMap[key]}']`);
    e.preventDefault();
  } else if (key === "=" || key === "Enter") {
    pressButton(`.btn[data-action='equals']`);
    e.preventDefault();
  } else if (key === "Escape" || key === "c" || key === "C") {
    pressButton(`.btn[data-action='clear']`);
    e.preventDefault();
  } else if (key === "Backspace") {
    pressButton(`.btn[data-action='backspace']`);
    e.preventDefault();
  }
});

// Snarky error messages for divide by zero
const snarkyMessages = [
  "Nice try!",
  "You can't do that!",
  "Divide by zero? Bold move.",
  "Nope, not today!",
  "Infinity isn't on the menu.",
  "Zero says no.",
  "Math error: Try again!",
  "This isn't quantum physics!",
];

function getRandomSnark() {
  return snarkyMessages[Math.floor(Math.random() * snarkyMessages.length)];
}
