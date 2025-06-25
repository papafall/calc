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
        updateDisplay(formatResult(result));
      }
      operator = nextOperator;
      waitingForSecondOperand = true;
    } else if (action === "equals") {
      if (operator && firstOperand !== null && currentInput !== "") {
        const result = operate(
          operator,
          firstOperand,
          parseFloat(currentInput)
        );
        if (typeof result === "number") {
          updateDisplay(formatResult(result));
          firstOperand = result;
          currentInput = "";
        } else {
          // Error (e.g., divide by zero)
          updateDisplay("Nice try!");
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
    }
  });
});

// Initialize display
updateDisplay("0");

// Keyboard support
window.addEventListener("keydown", (e) => {
  let key = e.key;
  if (key >= "0" && key <= "9") {
    document.querySelector(`.btn[data-digit='${key}']`).click();
    e.preventDefault();
  } else if (key === ".") {
    document.querySelector(`.btn[data-action='decimal']`).click();
    e.preventDefault();
  } else if (key === "+" || key === "-" || key === "*" || key === "/") {
    const opMap = {
      "+": "add",
      "-": "subtract",
      "*": "multiply",
      "/": "divide",
    };
    document.querySelector(`.btn[data-action='${opMap[key]}']`).click();
    e.preventDefault();
  } else if (key === "=" || key === "Enter") {
    document.querySelector(`.btn[data-action='equals']`).click();
    e.preventDefault();
  } else if (key === "Escape" || key === "c" || key === "C") {
    document.querySelector(`.btn[data-action='clear']`).click();
    e.preventDefault();
  } else if (key === "Backspace") {
    document.querySelector(`.btn[data-action='backspace']`)?.click();
    e.preventDefault();
  }
});
