const audioIds = ['freq-a6', 'freq-b1', 'freq-c7', 'freq-d4'];
const pureFormulas = [
    "Ω = π. ∞", 
    "S(t) = A . sin(ωt + φ)", 
    "R(V) = K . sin(n . V)  [n=6]", 
    "x(t) = a* (t + sin(t) + e^(k*(t/2π)) * cos(t))",
    "y(t) = b* (t + sin(t) + e^(k*(t/2π)) * sin(t))",
    "∀xi ∈ R, ∃Xj ∈ R : Xj = -Xi",
    "K1 = ± 230", "K2 = ± 720", "K3 = ± 490"
];
let currentTrack = 0, audioCtx, canvas, ctx, mouseX = 0, mouseY = 0, rotation = 0;
function initGeometry() {
    canvas = document.getElementById('hexagon-canvas'); ctx = canvas.getContext('2d');
    canvas.width = 700; canvas.height = 700;
    const cursor = document.getElementById('triangle-cursor');
    window.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        const rect = canvas.getBoundingClientRect();
        mouseX = (e.clientX - rect.left) - (rect.width / 2);
        mouseY = (e.clientY - rect.top) - (rect.height / 2);
    });
}
function drawHex(scale, rot, highlightIntensity) {
    const x = canvas.width/2, y = canvas.height/2, size = 220 * scale;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 6; i++) {
        const a1 = (i * Math.PI / 3) + rot, a2 = ((i+1) * Math.PI / 3) + rot;
        const p1 = { x: x + size * Math.cos(a1), y: y + size * Math.sin(a1) };
        const p2 = { x: x + size * Math.cos(a2), y: y + size * Math.sin(a2) };
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 + highlightIntensity})`;
        ctx.lineWidth = 1.2 + (highlightIntensity * 4);
        ctx.stroke();
    }
}
function animate() {
    const now = Date.now() / 1000;
    const pulse = (Math.sin(2 * Math.PI * now / 8) + 1) / 2;
    rotation += 0.0005;
    const dist = Math.sqrt(mouseX*mouseX + mouseY*mouseY);
    const highlight = (dist > 180 && dist < 260) ? 0.8 : 0;
    const tube = document.getElementById('light-tube');
    tube.style.opacity = (Math.abs(mouseX) < 15 && mouseY < 0) ? "1" : "0.4";
    drawHex(1 + pulse * 0.06, rotation, highlight);
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
    const areas = ['f-left-top', 'f-left-bottom', 'f-right-top', 'f-right-bottom'];
    areas.forEach(id => {
        const el = document.getElementById(id);
        setTimeout(() => {
            el.textContent = pureFormulas[Math.floor(Math.random() * pureFormulas.length)];
            el.classList.add('visible');
            setTimeout(() => { el.classList.remove('visible'); }, 4000);
        }, Math.random() * 8000);
    });
    setTimeout(cycleFormulas, 12000);
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
async function initAll() {
    initGeometry(); animate(); playProtocol(); cycleFormulas();
}
window.initAll = initAll;
