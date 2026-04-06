const audioIds = ['freq-a6', 'freq-d4', 'freq-b1', 'freq-c7'];
const pureFormulas = [
    "S (t) = sin (2πt), t ∈ [0,1]", "Ω = π. ∞", "S(t) = A . sin(ωt + φ)", 
    "R(V) = K . sin(n . V)  [n=6]", "x(t) = a* (t + sin(t) + e^(k*(t/2π)) * cos(t))",
    "y(t) = b* (t + sin(t) + e^(k*(t/2π)) * sin(t))", "D (k, r, t) = ρ(t)⋅[H(k,r)+H0(k)]⋅dtdB⋅Θ(ΔH (t))",
    "T= (∣∣− {0}) S(t)", "Αἰών =(∣∣−{0})S(t)∩= ρ + Χρόνος + Triskelion + Ω = ρ= S (0)=sin(0)=0",
    "Χρόνος= S (0.25)=sin(← 2π→)=1", "Καιρός= S (0.5)=sin(π)=0", "Triskelion= S (0.75) = sin (← 23π →) =−1",
    "Ω= S(1)=sin(2π)=0(∣∣+{0})", "X (θ, ϕ) ∩=←(R+Ksin(nϕ) cos(ϕ"
];
const cornerLeft = ["6174", "Φ", "ZERO"];
const cornerRight = ["BUNKER", "ALPHA", "RG-6174"];
let audioCtx;
const audios = {};
const cursor = document.getElementById('triangle-cursor');
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});
const updateClock = () => {
    const now = new Date();
    const utc = now.toISOString().replace('T', ' ').split('.')[0];
    const el = document.getElementById('corner-top-right');
    if (el) el.textContent = utc;
};
const initAudio = () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        audioIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                audios[id] = audioCtx.createMediaElementSource(el);
                const gainNode = audioCtx.createGain();
                gainNode.gain.value = 0.4; 
                audios[id].connect(gainNode).connect(audioCtx.destination);
            }
        });
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
};
const startSequencer = () => {
    let count = 0;
    setInterval(() => {
        const id = audioIds[count % audioIds.length];
        const el = document.getElementById(id);
        if (el) {
            el.currentTime = 0;
            el.play().catch(() => {});
        }
        count++;
    }, 4000); 
};
const drawChalkStudies = () => {
    const canvas = document.getElementById('hexagon-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = 800; canvas.height = 800;
    const drawHex = (size, alpha, rotate) => {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
        ctx.lineWidth = 1;
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i + rotate;
            const x = 400 + size * Math.cos(angle);
            const y = 400 + size * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
    };
    const animate = () => {
        ctx.clearRect(0, 0, 800, 800);
        const time = Date.now() * 0.0005;
        for (let i = 0; i < 8; i++) {
            const size = 180 + i * 25 + Math.sin(time + i) * 15;
            drawHex(size, 0.05 + (i * 0.02), time * 0.1 * (i % 2 === 0 ? 1 : -1));
        }
        requestAnimationFrame(animate);
    };
    animate();
};
window.initAll = () => {
    initAudio();
    startSequencer();
    drawChalkStudies();
    setInterval(() => {
        const ctl = document.getElementById('corner-top-left');
        const cbr = document.getElementById('corner-bottom-right');
        if (ctl) ctl.textContent = cornerLeft[Math.floor(Date.now()/5000) % cornerLeft.length];
        if (cbr) cbr.textContent = cornerRight[Math.floor(Date.now()/5000) % cornerRight.length];
    }, 5000);
    setInterval(updateClock, 1000);
    updateClock();
    const areas = ['f-left-top', 'f-left-bottom', 'f-right-top', 'f-right-bottom'];
    areas.forEach((id, index) => {
        const cycle = () => {
            const el = document.getElementById(id);
            if (el) {
                el.textContent = pureFormulas[Math.floor(Math.random() * pureFormulas.length)];
                el.classList.add('visible');
                setTimeout(() => { 
                    el.classList.remove('visible'); 
                    setTimeout(cycle, 2000 + Math.random() * 3000); 
                }, 5000);
            }
        };
        setTimeout(cycle, index * 1500);
    });
};
document.getElementById('user-input').addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        const val = e.target.value; 
        e.target.value = '';
        try {
            const res = await fetch('/api/convergence', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: val }) 
            });
            const data = await res.json();
            if (data.seed) {
                document.getElementById('seed-box').textContent = `${data.utc} | ${data.seed}`;
            }
        } catch (err) {
            console.error("Erro na convergência:", err);
        }
    }
});
