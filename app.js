const audioIds = ['freq-a6', 'freq-b1', 'freq-c7', 'freq-d4'];
let audioCtx, gains = {}, canvas, ctx, mouseX = 0, rotation = 0;
function initGeometry() {
    canvas = document.getElementById('hexagon-canvas'); ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    window.addEventListener('mousemove', (e) => { mouseX = (e.clientX / window.innerWidth) - 0.5; });
    window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });
}
function drawHex(scale, rot) {
    const x = canvas.width / 2, y = canvas.height / 2;
    const size = (window.innerHeight / 4.5) * scale;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.shadowBlur = 50 * scale; ctx.shadowColor = "rgba(255, 255, 255, 0.2)";
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI / 3) + rot;
        ctx.lineTo(x + size * Math.cos(angle), y + size * Math.sin(angle));
    }
    ctx.closePath();
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 + (scale * 0.4)})`;
    ctx.lineWidth = 1; ctx.stroke();
}
function animate() {
    if (!audioCtx) return;
    const now = audioCtx.currentTime; const T = 8;
    const pulse = (Math.sin(2 * Math.PI * now / T) + 1) / 2;
    rotation += 0.002 + (mouseX * 0.015);
    drawHex(1 + pulse * 0.05, rotation);
    audioIds.forEach((id, i) => {
        const startTime = i * 2;
        const timeInCycle = now % T;
        let vol = 0;
        if (timeInCycle >= startTime && timeInCycle < startTime + 2) {

            vol = Math.sin(((timeInCycle - startTime) / 2) * Math.PI);
        }
        if (gains[id]) gains[id].gain.setTargetAtTime(vol * 0.4, now, 0.1);
    });
    requestAnimationFrame(animate);
}
async function initAll() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') await audioCtx.resume();
        audioIds.forEach(id => {
            const el = document.getElementById(id);
            const src = audioCtx.createMediaElementSource(el);
            gains[id] = audioCtx.createGain(); gains[id].gain.value = 0;
            src.connect(gains[id]).connect(audioCtx.destination);
            el.play();
        });
        initGeometry(); animate();
    }
}
document.getElementById('user-input').addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        const val = e.target.value; e.target.value = '';
        const output = document.getElementById('output-stream');
        const seedBox = document.getElementById('seed-box');
        output.textContent = "Convergindo...";
        try {
            const res = await fetch('/api/convergence', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: val })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            seedBox.textContent = `SEED: ${data.seed} | UTC: ${data.utc}`;
            output.textContent = data.message;
        } catch (err) { 
            seedBox.textContent = "ERRO DE SINCRONIA";
            output.textContent = "Verifica a GEMINI_API_KEY e faz Redeploy."; 
        }
    }
});
window.initAll = initAll;
