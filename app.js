const audioIds = ['freq-a6', 'freq-b1', 'freq-c7', 'freq-d4'];
let audioCtx, gains = {}, canvas, ctx;
function initGeometry() {
    canvas = document.getElementById('hexagon-canvas');
    ctx = canvas.getContext('2d');
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
function drawHex(scale) {
    const size = (window.innerHeight / 4) * scale;
    const x = canvas.width / 2;
    const y = canvas.height / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = i * Math.PI / 3;
        ctx.lineTo(x + size * Math.cos(angle), y + size * Math.sin(angle));
    }
    ctx.closePath();
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 + (scale * 0.2)})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
}
async function initAll() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        audioIds.forEach(id => {
            const el = document.getElementById(id);
            const source = audioCtx.createMediaElementSource(el);
            gains[id] = audioCtx.createGain();
            gains[id].gain.value = 0.1;
            source.connect(gains[id]).connect(audioCtx.destination);
            el.play();
        });
        initGeometry();
        animate();
    }
}
function animate() {
    const now = audioCtx.currentTime;
    const period = 8;
    const wave = (Math.sin(2 * Math.PI * now / period) + 1) / 2;
    drawHex(1 + wave * 0.1);
    audioIds.forEach((id, i) => {
        const offset = (i / audioIds.length) * Math.PI;
        const vol = (Math.sin((2 * Math.PI * now / period) + offset) + 1) / 2;
        gains[id].gain.setTargetAtTime(vol * 0.3, now, 0.5);
    });
    requestAnimationFrame(animate);
}
document.getElementById('user-input').addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        const val = e.target.value;
        e.target.value = '';
        const output = document.getElementById('output-stream');
        try {
            const res = await fetch('/api/convergence', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: val })
            });
            const data = await res.json();
            const p = document.createElement('p');
            p.className = 'fade-in-text';
            p.textContent = data.message || data.error;
            output.appendChild(p);
        } catch (err) {
            console.error("Falha na Convergência:", err);
        }
    }
});
window.initAll = initAll;
