let audioStarted = false;
let audioFiles = { A6: 'audio_a6.mp3', B1: 'audio_b1.mp3', C7: 'audio_c7.mp3', D4: 'audio_d4.mp3' };

async function initAll() {
    if (audioStarted) return;
    audioStarted = true;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    playTrack(audioFiles.D4, ctx, 0.4);
    setTimeout(() => playTrack(audioFiles.B1, ctx, 0.6), 8000);
    setTimeout(() => playTrack(audioFiles.C7, ctx, 0.5), 16000);
    geometryPulse();
}

function playTrack(url, ctx, vol) {
    const audio = new Audio(url);
    const source = ctx.createMediaElementSource(audio);
    const gain = ctx.createGain();
    gain.gain.value = vol;
    source.connect(gain).connect(ctx.destination);
    audio.play();
}

function geometryPulse() {
    const t = Date.now() / 1000;
    const s_t = Math.sin(2 * Math.PI * 0.125 * t);
    const hexagon = document.querySelector('.hexagon');
    if (hexagon) {
        hexagon.style.opacity = 0.2 + (0.8 * (s_t + 1) / 2);
        hexagon.style.transform = `scale(${1 + 0.05 * s_t}) rotate(${t * 3}deg)`;
    }
    requestAnimationFrame(geometryPulse);
}

document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const display = document.getElementById('display-center');
    const fLeft = document.getElementById('f-left');
    if (!display || !fLeft) return;
    display.style.opacity = "1";
    if (x < 0.20) { display.innerText = "ALEGRIA"; fLeft.style.opacity = "0"; }
    else if (x < 0.40) { display.innerText = "DESCOBERTA"; fLeft.style.opacity = "0"; }
    else if (x < 0.60) { display.innerText = "INTEGRIDADE"; fLeft.style.opacity = "0"; }
    else if (x < 0.80) { display.innerText = "UNIFICAÇÃO"; fLeft.style.opacity = "0.4"; }
    else { display.innerText = "ESCALA"; fLeft.style.opacity = "0"; }
});
