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
const cornerRight = ["UTC 00:00", "BUNKER", "ALPHA"];
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
    document.getElementById('corner-top-right').textContent = utc;
};
const initAudio = () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        audioIds.forEach(id => {
            const el = document.getElementById(id);
            audios[id] = audioCtx.createMediaElementSource(el);
            audios[id].connect(audioCtx.destination);
        });
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
};
const startSequencer = () => {
    let count = 0;
    setInterval(() => {
        const id = audioIds[count % audioIds.length];
        const el = document.getElementById(id);
        el.currentTime = 0;
        el.play().catch(() => {});
        count++;
    }, 2000);
};
const drawChalkStudies = () => {
    const canvas = document.getElementById('hexagon-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 600; canvas.height = 600;
    const drawHex = (size, alpha) => {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
        ctx.lineWidth = 1;
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const x = 300 + size * Math.cos(angle);
            const y = 300 + size * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
    };
    const animate = () => {
        ctx.clearRect(0, 0, 600, 600);
        const time = Date.now() * 0.001;
        for (let i = 0; i < 5; i++) {
            const size = 150 + Math.sin(time + i) * 30;
            drawHex(size, 0.1 + (i * 0.05));
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
        document.getElementById('corner-top-left').textContent = cornerLeft[Math.floor(Date.now()/4000) % cornerLeft.length];
        document.getElementById('corner-bottom-right').textContent = cornerRight[Math.floor(Date.now()/4000) % cornerRight.length];
    }, 4000);
    setInterval(updateClock, 1000);
    updateClock();
    const areas = ['f-left-top', 'f-left-bottom', 'f-right-top', 'f-right-bottom'];
    areas.forEach((id, index) => {
        const cycle = () => {
            const el = document.getElementById(id);
            if(el) {
                el.textContent = pureFormulas[Math.floor(Math.random() * pureFormulas.length)];
                el.classList.add('visible');
                setTimeout(() => { 
                    el.classList.remove('visible'); 
                    setTimeout(cycle, 1500 + Math.random() * 2000); 
                }, 4000);
            }
        };
        setTimeout(cycle, index * 1000);
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
            console.error("Convergência falhou:", err);
        }
    }
});
