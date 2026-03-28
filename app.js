const audioIds = ['freq-a6', 'freq-b1', 'freq-c7', 'freq-d4'];
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const gains = {};
const canvas = document.getElementById('hexagon-canvas');
const ctx = canvas.getContext('2d');
function drawHexagon(scale) {
    const size = 150 * scale;
    const x = canvas.width / 2;
    const y = canvas.height / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        ctx.lineTo(x + size * Math.cos(i * Math.PI / 3), y + size * Math.sin(i * Math.PI / 3));
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();
}
function pulse() {
    const now = audioContext.currentTime;
    const duration = 8; 
    const scale = 1 + 0.05 * Math.sin(2 * Math.PI * (now / duration));
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawHexagon(scale);
    audioIds.forEach(id => {
        if (gains[id]) {
            gains[id].gain.setTargetAtTime(0.2 + (0.3 * scale), now, 0.5);
        }
    });
    requestAnimationFrame(pulse);
}
async function initAll() {
    if (audioContext.state === 'suspended') await audioContext.resume();
    audioIds.forEach(id => {
        const el = document.getElementById(id);
        if (!gains[id]) {
            const src = audioContext.createMediaElementSource(el);
            gains[id] = audioContext.createGain();
            src.connect(gains[id]).connect(audioContext.destination);
            el.play();
        }
    });
    pulse();
}
document.getElementById('user-input').addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        const val = e.target.value;
        e.target.value = '';
        const res = await fetch('/api/convergence', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: val })
        });
        const data = await res.json();
        const div = document.createElement('div');
        div.className = 'fade-in-text';
        div.textContent = data.message;
        document.getElementById('output-stream').appendChild(div);
    }
});
window.initAll = initAll;
