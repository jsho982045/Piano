function setup() {
    let audioContext = new AudioContext();
    let oscList = [];

    let mainGainNode = audioContext.createGain();
    mainGainNode.connect(audioContext.destination);

    function playTone(freqValue) {
        let osc = audioContext.createOscillator();
        osc.connect(mainGainNode);
        osc.type = 'sine';
        osc.frequency.value = freqValue;
        osc.start();
        return osc;
    }

    function notePressed(event, freq) {
        event.target.style.backgroundColor = 'lightgray';
        oscList[event.target.id] = playTone(freq);
    }

    function noteReleased(event) {
        event.target.style.backgroundColor = '';
        oscList[event.target.id].stop();
        oscList[event.target.id] = undefined;
    }

    let keyMap = {
        'C' : 130.81, 'C#': 138.59, 'D': 146.83, 'D#': 155.56, 'E': 164.81, 'F': 174.61, 'F#': 185.00, 'G': 196.00, 'G#': 207.65, 'A': 220.00, 'A#': 233.08, 'B': 246.94,
        'C2': 261.63, 'C#2': 277.18, 'D2': 293.66, 'D#2': 311.13, 'E2': 329.63, 'F2': 349.23, 'F#2': 369.99, 'G2': 392.00, 'G#2': 415.30, 'A2': 440.00, 'A#2': 466.16, 'B2': 493.88,
        'C3': 523.25, 'C#3': 554.37, 'D3': 587.33, 'D#3': 622.25, 'E3': 659.25, 'F3': 698.46, 'F#3': 739.99, 'G3': 783.99, 'G#3': 830.61, 'A3': 880.00, 'A#3': 932.33, 'B3': 987.77,
    };

    document.querySelectorAll('.key').forEach(function(key) {
        key.addEventListener('mousedown', function(event) {
            notePressed(event, keyMap[key.id]);
        });
        key.addEventListener('mouseup', function(event) {
            noteReleased(event);
        });
        key.addEventListener('mouseleave', function(event) {
            if(oscList[key.id]) {
                noteReleased(event);
            }
        });
    });

    // Adjust black key positions
    function adjustBlackKeys() {
        // Define the left offsets for each black key manually
        let blackKeyOffsets = {
            'C#': 35, 'D#': 80,
            'F#': 170, 'G#': 215, 'A#': 260,
            'C#2': 355, 'D#2': 400,
            'F#2': 490, 'G#2': 535, 'A#2': 580,
            'C#3': 675, 'D#3': 720,
            'F#3': 805, 'G#3': 850, 'A#3': 900
        };

        document.querySelectorAll('.key.black').forEach((key) => {
            // Use the offsets defined above to set the position of each black key
            key.style.left = blackKeyOffsets[key.id] + 'px';
        });
    }

    adjustBlackKeys(); // Call the function immediately to adjust the black keys
}
window.onload = setup;