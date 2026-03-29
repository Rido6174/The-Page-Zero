const audioIds = ['freq-a6', 'freq-b1', 'freq-c7', 'freq-d4'];
const formulas = [
    "Ω = π . ∞", 
    "x(t) = a*(t+sin(t)+exp(k*(t/2π))*cos(t))",
    "y(t) = b*(t+sin(t)+exp(k*(t%2π))*sin(t))",
    "S(t) = A.sin(ωt+φ)", 
    "R(V) = K . sin(n.V)", 
    "K1 = +/- 230", "K2 = +/+ 720", "K3 = +/- 490",
    "∀xi ∈ R, ∃Xj ∈ R : Xj = -Xi",
    "X(θ, φ) = (R + K sin(nφ) cos(φ)) cos(θ)",
    "Z(θ, φ) = K sin(nφ) sin(φ)"
];
let currentTrack = 0, audioCtx, canvas, ctx, mouseX = 0, mouseY = 0, rotation = 0;
function initGeometry() {
    canvas = document.getElementById('hexagon-canvas'); ctx = canvas.getContext('2d');
    canvas.width = 650; canvas.height = 650;
    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
    });
}
function drawHex(scale, rot, pulseIntensity) {
    const x = canvas.width/2, y = canvas.height/2, size = 190 * scale;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI / 3) + rot;
        const px = x + size * Math.cos(angle), py = y + size * Math.sin(angle);
        ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.strokeStyle = `rgba(255,255,255, ${0.2 + (pulseIntensity * 0.6)})`;
    ctx.lineWidth = 1 + (pulseIntensity * 2);
    ctx.shadowBlur = 15 * pulseIntensity;
    ctx.shadowColor = "white";
    ctx.stroke();
}
function animate() {
    const now = Date.now() / 1000;
    const pulse = (Math.sin(2 * Math.PI * now / 8) + 1) / 2;
    rotation += 0.0005;
    drawHex(1 + pulse * 0.04, rotation, pulse);
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
function cycleFormulas() {
    const ids = ['f-left-1', 'f-left-2', 'f-right-1', 'f-right-2'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        setTimeout(() => {
            el.textContent = formulas[Math.floor(Math.random() * formulas.length)];
            el.classList.add('visible');
            setTimeout(() => { el.classList.remove('visible'); }, 4500);
        }, Math.random() * 5000);
    });
    setTimeout(cycleFormulas, 6000);
}
document.getElementById('user-input').addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        const val = e.target.value; e.target.value = '';
        if (val.toUpperCase() === 'RG-6174') {
            document.getElementById('bunker-container').classList.add('bunker-active');
            return;
        }
        const res = await fetch('/api/convergence', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: val })
        });
        const data = await res.json();
        document.getElementById('seed-box').textContent = data.seed;
    }
});
setInterval(() => {
    document.getElementById('utc-clock').textContent = new Date().toUTCString().split(' ')[4] + " UTC";
}, 1000);
async function initAll() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        initGeometry(); animate(); playProtocol(); cycleFormulas();
    }
}
window.initAll = initAll;
