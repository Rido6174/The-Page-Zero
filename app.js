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
const cornerLeft = ["6894", "6404", "----", "5944", "5454", "4970"];
const passiveAI = {
    "Child": "Magic is the first geometry.",
    "Adolescent": "The patterns are calling you.",
    "Administrator": "Bunker operational. Welcome, Arquiteto.",
    "Academic": "The axiom is a manifest truth.",
    "Investor": "Stability achieved. Scale invitable."
};
let currentTrack = 0, canvas, ctx, mouseX = 0, mouseY = 0, rotation = 0;
let userProfile = "Child", interactionDepth = 0, startTime = Date.now();
let chalkCanvas, chalkCtx, isInitialized = false;
function initGeometry() {
    canvas = document.getElementById('hexagon-canvas'); ctx = canvas.getContext('2d');
    canvas.width = 750; canvas.height = 750;
    chalkCanvas = document.getElementById('chalk-canvas'); chalkCtx = chalkCanvas.getContext('2d');
    chalkCanvas.width = 250; chalkCanvas.height = 250;
    window.addEventListener('mousemove', (e) => {
        const cursor = document.getElementById('triangle-cursor');
        if(cursor) { cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; }
        const rect = canvas.getBoundingClientRect();
        mouseX = (e.clientX - rect.left) - (rect.width / 2);
        mouseY = (e.clientY - rect.top) - (rect.height / 2);
        updateProfiling(e);
    });
}
function updateProfiling(e) {
    interactionDepth++;
    const speed = Math.abs(e.movementX) + Math.abs(e.movementY);
    const timeSpent = (Date.now() - startTime) / 1000;

    if (interactionDepth > 1000) userProfile = "Investor";
    else if (interactionDepth > 500) userProfile = "Academic";
    else if (speed > 120) userProfile = "Adolescent";
    else userProfile = "Child";
    const kLevel = Math.min(9, Math.floor(interactionDepth / 100));
    document.getElementById('corner-top-right').textContent = `CLARITY: K${kLevel}`;
    if (interactionDepth % 250 === 0) {
        const box = document.getElementById('passive-ai-box');
        box.textContent = passiveAI[userProfile]; box.style.opacity = 1;
        setTimeout(() => box.style.opacity = 0, 4000);
    }
}
async function drawChalkTriangles() {
    const triangles = [
        [{x:50,y:200}, {x:200,y:200}, {x:125,y:50}], [{x:30,y:180}, {x:150,y:210}, {x:100,y:40}],
        [{x:40,y:50}, {x:40,y:200}, {x:180,y:200}], [{x:100,y:30}, {x:50,y:180}, {x:210,y:150}]
    ];
    for (let t of triangles) {
        chalkCtx.clearRect(0, 0, 250, 250); chalkCtx.strokeStyle = "rgba(255,255,255,0.5)";
        chalkCtx.setLineDash([4, 4]);
        for (let i = 0; i < 3; i++) {
            chalkCtx.beginPath(); chalkCtx.moveTo(t[i].x, t[i].y);
            chalkCtx.lineTo(t[(i+1)%3].x, t[(i+1)%3].y); chalkCtx.stroke();
            await new Promise(r => setTimeout(r, 600));
        }
        await new Promise(r => setTimeout(r, 3000));
    }
    chalkCtx.clearRect(0, 0, 250, 250); chalkCtx.setLineDash([]);
    chalkCtx.strokeStyle = "#fff"; chalkCtx.shadowBlur = 15; chalkCtx.shadowColor = "#fff";
    chalkCtx.beginPath(); chalkCtx.moveTo(125,50); chalkCtx.lineTo(50,200); chalkCtx.lineTo(200,200); chalkCtx.closePath(); chalkCtx.stroke();
    chalkCtx.fillStyle = "#fff"; chalkCtx.font = "14px 'Gloria Hallelujah'";
    chalkCtx.fillText("k1", 120, 40); chalkCtx.fillText("k2", 30, 215); chalkCtx.fillText("k3", 205, 215);
    await new Promise(r => setTimeout(r, 4000)); drawChalkTriangles();
}
function drawHex(scale, rot, intensity) {
    const x = canvas.width/2, y = canvas.height/2, size = 230 * scale;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 6; i++) {
        const a1 = (i * Math.PI / 3) + rot, a2 = ((i+1) * Math.PI / 3) + rot;
        ctx.beginPath(); ctx.moveTo(x + size * Math.cos(a1), y + size * Math.sin(a1));
        ctx.lineTo(x + size * Math.cos(a2), y + size * Math.sin(a2));
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.25 + intensity})`;
        ctx.lineWidth = 1.5 + (intensity * 6); ctx.stroke();
    }
}
function animate() {
    const now = Date.now() / 1000;
    const pulse = (Math.sin(2 * Math.PI * now / 8) + 1) / 2;
    rotation += 0.0008;
    const dist = Math.sqrt(mouseX*mouseX + mouseY*mouseY);
    const highlight = (dist > 190 && dist < 280) ? 0.9 : 0;
    document.getElementById('light-tube').style.opacity = (Math.abs(mouseX) < 25) ? "1" : "0.5";
    drawHex(1 + pulse * 0.08, rotation, highlight);
    requestAnimationFrame(animate);
}
function playProtocol() {
    const audio = document.getElementById(audioIds[currentTrack]);
    if (audio) { audio.play(); audio.onended = () => { currentTrack = (currentTrack + 1) % audioIds.length; playProtocol(); }; }
}
window.initAll = function() {
    if(isInitialized) return; isInitialized = true;
    initGeometry(); animate(); playProtocol(); drawChalkTriangles();
    setInterval(() => {
        document.getElementById('corner-top-left').textContent = cornerLeft[Math.floor(Date.now()/4000) % cornerLeft.length];
        const utc = new Date().toUTCString().split(' ')[4].substring(0, 5);
        document.getElementById('corner-bottom-right').textContent = `0 (UTC ${utc})`;
    }, 4000);
};
document.getElementById('user-input').addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        const val = e.target.value; e.target.value = '';
        const res = await fetch('/api/convergence', { method: 'POST', body: JSON.stringify({ prompt: val }) });
        const data = await res.json();
        const utc = new Date().toUTCString().split(' ')[4].substring(0, 5);
        document.getElementById('seed-box').textContent = `${data.seed} - UTC ${utc}`;
    }
});
