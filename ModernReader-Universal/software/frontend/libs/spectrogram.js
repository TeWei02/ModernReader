// Dummy spectrogram generator for demo (real from audio later)
function generateSpectrogramData() {
    const data = [];
    for (let t = 0; t < 100; t++) {
        const row = [];
        for (let f = 0; f < 64; f++) {
            row.push(Math.random() * 100);
        }
        data.push(row);
    }
    return data;
}

