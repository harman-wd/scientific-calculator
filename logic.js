//structure and theme
const modeButton = document.getElementById("mode");
const specialKeys = document.getElementsByClassName("special-key");
const buttonHero = document.querySelector(".buttons-hero");

modeButton.addEventListener("click", function () {

    for (let i = 0; i < specialKeys.length; i++) {
        if (specialKeys[i].style.display === "none") {
            specialKeys[i].setAttribute("style", "display:block");
            buttonHero.classList.replace("row-cols-4", "row-cols-5");

        } else {
            specialKeys[i].style.display = "none";
            buttonHero.classList.replace("row-cols-5", "row-cols-4");
        }
    }
})

const lightTheme = document.querySelector(".fa-sun");
const lightThemeContainer = document.querySelector(".sun-icon");

const darkTheme = document.querySelector(".fa-moon");
const darkThemeContainer = document.querySelector(".moon-icon");

const darkElements = document.querySelectorAll(".dark");

lightTheme.addEventListener("click", function () {
    lightThemeContainer.classList.add("highlight");
    darkThemeContainer.classList.remove("highlight");

    darkElements.forEach(function (element) {
        element.style.backgroundImage = "radial-gradient(rgb(255, 255, 255), rgba(104, 137, 134, 0.5))";
        element.style.color = "black"
        element.style.boxShadow = "0 5px 8px rgba(0,0,0,0.2)"
    });
});

darkTheme.addEventListener("click", function () {
    lightThemeContainer.classList.remove("highlight");
    darkThemeContainer.classList.add("highlight");

    darkElements.forEach(function (element) {
        element.style.backgroundImage = "radial-gradient(rgba(45, 77, 74, 0.21),rgba(0, 0, 0, 0.8))";
        element.style.color = "white"
        element.style.boxShadow = "0 5px 8px rgba(0, 0, 0, 0.5)"
    });
});


//acctual calculations
const calButtons = document.querySelectorAll(".buttons");
const display = document.querySelector("#display");
const answer = document.querySelector("#answer");

const equalSymbol = document.querySelector(".speButon");

let sqrtActive = false;
const sqrt = document.querySelector("#sqrt");
sqrt.addEventListener("click", function () {
    sqrtActive = true;
});

const squareButton = document.querySelector("#square");

squareButton.addEventListener("click", function () {
    let expression = display.innerText;
    let parts = expression.match(/\d+\.?\d*|[+\-×÷%^]/g);
    if (!parts) {
        return;
    }
    let lastNumber = Number(parts[parts.length - 1]);
    if (Number.isNaN(lastNumber)) {
        return;
    }
    display.innerText += "²";

    calculateExpression();
});

let angleMode = "deg";
const degButton = document.querySelector("#deg");
degButton.classList.add("angle-active");
degButton.addEventListener("click", function () {
    angleMode = "deg";
    degButton.classList.add("angle-active");
    radButton.classList.remove("angle-active");

});

const radButton = document.querySelector("#rad");
radButton.addEventListener("click", function () {
    angleMode = "rad";
    radButton.classList.add("angle-active");
    degButton.classList.remove("angle-active");
});

let sinActive = false;
const sinLogic = document.querySelector("#sin");
sinLogic.addEventListener("click", function () {
    display.innerText += "sin(";
    sinActive = true;
})

let cosActive = false;
const coslogic = document.querySelector("#cos");
coslogic.addEventListener("click", function () {
    display.innerText += "cos(";
    cosActive = true;
});

let tanActive = false;
const tanLogic = document.querySelector("#tan");
tanLogic.addEventListener("click", function () {
    display.innerText += "tan(";
    tanActive = true;
});

let logActive = false;
const logLogic = document.querySelector("#log");
logLogic.addEventListener("click", function () {
    display.innerText += "log(";
    logActive = true;
});

let inActive = false;
const inLogic = document.querySelector("#in");
inLogic.addEventListener("click", function () {
    display.innerText += "in(";
    inActive = true;
});

