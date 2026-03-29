const audioIds = ['freq-a6', 'freq-d4', 'freq-b1', 'freq-c7'];
const pureFormulas = [
    "S (t) = sin (2πt), t ∈ [0,1]", "Ω = π. ∞", "S(t) = A . sin(ωt + φ)", 
    "R(V) = K . sin(n . V)  [n=6]", "x(t) = a* (t + sin(t) + e^(k*(t/2π)) * cos(t))",
    "y(t) = b* (t + sin(t) + e^(k*(t/2π)) * sin(t))", "D (k, r, t) = ρ(t)⋅[H(k,r)+H0(k)]⋅dtdB⋅Θ(ΔH (t))",
    "T= (∣∣− {0}) S(t)", "Αἰών =(∣∣−{0})S(t)∩= ρ + Χρόνος + Triskelion + Ω = ρ= S (0)=sin(0)=0",
    "Χρόνος= S (0.25)=sin(← 2π→)=1", "Καιρός= S (0.5)=sin(π)=0", "Triskelion= S (0.75) = sin (← 23π →) =−1",
    "Ω= S(1)=sin(2π)=0(∣∣+{0})", "(∣∣− {0})", "X (θ, ϕ) ∩=←(R+Ksin(nϕ) cos(ϕ)→) ⋅cos(θ)",
    "Y (θ, ϕ) ∩=←(R+Ksin(nϕ) cos(ϕ)→) ⋅sin(θ)", "Z (θ, ϕ) ∩=Ksin(nϕ) sin(ϕ) (∣∣+ {0})",
    "θ,ϕ∈[0,2π] (∣∣+{0})", "∀Xi ∈ R, ∃ Xj, ∈ R : Xj = −Xi", "S (t) = A . sin(ωt+ϕ)",
    "K1 = ± 230", "K2 = ± 720", "K3 = ± 490"
];
const cornerLeftValues = ["6894", "6404", "----", "5944", "5454", "4970"];
const cornerRightValues = ["-720", "-490", "-230", "0", "+230", "+490", "+720"];
let currentTrack = 0, canvas, ctx, mouseX = 0, mouseY = 0, rotation = 0;
let isInitialized = false, chalkCanvas, chalkCtx;
function initGeometry() {
    canvas = document.getElementById('hexagon-canvas'); ctx = canvas.getContext('2d');
    canvas.width = 750; canvas.height = 750;
    chalkCanvas = document.getElementById('chalk-canvas'); chalkCtx = chalkCanvas.getContext('2d');
    chalkCanvas.width = 250; chalkCanvas.height = 250;
    window.addEventListener('mousemove', (e) => {
        const cur = document.getElementById('triangle-cursor');
        if(cur) { cur.style.left = e.clientX + 'px'; cur.style.top = e.clientY + 'px'; }
        const rect = canvas.getBoundingClientRect();
        mouseX = (e.clientX - rect.left) - (rect.width / 2);
        mouseY = (e.clientY - rect.top) - (rect.height / 2);
    });
}
async function drawChalkStudies() {
    const tris = [[{x:50,y:180},{x:200,y:180},{x:125,y:50}], [{x:30,y:160},{x:140,y:190},{x:90,y:40}], [{x:40,y:40},{x:40,y:180},{x:170,y:180}], [{x:90,y:20},{x:40,y:160},{x:180,y:140}]];
    for (let t of tris) {
        if(!chalkCtx) return;
        chalkCtx.clearRect(0,0,250,250); chalkCtx.strokeStyle = "rgba(255,255,255,0.45)";
        chalkCtx.setLineDash([4,4]); chalkCtx.lineWidth = 1.3;
        for (let i=0; i<3; i++) {
            chalkCtx.beginPath(); chalkCtx.moveTo(t[i].x, t[i].y);
            chalkCtx.lineTo(t[(i+1)%3].x, t[(i+1)%3].y); chalkCtx.stroke();
            await new Promise(r => setTimeout(r, 650));
        }
        await new Promise(r => setTimeout(r, 3000));
    }
    chalkCtx.clearRect(0,0,250,250); chalkCtx.setLineDash([]); chalkCtx.strokeStyle="#fff"; chalkCtx.shadowBlur=15; chalkCtx.shadowColor="#fff";
    chalkCtx.beginPath(); chalkCtx.moveTo(125,50); chalkCtx.lineTo(50,200); chalkCtx.lineTo(200,200); chalkCtx.closePath(); chalkCtx.stroke();
    chalkCtx.fillStyle="#fff"; chalkCtx.font="14px 'Architects Daughter'";
    chalkCtx.fillText("k1", 120, 40); chalkCtx.fillText("k2", 30, 215); chalkCtx.fillText("k3", 205, 215);
    await new Promise(r => setTimeout(r, 4000)); drawChalkStudies();
}
function drawHex(scale, rot, intensity) {
    if(!ctx) return;
    const x = canvas.width/2, y = canvas.height/2, size = 230 * scale;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 6; i++) {
        const a1 = (i * Math.PI / 3) + rot, a2 = ((i+1) * Math.PI / 3) + rot;
        ctx.beginPath(); ctx.moveTo(x + size * Math.cos(a1), y + size * Math.sin(a1));
        ctx.lineTo(x + size * Math.cos(a2), y + size * Math.sin(a2));
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.25 + intensity})`;
        ctx.lineWidth = 1.6 + (intensity * 6); ctx.stroke();
    }
}
function animate() {
    const now = Date.now() / 1000;
    const pulse = (Math.sin(2 * Math.PI * now / 8) + 1) / 2;
    rotation += 0.0008;
    const dist = Math.sqrt(mouseX*mouseX + mouseY*mouseY);
    const highlight = (dist > 190 && dist < 280) ? 0.9 : 0;
    drawHex(1 + pulse * 0.08, rotation, highlight);
    requestAnimationFrame(animate);
}
function playSequencer() {
    const audio = document.getElementById(audioIds[currentTrack]);
    if (audio) { audio.play().catch(e => {}); audio.onended = () => { currentTrack = (currentTrack + 1) % audioIds.length; playSequencer(); }; }
}
function updateClock() {
    const now = new Date();
    const h = String(now.getUTCHours()).padStart(2,'0'), m = String(now.getUTCMinutes()).padStart(2,'0');
    const timeStr = `UTC ${h}:${m}`;
    document.getElementById('corner-top-right').textContent = timeStr;
    const sBox = document.getElementById('seed-box');
    if (sBox && sBox.textContent.includes('XXXXXXXX')) {
        sBox.textContent = `6174 - XXXXXXXX - ${timeStr}`;
    }
}
window.initAll = function() {
    if(isInitialized) return; 
    isInitialized = true;
    initGeometry(); animate(); playSequencer(); drawChalkStudies();
    setInterval(() => {
        document.getElementById('corner-top-left').textContent = cornerLeftValues[Math.floor(Date.now()/4000) % cornerLeftValues.length];
        document.getElementById('corner-bottom-right').textContent = cornerRightValues[Math.floor(Date.now()/4000) % cornerRightValues.length];
    }, 4000);
    setInterval(updateClock, 1000);
    updateClock();
    cycleFormulas();
};
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
        const res = await fetch('/api/convergence', { method: 'POST', body: JSON.stringify({ prompt: val }) });
        const data = await res.json();
        const now = new Date();
        const timeStr = `UTC ${String(now.getUTCHours()).padStart(2,'0')}:${String(now.getUTCMinutes()).padStart(2,'0')}`;
        document.getElementById('seed-box').textContent = `${data.seed} - ${timeStr}`;
    }
});
