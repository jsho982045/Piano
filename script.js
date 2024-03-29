let sustainPedalActive = false;
let masterGainNode;

function setup() {
    let audioContext = new AudioContext();
    let oscList = [];
    masterGainNode = audioContext.createGain();
    masterGainNode.connect(audioContext.destination);

    masterGainNode.gain.value = 0.5;

    let mainGainNode = audioContext.createGain();
    mainGainNode.connect(audioContext.destination);

    function playTone(freqValue) {
        let osc = audioContext.createOscillator();
        let gainNode = audioContext.createGain();
        gainNode.connect(masterGainNode);
        osc.connect(gainNode);
        osc.type = 'triangle';
        osc.frequency.value = freqValue;
        osc.start();
        return {osc, gainNode};
    }

    function notePressed(event, freq) {
        event.target.style.backgroundColor = 'lightgray';
    
        // Check if there's an existing oscillator and if it has already been stopped
        if (!oscList[event.target.id] || oscList[event.target.id].stopped) {
            oscList[event.target.id] = playTone(freq);
        }
    
        // Schedule the note to stop after a certain time regardless of the sustain pedal
        let stopTime = audioContext.currentTime + 1;
        oscList[event.target.id].osc.stop(stopTime);
        oscList[event.target.id].stopped = false; // Mark the oscillator as not stopped
    }
    

    function noteReleased(event) {
        let noteId = event.target.id;
        if (!sustainPedalActive && oscList[noteId]) {
            stopNote(noteId);
        }
        event.target.style.backgroundColor = '';
    }

    function stopNote(noteId) {
        if (oscList[noteId] && !oscList[noteId].stopped) {
            oscList[noteId].osc.stop(audioContext.currentTime);
            oscList[noteId].gainNode.gain.setValueAtTime(0.001, audioContext.currentTime);
            oscList[noteId].stopped = true; // Mark the oscillator as stopped
        }
        let pianoKeyElement = document.getElementById(noteId);
        if (pianoKeyElement) {
            pianoKeyElement.style.backgroundColor = ''; // Reset the background color
        }
    }
    
    

    let keyMap = {
        'C' : 130.81, 'C#': 138.59, 'D': 146.83, 'D#': 155.56, 'E': 164.81, 'F': 174.61, 'F#': 185.00, 'G': 196.00, 'G#': 207.65, 'A': 220.00, 'A#': 233.08, 'B': 246.94,
        'C2': 261.63, 'C#2': 277.18, 'D2': 293.66, 'D#2': 311.13, 'E2': 329.63, 'F2': 349.23, 'F#2': 369.99, 'G2': 392.00, 'G#2': 415.30, 'A2': 440.00, 'A#2': 466.16, 'B2': 493.88,
        'C3': 523.25, 'C#3': 554.37, 'D3': 587.33, 'D#3': 622.25, 'E3': 659.25, 'F3': 698.46, 'F#3': 739.99, 'G3': 783.99, 'G#3': 830.61, 'A3': 880.00, 'A#3': 932.33, 'B3': 987.77,
    };

    let keyBindings = {
        'KeyQ': 'C', 'Digit2': 'C#', 'KeyW': 'D', 'Digit3': 'D#', 'KeyE': 'E', 'KeyR': 'F', 'Digit5': 'F#', 'KeyT': 'G', 'Digit6': 'G#', 'KeyY': 'A', 'Digit7': 'A#', 'KeyU': 'B',
        'KeyI': 'C2', 'Digit9': 'C#2', 'KeyO': 'D2', 'Digit0': 'D#2', 'KeyP': 'E2', 'BracketLeft': 'F2', 'Equal': 'F#2', 'BracketRight': 'G2', 'Backslash': 'G#2', 'KeyA': 'A2', 'KeyS': 'A#2', 'KeyD': 'B2',
        'KeyF': 'C3', 'KeyG': 'C#3', 'KeyH': 'D3', 'KeyJ': 'D#3', 'KeyK': 'E3', 'KeyL': 'F3', 'Semicolon': 'F#3', 'Quote': 'G3', 'Enter': 'G#3', 'KeyZ': 'A3', 'KeyX': 'A#3', 'KeyC': 'B3'
    };

    let visualKeyLabels = {
        'KeyQ': 'Q', 'Digit2': '2', 'KeyW': 'W', 'Digit3': '3', 'KeyE': 'E', 'KeyR': 'R', 'Digit5': '5', 'KeyT': 'T', 'Digit6': '6', 'KeyY': 'Y', 'Digit7': '7', 'KeyU': 'U', 'KeyI' : 'I', 'Digit9': '9', 'KeyO': 'O', 'Digit0': '0', 'KeyP': 'P', 'BracketLeft': '[', 'Equal': '=', 'BracketRight': ']', 'Backslash': '\\', 'KeyA': 'A', 'KeyS': 'S', 'KeyD': 'D', 'KeyF': 'F', 'KeyG': 'G', 'KeyH': 'H', 'KeyJ': 'J', 'KeyK': 'K', 'KeyL': 'L', 'Semicolon': ';', 'Quote': '\'', 'Enter': 'Enter', 'KeyZ': 'Z', 'KeyX': 'X', 'KeyC': 'C',
    };

     // Function to add label to each key
     function addLabelsToKeys() {
        for (let key in visualKeyLabels) {
            let pianoKey = document.getElementById(keyBindings[key]);
            let label = document.createElement('div');
            label.classList.add('key-label');
            label.textContent = visualKeyLabels[key];
            pianoKey.appendChild(label);
        }
    }

    // Add keydown event to document to play notes
    document.addEventListener('keydown', function(event) {
        if(keyBindings[event.code]) {
            let pianoKey = document.getElementById(keyBindings[event.code]);
            if(!oscList[pianoKey.id]) {
                pianoKey.dispatchEvent(new MouseEvent('mousedown'));
            }
        }
    });

    // Add keyup event to document to release notes
    document.addEventListener('keyup', function(event) {
        if(keyBindings[event.code]) {
            let pianoKey = document.getElementById(keyBindings[event.code]);
            if(oscList[pianoKey.id]) {
                pianoKey.dispatchEvent(new MouseEvent('mouseup'));
            }
        }
    });

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

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Shift' && !sustainPedalActive) {
            sustainPedalActive = true;
            showSustainIndicator();
        }
    });
    document.addEventListener('keyup', function(event) {
        if (event.key === 'Shift') {
            sustainPedalActive = false;
            hideSustainIndicator();
            releaseSustainedNotes();
        }
    });

    document.getElementById('volume').addEventListener('input', function(event) {
        masterGainNode.gain.value = event.target.value;
    });

    
    function releaseSustainedNotes() {
        Object.keys(oscList).forEach(function(noteId) {
            if (oscList[noteId]) {
                stopNote(noteId);
            }
        });
    }

    function showSustainIndicator() {
        // Create or select a popup element and make it visible
        let sustainPopup = document.getElementById('sustain-popup');
        if (!sustainPopup) {
            sustainPopup = document.createElement('div');
            sustainPopup.id = 'sustain-popup';
            sustainPopup.textContent = 'Sustain On';
            sustainPopup.style.position = 'fixed';
            sustainPopup.style.bottom = '10px';
            sustainPopup.style.left = '50%';
            sustainPopup.style.transform = 'translateX(-50%)';
            sustainPopup.style.padding = '5px 10px';
            sustainPopup.style.backgroundColor = 'black';
            sustainPopup.style.color = 'white';
            sustainPopup.style.borderRadius = '5px';
            sustainPopup.style.zIndex = '1000';
            document.body.appendChild(sustainPopup);
        }
        sustainPopup.style.display = 'block';
    }

    // Hide sustain indicator
    function hideSustainIndicator() {
        let sustainPopup = document.getElementById('sustain-popup');
        if (sustainPopup) {
            sustainPopup.style.display = 'none';
        }
    }


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

    adjustBlackKeys(); 
    addLabelsToKeys();

}
window.onload = setup;