function calculateExpression() {
    let expression = display.innerText;
    let parts = expression.match(/\d+\.?\d*|[+\-×÷%^πe²()!]/g);

    if (!parts) {
        answer.innerText = "";
        return;
    }

    if (parts.includes("e")) {
        parts[parts.indexOf("e")] = Math.E.toString();
    }

    if (parts.includes("π")) {
        parts[parts.indexOf("π")] = Math.PI.toString();
    }

    if (parts[0] === "-" && parts[1] !== undefined) {
        parts[1] = "-" + parts[1];
        parts.splice(0, 1);
    }

    if (parts.includes("(") && !parts.includes(")")) {
        answer.innerText = "";
        return;
    }

    for (let i = 1; i < parts.length; i += 2) {

        if (parts[i] === "!") {
            let number = Number(parts[i - 1]);
            if (number < 0 || !Number.isInteger(number)) {
                answer.innerText = "Error";
                return;
            }
            let factorialResult = 1;
            for (let j = 1; j <= number; j++) {
                factorialResult *= j;
            }
            parts.splice(i - 1, 2, factorialResult.toString());
            i -= 2;
        }
    }
    // Number de naal lagga ² pehla solve karo
    // Example: 3² → 9
    for (let i = 1; i < parts.length; i++) {
        if (parts[i] === "²" && parts[i - 1] !== ")") {
            let number = Number(parts[i - 1]);
            if (!Number.isNaN(number)) {
                parts.splice(i - 1, 2, (number ** 2).toString());
                i = 0;
            }
        }
    }
    // Brackets solve karo
    while (parts.includes("(") && parts.includes(")")) {
        let closeIndex = parts.indexOf(")");
        let openIndex = parts.lastIndexOf("(", closeIndex);
        let bracketParts = parts.slice(openIndex + 1, closeIndex);
        // Bracket de andar × ÷ ^ pehla solve karo
        for (let i = 1; i < bracketParts.length; i += 2) {
            if (
                bracketParts[i] === "×" ||
                bracketParts[i] === "÷" ||
                bracketParts[i] === "^"
            ) {
                let left = Number(bracketParts[i - 1]);
                let right = Number(bracketParts[i + 1]);
                let result;
                if (bracketParts[i] === "×") {
                    result = left * right;
                }
                if (bracketParts[i] === "÷") {
                    result = left / right;
                }
                if (bracketParts[i] === "^") {
                    result = left ** right;
                }
                bracketParts.splice(i - 1, 3, result.toString());
                i -= 2;
            }
        }
        // Bracket de andar + - solve karo
        let bracketResult = Number(bracketParts[0]);
        for (let i = 1; i < bracketParts.length; i += 2) {
            let operator = bracketParts[i];
            let number = Number(bracketParts[i + 1]);
            if (operator === "+") {
                bracketResult += number;
            }
            if (operator === "-") {
                bracketResult -= number;
            }
        }

        parts.splice(
            openIndex,
            closeIndex - openIndex + 1,
            bracketResult.toString()
        );
    }
    // Bracket solve hon ton baad
    // (2 + 3)² → 5² → 25
    for (let i = 1; i < parts.length; i++) {
        if (parts[i] === "²") {
            let number = Number(parts[i - 1]);
            if (!Number.isNaN(number)) {
                parts.splice(i - 1, 2, (number ** 2).toString());
                i = 0;
            }
        }
    }
    if (parts.length % 2 === 0 && parts[parts.length - 1] !== "%") {
        return;
    }
    if (
        parts.length === 1 &&
        ["+", "×", "÷", "%", "-", "^"].includes(parts[0])
    ) {
        answer.innerText = "";
        return;
    }



    // Standalone percentage: 10% → 0.1
    if (parts[parts.length - 1] === "%") {
        let percentage = Number(parts[parts.length - 2]);
        // 10% alone
        if (parts.length === 2) {
            answer.innerText = percentage / 100;
            return;
        }
        // 200 + 10%
        let previousNumber = Number(parts[parts.length - 3]);
        let previousOperator = parts[parts.length - 3];
        if (parts.length >= 4) {
            previousOperator = parts[parts.length - 3];
        }
        let base = Number(parts[parts.length - 4]);
        if (previousOperator === "+") {
            answer.innerText = base + (base * percentage / 100);
            return;
        }
        if (previousOperator === "-") {
            answer.innerText = base - (base * percentage / 100);
            return;
        }
        if (previousOperator === "×") {
            answer.innerText = base * (percentage / 100);
            return;
        }
        if (previousOperator === "÷") {
            answer.innerText = base / (percentage / 100);
            return;
        }
    }
    // ×, ÷ pehla solve karo
    for (let i = 1; i < parts.length; i += 2) {
        if (parts[i] === "×" || parts[i] === "÷" || parts[i] === "^") {
            let left = Number(parts[i - 1]);
            let right = Number(parts[i + 1]);
            let result;
            if (parts[i] === "×") {
                result = left * right;
            }
            if (parts[i] === "÷") {
                result = left / right;
            }
            if (parts[i] === "^") {
                result = left ** right;
            }
            parts.splice(i - 1, 3, result.toString());
            i -= 2;
        }
    }
    // +, - solve karo
    let result = Number(parts[0]);
    for (let i = 1; i < parts.length; i += 2) {
        let operator = parts[i];
        let number = Number(parts[i + 1]);
        if (operator === "+") {
            result = result + number;
        }
        if (operator === "-") {
            result = result - number;
        }
    }
    answer.innerText = result;
}

