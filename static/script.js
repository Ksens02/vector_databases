document.getElementById('submitBtn').addEventListener('click', embedText);
document.getElementById('textInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        embedText();
    }
});

document.getElementById('copyBtn').addEventListener('click', copyVector);

async function embedText() {
    const textInput = document.getElementById('textInput').value.trim();

    if (!textInput) {
        showError('Please enter some text to embed.');
        return;
    }

    showLoading(true);
    hideError();

    try {
        const response = await fetch(`/embed?text=${encodeURIComponent(textInput)}`);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const vector = await response.json();

        displayResult(textInput, vector);
        showLoading(false);
    } catch (error) {
        console.error('Error:', error);
        showError(`Failed to embed text: ${error.message}`);
        showLoading(false);
    }
}

function displayResult(inputText, vector) {
    document.getElementById('inputText').textContent = inputText;
    document.getElementById('vectorDim').textContent = vector.length;

    const vectorOutput = document.getElementById('vectorOutput');
    vectorOutput.innerHTML = '';

    // Display first 10 values with more detail, then summary
    const displayCount = Math.min(10, vector.length);
    const vectorList = document.createElement('div');
    vectorList.className = 'vector-list';

    for (let i = 0; i < displayCount; i++) {
        const valueDiv = document.createElement('div');
        valueDiv.className = 'vector-value';
        valueDiv.innerHTML = `<span class="index">[${i}]:</span> <span class="value">${vector[i].toFixed(6)}</span>`;
        vectorList.appendChild(valueDiv);
    }

    if (vector.length > displayCount) {
        const moreDiv = document.createElement('div');
        moreDiv.className = 'vector-value more-values';
        moreDiv.textContent = `... and ${vector.length - displayCount} more values`;
        vectorList.appendChild(moreDiv);
    }

    vectorOutput.appendChild(vectorList);

    // Store vector for copy functionality
    vectorOutput.dataset.vector = JSON.stringify(vector);

    document.getElementById('resultContainer').classList.remove('hidden');
}

function copyVector() {
    const vectorOutput = document.getElementById('vectorOutput');
    const vector = vectorOutput.dataset.vector;

    navigator.clipboard.writeText(vector).then(() => {
        const copyBtn = document.getElementById('copyBtn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    }).catch(() => {
        showError('Failed to copy vector to clipboard.');
    });
}

function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    if (show) {
        spinner.classList.remove('hidden');
    } else {
        spinner.classList.add('hidden');
    }
}

function showError(message) {
    const errorContainer = document.getElementById('errorContainer');
    document.getElementById('errorMessage').textContent = message;
    errorContainer.classList.remove('hidden');
    document.getElementById('resultContainer').classList.add('hidden');
}

function hideError() {
    document.getElementById('errorContainer').classList.add('hidden');
}
