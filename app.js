const audioIds = ['freq-a6', 'freq-b1', 'freq-c7', 'freq-d4'];
let currentTrack = 0;
let audioCtx, gains = {}, canvas, ctx, mouseX = 0, rotation = 0;
function initGeometry() {
    canvas = document.getElementById('hexagon-canvas'); ctx = canvas.getContext('2d');
    canvas.width = 750; canvas.height = 750;
    window.addEventListener('mousemove', (e) => { mouseX = (e.clientX / window.innerWidth) - 0.5; });
}
function drawHex(scale, rot) {
    const x = canvas.width / 2, y = canvas.height / 2;
    const size = 230 * scale;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.shadowBlur = 100 * scale; ctx.shadowColor = "rgba(255, 255, 255, 0.35)";
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI / 3) + rot;
        ctx.lineTo(x + size * Math.cos(angle), y + size * Math.sin(angle));
    }
    ctx.closePath();
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.25 + (scale * 0.45)})`;
    ctx.lineWidth = 1.4; ctx.stroke();
}
function animate() {
    const now = Date.now() / 1000;
    const pulse = (Math.sin(2 * Math.PI * now / 8) + 1) / 2;
    rotation += 0.002 + (mouseX * 0.02);
    drawHex(1 + pulse * 0.1, rotation);
    requestAnimationFrame(animate);
}
function playProtocol() {
    const audio = document.getElementById(audioIds[currentTrack]);
    audio.play();
    audio.onended = () => {
        currentTrack = (currentTrack + 1) % audioIds.length;
        playProtocol();
    };
}
async function initAll() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') await audioCtx.resume();
        initGeometry();
        animate();
        playProtocol();
    }
}
document.getElementById('user-input').addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        const val = e.target.value; e.target.value = '';
        const output = document.getElementById('output-stream');
        const seedBox = document.getElementById('seed-box');
        output.textContent = "...";
        try {
            const res = await fetch('/api/convergence', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: val })
            });
            const data = await res.json();
            seedBox.textContent = `SEED: ${data.seed} | UTC: ${data.utc}`;
            output.textContent = data.message;
        } catch (err) { seedBox.textContent = "SINAL INTERROMPIDO"; }
    }
});
window.initAll = initAll;
