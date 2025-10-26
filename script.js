document.addEventListener('DOMContentLoaded', () => {
    const expressionDisplay = document.getElementById('expression-display');
    const resultDisplay = document.getElementById('result-display');
    const buttons = document.querySelector('.buttons');

    let currentExpression = '';
    let lastResult = '';
    let shiftActive = false;

    buttons.addEventListener('click', (event) => {
        if (!event.target.matches('button')) return;

        const button = event.target;
        const value = button.dataset.value;
        const key = button.dataset.key;

        handleInput(value, key);
        updateDisplay();
    });

    function handleInput(value, key) {
        if (key) {
            handleSpecialKey(key);
        } else if (value) {
            handleValue(value);
        }
    }

    function handleSpecialKey(key) {
        switch (key) {
            case '=':
                calculate();
                break;
            case 'clear':
                clearAll();
                break;
            case 'delete':
                deleteLast();
                break;
            case 'shift':
                toggleShift();
                break;
            // Add other special keys like 'alpha', 'mode' if you want to implement them
        }
    }

    function handleValue(value) {
         if (value === 'Ans') {
            currentExpression += lastResult;
            return;
        }

        // Handle specific function replacements
        if (shiftActive) {
            switch (value) {
                case 'sin(': currentExpression += 'asin('; break;
                case 'cos(': currentExpression += 'acos('; break;
                case 'tan(': currentExpression += 'atan('; break;
                case 'log': currentExpression += '10**('; break; // log inverse is 10^x
                case 'ln': currentExpression += 'Math.exp('; break; // ln inverse is e^x
                case 'x^-1': currentExpression += '(-1)'; break;
                default: currentExpression += value; break;
            }
            toggleShift(); // Deactivate shift after one use
        } else {
             // Standard functions
            switch(value){
                case 'ln': currentExpression += 'Math.log('; break;
                case 'log': currentExpression += 'Math.log10('; break;
                // Add more function mappings here as needed
                default: currentExpression += value; break;
            }
        }
    }

    function calculate() {
        if (currentExpression === '') return;

        try {
            // Replace user-friendly operators with JS-friendly ones
            let evalExpression = currentExpression
                .replace(/×/g, '*')
                .replace(/÷/g, '/');

            // Handle percentages
            evalExpression = evalExpression.replace(/(\d+(\.\d+)?)%/g, '($1/100)');
            
            // NOTE: Using eval() is a security risk if the input is not controlled.
            // For a calculator simulation where the user input is via buttons, it's generally acceptable.
            // A safer alternative is using a dedicated math parsing library.
            const result = eval(evalExpression);
            
            lastResult = result.toString();
            resultDisplay.textContent = formatResult(result);
            expressionDisplay.textContent = currentExpression + '=';
            currentExpression = ''; // Reset for next calculation, or keep for chaining? For now, reset.

        } catch (error) {
            resultDisplay.textContent = 'Error';
            console.error(error);
        }
    }

    function formatResult(result) {
        // Limit decimal places to avoid overflow
        if (result.toString().includes('.')) {
            return parseFloat(result.toFixed(10));
        }
        return result;
    }

    function clearAll() {
        currentExpression = '';
        resultDisplay.textContent = '0';
        expressionDisplay.textContent = '';
    }

    function deleteLast() {
        currentExpression = currentExpression.slice(0, -1);
    }
    
    function toggleShift() {
        shiftActive = !shiftActive;
        const shiftButton = document.querySelector('[data-key="shift"]');
        shiftButton.style.backgroundColor = shiftActive ? '#e67e22' : '#f1c40f';
    }

    function updateDisplay() {
        if(currentExpression !== ''){
             expressionDisplay.textContent = currentExpression.replace(/\*/g, '×').replace(/\//g, '÷');
        }
    }
});