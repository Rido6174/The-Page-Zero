const audioIds = ['freq-a6', 'freq-b1', 'freq-c7', 'freq-d4'];
let audioCtx, gains = {}, canvas, ctx, mouseX = 0, rotation = 0;
function initGeometry() {
    canvas = document.getElementById('hexagon-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener('mousemove', (e) => { mouseX = (e.clientX / window.innerWidth) - 0.5; });
}
function drawHex(scale, rot) {
    const x = canvas.width / 2;
    const y = canvas.height / 2;
    const size = (window.innerHeight / 4.5) * scale;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.shadowBlur = 40 * scale;
    ctx.shadowColor = "rgba(255, 255, 255, 0.3)";
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI / 3) + rot;
        ctx.lineTo(x + size * Math.cos(angle), y + size * Math.sin(angle));
    }
    ctx.closePath();
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 + (scale * 0.4)})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.shadowBlur = 0;
}
function animate() {
    const now = audioCtx.currentTime;
    const T = 8;
    const wave = (Math.sin(2 * Math.PI * now / T) + 1) / 2;
    rotation += 0.005 + (mouseX * 0.05);
    drawHex(1 + wave * 0.1, rotation);
    audioIds.forEach((id, i) => {
        const offset = (i / 4) * (2 * Math.PI);
        const vol = (Math.sin((2 * Math.PI * now / T) + offset) + 1) / 2;
        if (gains[id]) gains[id].gain.setTargetAtTime(vol * 0.25, now, 0.5);
    });
    requestAnimationFrame(animate);
}
async function initAll() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        audioIds.forEach(id => {
            const el = document.getElementById(id);
            const source = audioCtx.createMediaElementSource(el);
            gains[id] = audioCtx.createGain();
            source.connect(gains[id]).connect(audioCtx.destination);
            el.play();
        });
        initGeometry();
        animate();
    }
}
document.getElementById('user-input').addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        const val = e.target.value; e.target.value = '';
        const output = document.getElementById('output-stream');
        const seedZone = document.getElementById('seed-box');
        try {
            const res = await fetch('/api/convergence', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: val })
            });
            const data = await res.json();
            seedZone.textContent = `SEED: ${data.seed} | UTC: ${new Date().toISOString().replace('T', ' ').split('.')[0]}`;
            const p = document.createElement('p');
            p.className = 'fade-in-text';
            p.textContent = data.message;
            output.appendChild(p);
            output.scrollTop = output.scrollHeight;
        } catch (err) {
            seedZone.textContent = "CONVERGENCE ERROR";
        }
    }
});
window.initAll = initAll;
