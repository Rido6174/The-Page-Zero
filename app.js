const audioIds = ['freq-a6', 'freq-b1', 'freq-c7', 'freq-d4'];
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const sources = {};
const gains = {};

async function initAll() {
    if (audioContext.state === 'suspended') {
        await audioContext.resume();
    }
    
    audioIds.forEach(id => {
        const el = document.getElementById(id);
        if (!sources[id]) {
            sources[id] = audioContext.createMediaElementSource(el);
            gains[id] = audioContext.createGain();
            sources[id].connect(gains[id]).connect(audioContext.destination);
            el.play();
        }
    });

    pulse();
}

function pulse() {
    const now = audioContext.currentTime;
    const duration = 8; // 0.125 Hz
    
    audioIds.forEach((id, index) => {
        const gain = gains[id].gain;
        gain.setValueAtTime(0.1, now);
        gain.exponentialRampToValueAtTime(0.5, now + duration / 2);
        gain.exponentialRampToValueAtTime(0.1, now + duration);
    });

    setTimeout(pulse, duration * 1000);
}

async function sendToBunker(input) {
    const stream = document.getElementById('output-stream');
    try {
        const response = await fetch('/api/convergence', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: input })
        });
        const data = await response.json();
        const div = document.createElement('div');
        div.className = 'fade-in-text';
        div.textContent = data.message;
        stream.appendChild(div);
    } catch (e) {
        console.error(e);
    }
}

document.getElementById('user-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const val = e.target.value;
        e.target.value = '';
        sendToBunker(val);
    }
});

window.initAll = initAll;
