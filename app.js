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
const cornerTopLeft = ["6894", "6404", "----", "5944", "5454", "4970"];
const cornerBottomRight = ["-720", "-490", "-230", "0", "+230", "+490", "+720"];
const passiveMessages = {
    "Child": "Magic is the first geometry.",
    "Adolescent": "The patterns are calling you.",
    "Administrator": "Bunker systems operational. Welcome, Arquiteto.",
    "Academic": "The axiom is a manifest truth.",
    "Investor": "Stability achieved. Scale inevitable."
};
let currentTrack = 0, audioCtx, canvas, ctx, mouseX = 0, mouseY = 0, rotation = 0;
let userProfile = "Child", interactionCount = 0, startTime = Date.now();
let chalkCanvas, chalkCtx;
function initGeometry() {
    canvas = document.getElementById('hexagon-canvas'); ctx = canvas.getContext('2d');
    canvas.width = 750; canvas.height = 750;
    chalkCanvas = document.getElementById('chalk-canvas'); chalkCtx = chalkCanvas.getContext('2d');
    chalkCanvas.width = 250; chalkCanvas.height = 250;
    const cursor = document.getElementById('triangle-cursor');
    window.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px';
        const rect = canvas.getBoundingClientRect();
        mouseX = (e.clientX - rect.left) - (rect.width / 2);
        mouseY = (e.clientY - rect.top) - (rect.height / 2);
        updateProfiling(e);
    });
}
function updateProfiling(e) {
    interactionCount++;
    const speed = Math.abs(e.movementX) + Math.abs(e.movementY);
    const timeSpent = (Date.now() - startTime) / 1000;
    if (userProfile !== "Administrator") {
        if (interactionCount > 500) userProfile = "Academic";
        else if (timeSpent > 300) userProfile = "Investor";
        else if (speed > 100) userProfile = "Adolescent";
        else userProfile = "Child";
    }
    const clarityLevel = Math.min(9, Math.floor(interactionCount / 100));
    document.getElementById('corner-top-right').textContent = `CLARITY: K${clarityLevel}`;
    if (interactionCount > 0 && interactionCount % 200 === 0) {
        const msgBox = document.getElementById('passive-ai-output');
        if (msgBox) {
            msgBox.textContent = passiveMessages[userProfile];
            msgBox.style.opacity = 1;
            setTimeout(() => msgBox.style.opacity = 0, 4000);
        }
    }
}
async function drawChalkTriangles() {
    const triangles = [
        [{x:50,y:200}, {x:200,y:200}, {x:125,y:50}], 
        [{x:30,y:180}, {x:150,y:210}, {x:100,y:40}], 
        [{x:40,y:50}, {x:40,y:200}, {x:180,y:200}],  
        [{x:100,y:30}, {x:50,y:180}, {x:210,y:150}]  
    ];
    for (let t = 0; t < triangles.length; t++) {
        chalkCtx.clearRect(0, 0, 250, 250);
        chalkCtx.strokeStyle = "rgba(255,255,255,0.6)";
        chalkCtx.setLineDash([5, 5]);
        chalkCtx.lineWidth = 1.5;
        const points = triangles[t];
        for (let i = 0; i < 3; i++) {
            chalkCtx.beginPath();
            chalkCtx.moveTo(points[i].x, points[i].y);
            chalkCtx.lineTo(points[(i+1)%3].x, points[(i+1)%3].y);
            chalkCtx.stroke();
            await new Promise(r => setTimeout(r, 600));
        }
        await new Promise(r => setTimeout(r, 3000));
    }
    chalkCtx.clearRect(0, 0, 250, 250);
    chalkCtx.setLineDash([]);
    chalkCtx.strokeStyle = "#fff";
    chalkCtx.shadowBlur = 15; chalkCtx.shadowColor = "#fff";
    chalkCtx.lineWidth = 2;
    chalkCtx.font = "14px 'Gloria Hallelujah', cursive";
    chalkCtx.fillStyle = "#fff";
    const p = [{x:125,y:50}, {x:50,y:200}, {x:200,y:200}];
    chalkCtx.beginPath();
    chalkCtx.moveTo(p[0].x, p[0].y); chalkCtx.lineTo(p[1].x, p[1].y);
    chalkCtx.lineTo(p[2].x, p[2].y); chalkCtx.closePath();
    chalkCtx.stroke();
    chalkCtx.fillText("k1", p[0].x - 8, p[0].y - 12);
    chalkCtx.fillText("k2", p[1].x - 22, p[1].y + 15);
    chalkCtx.fillText("k3", p[2].x + 10, p[2].y + 15);
    await new Promise(r => setTimeout(r, 4000));
    drawChalkTriangles();
}
function drawHex(scale, rot, highlightIntensity) {
    const x = canvas.width/2, y = canvas.height/2, size = 230 * scale;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 6; i++) {
        const a1 = (i * Math.PI / 3) + rot, a2 = ((i+1) * Math.PI / 3) + rot;
        const p1 = { x: x + size * Math.cos(a1), y: y + size * Math.sin(a1) };
        const p2 = { x: x + size * Math.cos(a2), y: y + size * Math.sin(a2) };
        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.25 + highlightIntensity})`;
        ctx.lineWidth = 1.5 + (highlightIntensity * 6);
        ctx.stroke();
    }
}
function animate() {
    const now = Date.now() / 1000;
    const pulse = (Math.sin(2 * Math.PI * now / 8) + 1) / 2;
    rotation += 0.0008;
    const dist = Math.sqrt(mouseX*mouseX + mouseY*mouseY);
    const highlight = (dist > 190 && dist < 280) ? 0.9 : 0;
    const tube = document.getElementById('light-tube');
    if (tube) tube.style.opacity = (Math.abs(mouseX) < 25) ? "1" : "0.5";
    drawHex(1 + pulse * 0.08, rotation, highlight);
    requestAnimationFrame(animate);
}
function playProtocol() {
    const audio = document.getElementById(audioIds[currentTrack]);
    if (audio) {
        audio.play().catch(e => console.log("Awaiting interaction"));
        audio.onended = () => { 
            currentTrack = (currentTrack + 1) % audioIds.length; 
            playProtocol(); 
        };
    }
}
function cycleCornerData() {
    let tlIdx = 0, brIdx = 0;
    setInterval(() => {
        const tlEl = document.getElementById('corner-top-left');
        const brEl = document.getElementById('corner-bottom-right');
        if (tlEl) { tlEl.textContent = cornerTopLeft[tlIdx]; tlIdx = (tlIdx + 1) % cornerTopLeft.length; }
        if (brEl) { brEl.textContent = cornerBottomRight[brIdx]; brIdx = (brIdx + 1) % cornerBottomRight.length; }
    }, 4000);
}
function cycleFormulas() {
    const areas = ['f-left-top', 'f-left-bottom', 'f-right-top', 'f-right-bottom'];
    areas.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const update = () => {
            el.textContent = pureFormulas[Math.floor(Math.random() * pureFormulas.length)];
            el.classList.add('visible');
            setTimeout(() => { el.classList.remove('visible'); }, 2000);
        };
        setTimeout(update, Math.random() * 8000);
    });
    setTimeout(cycleFormulas, 10000);
}
document.getElementById('user-input').addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        const val = e.target.value; e.target.value = '';
        if (val.toUpperCase() === 'RG-6174') { 
            userProfile = "Administrator"; 
            document.getElementById('bunker-container').classList.add('bunker-active'); 
            return; 
        }
        const msgBox = document.getElementById('passive-ai-output');
        if (msgBox) { msgBox.style.opacity = 1; msgBox.textContent = "Convergindo..."; }
        try {
            const res = await fetch('/api/convergence', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ prompt: val }) 
            });
            const data = await res.json();
            const utc = new Date().toUTCString().split(' ')[4].substring(0, 5);
            document.getElementById('seed-box').textContent = `${data.seed} - UTC ${utc}`;
            if (msgBox) { msgBox.textContent = data.message; }
        } catch (err) {
            if (msgBox) { msgBox.textContent = "ERRO DE SINCRONIA"; }
        }
    }
});
async function initAll() { 
    initGeometry(); 
    animate(); 
    playProtocol(); 
    cycleCornerData(); 
    cycleFormulas(); 
    drawChalkTriangles(); 
}
window.initAll = initAll;