calButtons.forEach(button => {
    button.addEventListener("click", () => {
        if (
            button.id === "sin" ||
            button.id === "cos" ||
            button.id === "tan" ||
            button.id === "log" ||
            button.id === "in" ||
            button.id === "deg" ||
            button.id === "rad" ||
            button.id === "square" ||
            button.id === "factorial" ||
            button.classList.contains("backSpace")
        ) {
            return;
        }
        display.innerText += button.innerText;

        if (sqrtActive) {
            let expression = display.innerText.slice(1);
            if (expression === "") {
                answer.innerText = "";
                return;
            }
            display.innerText = expression;
            calculateExpression();
            let number = Number(answer.innerText);
            if (number < 0) {
                answer.innerText = "Error";
                sqrtActive = false;
                return;
            }
            let result = Math.sqrt(number);
            display.innerText = "√" + expression;
            answer.innerText = Number(result.toFixed(10));
            return;
        }
        calculateExpression();

        if (sinActive) {
            if (sinActive && button.innerText === ")") {
                let expression = display.innerText.slice(4, -1);
                display.innerText = expression;
                calculateExpression();
                let number = Number(answer.innerText);
                display.innerText = "sin(" + expression + ")";
                let radians;
                if (angleMode === "deg") {
                    radians = number * Math.PI / 180;
                } else {
                    radians = number;
                }
                let result = Math.sin(radians);
                answer.innerText = Number(result.toFixed(10));
                sinActive = false;
                return;
            }
        }
        calculateExpression();

        if (cosActive) {
            let expression = display.innerText.slice(4);
            if (expression === "") {
                answer.innerText = "";
                return;
            }
            display.innerText = expression;
            calculateExpression();
            let number = Number(answer.innerText);
            display.innerText = "cos(" + expression;
            let radians;
            if (angleMode === "deg") {
                radians = number * Math.PI / 180;
            } else {
                radians = number;
            }
            let result = Math.cos(radians);
            answer.innerText = Number(result.toFixed(10));
            cosActive = false;
            return;
        }
        calculateExpression();

        if (tanActive) {
            let expression = display.innerText.slice(4);

            if (expression === "") {
                answer.innerText = "";
                return;
            }
            display.innerText = expression;
            calculateExpression();
            let number = Number(answer.innerText);
            if ((number - 90) % 180 === 0) {
                answer.innerText = "Error";
                return;
            }
            display.innerText = "tan(" + expression;
            let radians;
            if (angleMode === "deg") {
                radians = number * Math.PI / 180;
            } else {
                radians = number;
            }
            let result = Math.tan(radians);
            answer.innerText = Number(result.toFixed(10));
            return;
        }
        calculateExpression();

        if (logActive) {
            if (button.innerText === ")") {
                let expression = display.innerText.slice(4, -1);
                display.innerText = expression;
                calculateExpression();
                let number = Number(answer.innerText);
                if (number <= 0) {
                    answer.innerText = "Error";
                    logActive = false;
                    return;
                }
                display.innerText = "log(" + expression + ")";
                let result = Math.log10(number);
                answer.innerText = Number(result.toFixed(10));
                logActive = false;
                return;
            }
        }

        if (inActive) {
            if (button.innerText === ")") {
                let expression = display.innerText.slice(3, -1);
                if (expression === "") {
                    answer.innerText = "";
                    return;
                }
                display.innerText = expression;
                calculateExpression();
                let number = Number(answer.innerText);
                if (number <= 0) {
                    answer.innerText = "Error";
                    inActive = false;
                    return;
                }
                display.innerText = "ln(" + expression + ")";
                let result = Math.log(number);
                answer.innerText = Number(result.toFixed(10));
                inActive = false;
                return;
            }
        }
    });
});

