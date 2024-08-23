const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let audioContext;
let analyser;
let dataArray;

function initAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    // Capturar el audio de la fuente de música del dispositivo
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            drawScene();
        })
        .catch(err => {
            console.error('Error al capturar el audio:', err);
        });
}

function drawOcean() {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#003'); // Azul marino profundo
    gradient.addColorStop(1, '#009'); // Azul brillante
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawWave() {
    analyser.getByteFrequencyData(dataArray);

    const averageVolume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

    ctx.strokeStyle = `rgba(255, 255, 255, ${0.5 + averageVolume / 256})`;
    ctx.lineWidth = 2 + (averageVolume / 32); // Aumentar el grosor de la línea con el volumen
    ctx.beginPath();
    const waveHeight = 30 + (averageVolume / 2); // Aumentar la altura de la ola en función del volumen
    const waveLength = 100;

    for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + Math.sin((x + (averageVolume * 5)) / waveLength * 2 * Math.PI) * waveHeight;
        ctx.lineTo(x, y);
    }

    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + averageVolume / 512})`; // Ajustar la opacidad del relleno
    ctx.fill();
}

function drawSierpinski(x, y, size, depth) {
    if (depth === 0) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + size, y);
        ctx.lineTo(x + size / 2, y - Math.sqrt(3) / 2 * size);
        ctx.closePath();
        ctx.strokeStyle = '#ff0'; // Color amarillo para el fractal
        ctx.lineWidth = 1;
        ctx.stroke();
        return;
    }
    
    const newSize = size / 2;
    drawSierpinski(x, y, newSize, depth - 1);
    drawSierpinski(x + newSize, y, newSize, depth - 1);
    drawSierpinski(x + newSize / 2, y - Math.sqrt(3) / 2 * newSize, newSize, depth - 1);
}

function drawScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas antes de redibujar
    drawOcean();
    drawWave();
    drawSierpinski(canvas.width / 2 - 100, canvas.height / 2 + 50, 200, 4);

    requestAnimationFrame(drawScene);
}

initAudio();
