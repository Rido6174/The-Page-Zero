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
    "Ω= S(1)=sin(2π)=0(∣∣+{0})", "X (θ, ϕ) ∩=←(R+Ksin(nϕ) cos(ϕ)→) ⋅cos(θ)",
    "Y (θ, ϕ) ∩=←(R+Ksin(nϕ) cos(ϕ)→) ⋅sin(θ)", "Z (θ, ϕ) ∩=Ksin(nϕ) sin(ϕ) (∣∣+ {0})",
    "∀Xi ∈ R, ∃ Xj, ∈ R : Xj = −Xi", "S (t) = A . sin(ωt+ϕ)"
];
const cornerLeftValues = ["6894", "6404", "----", "5944", "5454", "4970"];
const cornerRightValues = ["-720", "-490", "-230", "0", "+230", "+490", "+720"];
const passiveAI = { "Child": "Magic is geometry.", "Adolescent": "Patterns emerge.", "Administrator": "Access granted.", "Academic": "Axiom defined.", "Investor": "Scale confirmed." };
let currentTrack = 0, audioCtx, canvas, ctx, mouseX = 0, mouseY = 0, rotation = 0;
let userProfile = "Child", interactionCount = 0, startTime = Date.now();
let chalkCanvas, chalkCtx;
function initGeometry() {
    canvas = document.getElementById('hexagon-canvas'); ctx = canvas.getContext('2d');
    canvas.width = 750; canvas.height = 750;
    chalkCanvas = document.getElementById('chalk-canvas'); chalkCtx = chalkCanvas.getContext('2d');
    chalkCanvas.width = 200; chalkCanvas.height = 200;
    const cursor = document.getElementById('triangle-cursor');
    window.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px';
        const rect = canvas.getBoundingClientRect();
        mouseX = (e.clientX - rect.left) - (rect.width / 2);
        mouseY = (e.clientY - rect.top) - (rect.height / 2);
        updateProfiling();
    });
}
function updateProfiling() {
    interactionCount++;
    const timeIn = (Date.now() - startTime) / 1000;
    if (interactionCount > 1000) userProfile = "Investor";
    else if (interactionCount > 500) userProfile = "Academic";
    else if (timeIn > 300) userProfile = "Adolescent";
    const kLevel = Math.min(9, Math.floor(interactionCount / 150));
    document.getElementById('corner-top-right').textContent = `CLARITY: K${kLevel}`;
    if (interactionCount % 300 === 0) {
        const aiBox = document.getElementById('ai-response-core');
        aiBox.textContent = passiveAI[userProfile]; aiBox.style.opacity = 0.6;
        setTimeout(() => aiBox.style.opacity = 0, 4000);
    }
}
async function drawChalkStudies() {
    const points = [[{x:40,y:160},{x:160,y:160},{x:100,y:40}], [{x:20,y:140},{x:120,y:170},{x:80,y:30}], [{x:30,y:40},{x:30,y:160},{x:150,y:160}], [{x:80,y:20},{x:40,y:150},{x:170,y:130}]];
    for (let p of points) {
        chalkCtx.clearRect(0, 0, 200, 200); chalkCtx.strokeStyle = "rgba(255,255,255,0.4)";
        for (let i = 0; i < 3; i++) {
            chalkCtx.beginPath(); chalkCtx.moveTo(p[i].x, p[i].y);
            chalkCtx.lineTo(p[(i+1)%3].x, p[(i+1)%3].y); chalkCtx.stroke();
            await new Promise(r => setTimeout(r, 600));
        }
        await new Promise(r => setTimeout(r, 3000));
    }
    chalkCtx.clearRect(0, 0, 200, 200); chalkCtx.strokeStyle = "#fff"; chalkCtx.shadowBlur = 10; chalkCtx.shadowColor = "#fff";
    chalkCtx.beginPath(); chalkCtx.moveTo(100,40); chalkCtx.lineTo(40,160); chalkCtx.lineTo(160,160); chalkCtx.closePath(); chalkCtx.stroke();
    chalkCtx.fillStyle = "#fff"; chalkCtx.font = "12px 'Gloria Hallelujah'";
    chalkCtx.fillText("k1", 95, 30); chalkCtx.fillText("k2", 25, 175); chalkCtx.fillText("k3", 165, 175);
    await new Promise(r => setTimeout(r, 4000));
    drawChalkStudies();
}
function drawHex(scale, rot, intensity) {
    const x = canvas.width/2, y = canvas.height/2, size = 230 * scale;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 6; i++) {
        const a1 = (i * Math.PI / 3) + rot, a2 = ((i+1) * Math.PI / 3) + rot;
        ctx.beginPath(); ctx.moveTo(x + size * Math.cos(a1), y + size * Math.sin(a1));
        ctx.lineTo(x + size * Math.cos(a2), y + size * Math.sin(a2));
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 + intensity})`;
        ctx.lineWidth = 1.5 + (intensity * 6); ctx.stroke();
    }
}
function animate() {
    const now = Date.now() / 1000;
    const pulse = (Math.sin(2 * Math.PI * now / 8) + 1) / 2;
    rotation += 0.0008;
    const dist = Math.sqrt(mouseX*mouseX + mouseY*mouseY);
    const highlight = (dist > 190 && dist < 280) ? 0.9 : 0;
    document.getElementById('light-tube').style.opacity = (Math.abs(mouseX) < 30) ? "1" : "0.5";
    drawHex(1 + pulse * 0.08, rotation, highlight);
    requestAnimationFrame(animate);
}
function playSequencer() {
    const audio = document.getElementById(audioIds[currentTrack]);
    audio.play(); audio.onended = () => { currentTrack = (currentTrack + 1) % audioIds.length; playSequencer(); };
}
function cycleCorners() {
    let l=0, r=0;
    setInterval(() => {
        document.getElementById('corner-top-left').textContent = cornerLeftValues[l];
        document.getElementById('corner-bottom-right').textContent = cornerRightValues[r];
        l = (l+1)%cornerLeftValues.length; r = (r+1)%cornerRightValues.length;
    }, 4000);
}
function cycleFormulas() {
    const areas = ['f-left-top', 'f-left-bottom', 'f-right-top', 'f-right-bottom'];
    areas.forEach(id => {
        const el = document.getElementById(id);
        const upd = () => {
            el.textContent = pureFormulas[Math.floor(Math.random() * pureFormulas.length)];
            el.classList.add('visible'); setTimeout(() => el.classList.remove('visible'), 2000);
        };
        setTimeout(upd, Math.random() * 8000);
    });
    setTimeout(cycleFormulas, 10000);
}
document.getElementById('user-input').addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        const val = e.target.value; e.target.value = '';
        if (val.toUpperCase() === 'RG-6174') { userProfile = "Administrator"; document.getElementById('bunker-container').classList.add('bunker-active'); return; }
        const res = await fetch('/api/convergence', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: val }) });
        const data = await res.json();
        const utc = new Date().toUTCString().split(' ')[4].substring(0, 5);
        document.getElementById('seed-box').textContent = `${data.seed} - UTC ${utc}`;
    }
});
async function initAll() { initGeometry(); animate(); playSequencer(); cycleCorners(); cycleFormulas(); drawChalkStudies(); }
window.initAll = initAll;
