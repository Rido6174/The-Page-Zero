const audioIds = ['freq-a6', 'freq-b1', 'freq-c7', 'freq-d4'];
const formulas = [
    "Ω = π. ∞", "x(t) = a*(t+sin(t))", "S(t) = A.sin(ωt+φ)", 
    "R(V) = K.sin(n.V)", "K1 = +/- 230", "K2 = +/+ 720"
];
let currentTrack = 0, audioCtx, canvas, ctx, mouseX = 0, mouseY = 0, rotation = 0;
function initGeometry() {
    canvas = document.getElementById('hexagon-canvas'); ctx = canvas.getContext('2d');
    canvas.width = 600; canvas.height = 600;
    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
    });
}
function drawHex(scale, rot, highlight) {
    const x = canvas.width/2, y = canvas.height/2, size = 180 * scale;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI / 3) + rot;
        const px = x + size * Math.cos(angle), py = y + size * Math.sin(angle);
        ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.strokeStyle = highlight ? "rgba(255,215,0,0.8)" : "rgba(255,255,255,0.2)";
    ctx.lineWidth = highlight ? 3:1;
    ctx.stroke();
}
function animate() {
    const now = Date.now() / 1000;
    const pulse = (Math.sin(2 * Math.PI * now / 8) + 1) / 2;
    rotation += 0.001;
    const dist = Math.sqrt(mouseX*mouseX + mouseY*mouseY);
    const highlight = dist > 0.25 && dist < 0.35;
    
    drawHex(1 + pulse * 0.05, rotation, highlight);
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
    const side = Math.random() > 0.5 ? 'left' : 'right';
    const el = document.getElementById(`formula-${side}`);
    el.textContent = formulas[Math.floor(Math.random() * formulas.length)];
    el.style.opacity = 1;
    setTimeout(() => { el.style.opacity = 0; }, 2000);
    setTimeout(cycleFormulas, 4000 + Math.random() * 3000);
}
document.getElementById('user-input').addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        const val = e.target.value; e.target.value = '';
        if (val.toUpperCase() === 'RG-6174') {
            document.getElementById('bunker-container').classList.add('bunker-active');
            return;
        }
        const responseCore = document.getElementById('ai-response-core');
        responseCore.style.opacity = 1;
        responseCore.textContent = "Convergindo...";
        const res = await fetch('/api/convergence', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: val })
        });
        const data = await res.json();
        document.getElementById('seed-box').textContent = data.seed;
        responseCore.textContent = data.message;
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
