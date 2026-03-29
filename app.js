const audioIds = ['freq-a6', 'freq-d4', 'freq-b1', 'freq-c7'];
const pureFormulas = [
    "S (t) = sin (2πt), t ∈ [0,1]", "Ω = π. ∞", "S(t) = A . sin(ωt + φ)", 
    "R(V) = K . sin(n . V)  [n=6]", "x(t) = a* (t + sin(t) + e^(k*(t/2π)) * cos(t))",
    "y(t) = b* (t + sin(t) + e^(k*(t/2π)) * sin(t))", "D (k, r, t) = ρ(t)⋅[H(k,r)+H0(k)]⋅dtdB⋅Θ(ΔH (t))",
    "T= (∣∣− {0}) S(t)", "Αἰών =(∣∣−{0})S(t)∩= ρ + Χρόnos + Triskelion + Ω = ρ= S (0)=sin(0)=0",
    "Χρόnos= S (0.25)=sin(← 2π→)=1", "Καιρός= S (0.5)=sin(π)=0", "Triskelion= S (0.75) = sin (← 23π →) =−1",
    "Ω= S(1)=sin(2π)=0(∣∣+{0})", "(∣∣− {0})", "X (θ, ϕ) ∩=←(R+Ksin(nϕ) cos(ϕ)→) ⋅cos(θ)",
    "Y (θ, ϕ) ∩=←(R+Ksin(nϕ) cos(ϕ)→) ⋅sin(θ)", "Z (θ, ϕ) ∩=Ksin(nϕ) sin(ϕ) (∣∣+ {0})",
    "θ,ϕ∈[0,2π] (∣∣+{0})", "∀Xi ∈ R, ∃ Xj, ∈ R : Xj = −Xi", "S (t) = A . sin(ωt+ϕ)",
    "K1 = ± 230", "K2 = ± 720", "K3 = ± 490"
];
const cornerTopLeft = ["6894", "6404", "----", "5944", "5454", "4970"];
const cornerBottomRight = ["-720", "-490", "-230", "0", "+230", "+490", "+720"];
let currentTrack = 0, audioCtx, canvas, ctx, mouseX = 0, mouseY = 0, rotation = 0;
function initGeometry() {
    canvas = document.getElementById('hexagon-canvas'); ctx = canvas.getContext('2d');
    canvas.width = 750; canvas.height = 750;
    const cursor = document.getElementById('triangle-cursor');
    window.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px';
        const rect = canvas.getBoundingClientRect();
        mouseX = (e.clientX - rect.left) - (rect.width / 2);
        mouseY = (e.clientY - rect.top) - (rect.height / 2);
    });
}
function drawHex(scale, rot, highlightIntensity) {
    const x = canvas.width/2, y = canvas.height/2, size = 230 * scale;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 6; i++) {
        const a1 = (i * Math.PI / 3) + rot, a2 = ((i+1) * Math.PI / 3) + rot;
        const p1 = { x: x + size * Math.cos(a1), y: y + size * Math.sin(a1) }, p2 = { x: x + size * Math.cos(a2), y: y + size * Math.sin(a2) };
        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.25 + highlightIntensity})`;
        ctx.lineWidth = 1.5 + (highlightIntensity * 6); ctx.stroke();
    }
}
function animate() {
    const now = Date.now() / 1000;
    const pulse = (Math.sin(2 * Math.PI * now / 8) + 1) / 2;
    rotation += 0.0008;
    const dist = Math.sqrt(mouseX*mouseX + mouseY*mouseY);
    const highlight = (dist > 190 && dist < 280) ? 0.9 : 0;
    const tube = document.getElementById('light-tube');
    tube.style.opacity = (Math.abs(mouseX) < 25) ? "1" : "0.5";
    drawHex(1 + pulse * 0.08, rotation, highlight);
    requestAnimationFrame(animate);
}
function playProtocol() {
    const audio = document.getElementById(audioIds[currentTrack]);
    audio.play();
    audio.onended = () => { currentTrack = (currentTrack + 1) % audioIds.length; playProtocol(); };
}
function cycleCornerData() {
    let tlIdx = 0, brIdx = 0;
    setInterval(() => {
        document.getElementById('corner-top-left').textContent = cornerTopLeft[tlIdx];
        tlIdx = (tlIdx + 1) % cornerTopLeft.length;
        document.getElementById('corner-bottom-right').textContent = cornerBottomRight[brIdx];
        brIdx = (brIdx + 1) % cornerBottomRight.length;
    }, 4000);
}
function cycleFormulas() {
    const areas = ['f-left-top', 'f-left-bottom', 'f-right-top', 'f-right-bottom'];
    areas.forEach(id => {
        const el = document.getElementById(id);
        const update = () => {
            el.textContent = pureFormulas[Math.floor(Math.random() * pureFormulas.length)];
            el.classList.add('visible');
            setTimeout(() => { el.classList.remove('visible'); }, 2000);
        };
        setTimeout(update, Math.random() * 8000);
    });
    setTimeout(cycleFormulas, 10000);
}
setInterval(() => {
    const now = new Date();
    document.getElementById('corner-top-right').textContent = `UTC ${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}`;
}, 1000);
async function initAll() { initGeometry(); animate(); playProtocol(); cycleCornerData(); cycleFormulas(); }
window.initAll = initAll;
