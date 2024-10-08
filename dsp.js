const audioElement = document.getElementById('audio');
const playButton = document.getElementById('playButton');
const pauseButton = document.getElementById('pauseButton');
const gainSlider = document.getElementById('gainSlider');
const thresholdSlider = document.getElementById('thresholdSlider');
const ratioSlider = document.getElementById('ratioSlider');
const attackSlider = document.getElementById('attackSlider');
const releaseSlider = document.getElementById('releaseSlider');
const filterType = document.getElementById('filterType');
const filterFrequency = document.getElementById('filterFrequency');
const delayTime = document.getElementById('delayTime');
const pannerX = document.getElementById('pannerX');
const pannerY = document.getElementById('pannerY');
const plantEmoji = document.getElementById('plantEmoji');

// Create an Audio Context
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Create nodes
const inflatorGainNode = audioContext.createGain();
const compressor = audioContext.createDynamicsCompressor();
const biquadFilter = audioContext.createBiquadFilter();
const delayNode = audioContext.createDelay();
const panner = audioContext.createPanner();

// Create a Media Element Source from the audio element
const source = audioContext.createMediaElementSource(audioElement);

// Connect the nodes: source -> gain -> filter -> delay -> compressor -> panner -> destination
source.connect(inflatorGainNode);
inflatorGainNode.connect(biquadFilter);
biquadFilter.connect(delayNode);
delayNode.connect(compressor);
compressor.connect(panner);
panner.connect(audioContext.destination);

// Play button functionality
playButton.addEventListener('click', () => {
    if (audioContext.state === 'suspended') {
        audioContext.resume(); // Resume the audio context if it's suspended
    }
    audioElement.play();
    plantEmoji.style.display = 'block'; // Show the plant emoji when playing
});

// Pause button functionality
pauseButton.addEventListener('click', () => {
    audioElement.pause();
    plantEmoji.style.display = 'none'; // Hide the plant emoji when paused
});

// Update gain based on slider input
gainSlider.addEventListener('input', (e) => {
    inflatorGainNode.gain.value = e.target.value; // Set the gain value for the inflator
    document.getElementById('gainValue').textContent = e.target.value; // Update displayed value
});

// Update compressor settings based on slider input
thresholdSlider.addEventListener('input', (e) => {
    compressor.threshold.value = e.target.value; // Set the threshold
    document.getElementById('thresholdValue').textContent = e.target.value; // Update displayed value
});

ratioSlider.addEventListener('input', (e) => {
    compressor.ratio.value = e.target.value; // Set the ratio
    document.getElementById('ratioValue').textContent = e.target.value; // Update displayed value
});

attackSlider.addEventListener('input', (e) => {
    compressor.attack.value = e.target.value; // Set the attack time
    document.getElementById('attackValue').textContent = e.target.value; // Update displayed value
});

releaseSlider.addEventListener('input', (e) => {
    compressor.release.value = e.target.value; // Set the release time
    document.getElementById('releaseValue').textContent = e.target.value; // Update displayed value
});

// Update Biquad Filter settings
filterType.addEventListener('change', (e) => {
    biquadFilter.type = e.target.value; // Set the filter type
});

filterFrequency.addEventListener('input', (e) => {
    biquadFilter.frequency.value = e.target.value; // Set the filter frequency
    document.getElementById('filterFrequencyValue').textContent = e.target.value; // Update displayed value
});

// Update Delay settings
delayTime.addEventListener('input', (e) => {
    delayNode.delayTime.value = e.target.value; // Set the delay time
    document.getElementById('delayTimeValue').textContent = e.target.value; // Update displayed value
});

// Update Panner settings
panner.setPosition(pannerX.value, pannerY.value, 0); // Set initial position

pannerX.addEventListener('input', (e) => {
    panner.setPosition(e.target.value, pannerY.value, 0); // Update panner X position
    document.getElementById('pannerXValue').textContent = e.target.value; // Update displayed value
});

pannerY.addEventListener('input', (e) => {
    panner.setPosition(pannerX.value, e.target.value, 0); // Update panner Y position
    document.getElementById('pannerYValue').textContent = e.target.value; // Update displayed value
});

// Limiter: Ensure output does not exceed -0.5 dB
const limiter = audioContext.createGain();
limiter.gain.value = 0.707; // -3 dB gain (approximately)
compressor.connect(limiter);
limiter.connect(audioContext.destination);
