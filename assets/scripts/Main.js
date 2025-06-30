const rateInput = document.getElementById('rate'), timesInput = document.getElementById('times'), initialInput = document.getElementById('initial'), yearsInput = document.getElementById('years'), resultElement = document.getElementById('result'), allInputs = document.querySelectorAll('#initial, #rate, #times, #years'), rateMirror = rateInput.parentElement.querySelector('.mirror'), defaults = {initial:'0',rate:'0',times:'0',years:'0'};

function calculate() {
    const initial = parseFloat(initialInput.value.replace(/\s/g, ''));
    const rate = parseFloat(rateInput.value.replace(/\s/g, '')) / 100;
    const times = parseInt(timesInput.value.replace(/\s/g, ''));
    const years = parseFloat(yearsInput.value.replace(/\s/g, ''));

    if ([initial, rate, years].some(isNaN) || isNaN(times) || times <= 0) {
        resultElement.textContent = 'Invalid values';
        return;
    }

    const A = initial * Math.pow(1 + rate / times, times * years);
    const hasDecimals = [initialInput, rateInput, yearsInput].some(i => i.value.includes('.'));
    let formatted = hasDecimals ? A.toFixed(2).replace(/\.00$/, '') : Math.floor(A).toString();

    resultElement.textContent = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' €';
}

function updateMirror() {
    rateMirror.textContent = rateInput.value || '0';
    rateInput.parentElement.style.setProperty('--mirror-width', `${rateMirror.getBoundingClientRect().width}px`);
}

allInputs.forEach((input, i) => {
    input.addEventListener('input', () => {
        updateMirror();
        if (input.value.startsWith('0') && input.value.length > 1 && !['.', '-'].includes(input.value[1]))
            input.value = input.value.replace(/^0+/, '') || '0';

        if (input.value === '') input.value = defaults[input.id];
        calculate();
    });

    input.addEventListener('keydown', e => {
        if (['ArrowUp','ArrowDown'].includes(e.key)) {
            e.preventDefault();
            const next = allInputs[(i + (e.key === 'ArrowUp' ? 3 : 1)) % 4];
            next.focus();
            next.setSelectionRange(next.value.length, next.value.length);
        }
        else if (e.key === '-' && input !== timesInput) {
            e.preventDefault();
            input.value = '-';
            input.setSelectionRange(1, 1);
        }
        else if (e.key === '.' && input === timesInput) e.preventDefault();
        else if (e.key.length === 1) {
            if (input === timesInput && !/\d/.test(e.key)) e.preventDefault();
            else if (!/[\d.\-]/.test(e.key)) e.preventDefault();
        }
    });
});

updateMirror();
calculate();