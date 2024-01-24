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
        'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13, 'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00, 'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88,
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
    let blackKeys = document.querySelectorAll('.key.black');
    let blackKeyOffsets = [40, 80, 170, 215, 265]; // Adjust these values as needed
    blackKeys.forEach(function(key, index) {
        key.style.marginLeft = blackKeyOffsets[index] + 'px';
    });
}

window.onload = setup;
