// Embed functionality
document.getElementById('submitBtn').addEventListener('click', embedText);
document.getElementById('textInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        embedText();
    }
});

document.getElementById('copyBtn').addEventListener('click', copyVector);

// Cosine similarity functionality
document.getElementById('similarityBtn').addEventListener('click', calculateSimilarity);
document.getElementById('text1Input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        calculateSimilarity();
    }
});
document.getElementById('text2Input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        calculateSimilarity();
    }
});

document.getElementById('copySimilarityBtn').addEventListener('click', copySimilarity);

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

async function calculateSimilarity() {
    const text1 = document.getElementById('text1Input').value.trim();
    const text2 = document.getElementById('text2Input').value.trim();

    if (!text1 || !text2) {
        showSimilarityError('Please enter both texts to calculate similarity.');
        return;
    }

    showSimilarityLoading(true);
    hideSimilarityError();

    try {
        const response = await fetch(`/cosine_similarity?text1=${encodeURIComponent(text1)}&text2=${encodeURIComponent(text2)}`);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const result = await response.json();

        if (result.error) {
            showSimilarityError(result.error);
            showSimilarityLoading(false);
            return;
        }

        displaySimilarityResult(text1, text2, result.cosine_similarity);
        showSimilarityLoading(false);
    } catch (error) {
        console.error('Error:', error);
        showSimilarityError(`Failed to calculate similarity: ${error.message}`);
        showSimilarityLoading(false);
    }
}

function displaySimilarityResult(text1, text2, similarity) {
    document.getElementById('similarityText1').textContent = text1;
    document.getElementById('similarityText2').textContent = text2;

    const similarityOutput = document.getElementById('similarityOutput');
    similarityOutput.innerHTML = '';

    const valueDiv = document.createElement('div');
    valueDiv.className = 'similarity-value';
    valueDiv.innerHTML = `<span class="similarity-number">${similarity.toFixed(6)}</span>`;
    similarityOutput.appendChild(valueDiv);

    // Store result for copy functionality
    similarityOutput.dataset.similarity = similarity;

    document.getElementById('similarityResultContainer').classList.remove('hidden');
}

function copySimilarity() {
    const similarityOutput = document.getElementById('similarityOutput');
    const similarity = similarityOutput.dataset.similarity;

    navigator.clipboard.writeText(JSON.stringify({similarity: similarity})).then(() => {
        const copyBtn = document.getElementById('copySimilarityBtn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    }).catch(() => {
        showSimilarityError('Failed to copy result to clipboard.');
    });
}

function showSimilarityLoading(show) {
    const spinner = document.getElementById('similarityLoadingSpinner');
    if (show) {
        spinner.classList.remove('hidden');
    } else {
        spinner.classList.add('hidden');
    }
}

function showSimilarityError(message) {
    const errorContainer = document.getElementById('similarityErrorContainer');
    document.getElementById('similarityErrorMessage').textContent = message;
    errorContainer.classList.remove('hidden');
}

function hideSimilarityError() {
    const errorContainer = document.getElementById('similarityErrorContainer');
    errorContainer.classList.add('hidden');
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