equalSymbol.addEventListener("click", () => {
    display.innerText = answer.innerText;
    answer.innerText = "";
})

let clearAll = document.querySelector(".clearAll");
clearAll.addEventListener("click", function () {
    display.innerText = "";
    answer.innerText = "";
})

const backSpace = document.querySelector(".backSpace");
backSpace.addEventListener("click", function () {
    display.innerText = display.innerText.slice(0, -1);
    if (display.innerText.length === 0) {
        answer.innerText = "";
    }
    if (display.innerText.startsWith("sin(")) {
        sinActive = true;
    }
    if (display.innerText.startsWith("cos(")) {
        cosActive = true;
    }
    if (display.innerText.startsWith("tan(")) {
        tanActive = true;
    }
    if (display.innerText.startsWith("log(")) {
        logActive = true;
    }
    if (display.innerText.startsWith("ln(")) {
        inActive = true;
    }
    if (display.innerText !== "") {
        let expression = display.innerText;
        let parts = expression.match(/\d+\.?\d*|[+\-×÷%]/g);

        if (parts.length % 2 === 0) {
            answer.innerText = parts[parts.length - 2];
        }
    }
})

document.addEventListener("keydown", (event) => {
    let key = event.key;
    if (key >= "0" && key <= "9") {
        display.innerText += key;
        calculateExpression();
    }
    else if (key === "+") {
        display.innerText += "+";
        answer.innerText = "";
        calculateExpression();
    }
    else if (key === "-") {
        display.innerText += "-";
        calculateExpression();
    }
    else if (key === "*") {
        display.innerText += "×";
        calculateExpression();
    }
    else if (key === "/") {
        display.innerText += "÷";
        calculateExpression();
    }
    else if (key === "%") {
        display.innerText += "%";
        calculateExpression();
    }
    else if (key === "Backspace") {
        display.innerText = display.innerText.slice(0, -2);
        calculateExpression();
    }
    else if (key === "Enter") {
        display.innerText = answer.innerText;
        answer.innerText = "";
    }
});

const factorialButton = document.querySelector("#factorial");
factorialButton.addEventListener("click", function () {
    let expression = display.innerText;
    let number = Number(expression);
    if (number < 0) {
        answer.innerText = "Error";
        return;
    }
    if (!Number.isInteger(number)) {
        answer.innerText = "Error";
        return;
    }
    let result = 1;
    for (let i = 1; i <= number; i++) {
        result *= i;
    }
    display.innerText += "!";
    calculateExpression();
});

const pi = document.querySelector("#pie");
pi.addEventListener("click", function () {
    calculateExpression();
});

const euler = document.querySelector("#euler");
euler.addEventListener("click", function () {
    calculateExpression();
});




