let currentSeed = "6174-000000";

async function initAll() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    console.log("Sincronia iniciada.");
}

document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    updatePhase(x, y);
});

function updatePhase(x, y) {
    const fLeft = document.getElementById('f-left');
    const fRight = document.getElementById('f-right');
    if (x < 0.3) { fLeft.style.opacity = "0.4"; } 
    else { fLeft.style.opacity = "0"; }
    if (x > 0.7) { fRight.style.opacity = "0.4"; }
    else { fRight.style.opacity = "0"; }
}

async function sendIntent() {
    const intent = document.getElementById('intent-input').value;
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seed: currentSeed, message: intent })
    });
    const data = await response.json();
    document.getElementById('display-center').innerText = data.response;
    document.getElementById('display-center').style.opacity = "1";
}

document.getElementById('intent-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendIntent();
});

async function uploadFile(input) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
        const base64Data = e.target.result.split(',')[1];
        await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                seed: currentSeed, 
                file: { name: file.name, data: base64Data, type: file.type } 
            })
        });
    };
    reader.readAsDataURL(file);
}