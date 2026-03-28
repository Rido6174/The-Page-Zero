import { handleProfiling } from './chat.js';

const outputStream = document.getElementById('output-stream');
const userInput = document.getElementById('user-input');

async function processStream(input) {
    const response = await fetch('/api/convergence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            prompt: input,
            context: "TPZ_CORE_ACTIVE" 
        })
    });
    
    const data = await response.json();
    renderOutput(data.message);
}

function renderOutput(text) {
    const div = document.createElement('div');
    div.className = 'fade-in-text';
    div.textContent = text;
    outputStream.appendChild(div);
}

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && userInput.value.trim()) {
        const val = userInput.value;
        userInput.value = '';
        processStream(val);
        handleProfiling(e);
    }
});
