import { CompassMode } from '../types';

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let oscillators: OscillatorNode[] = [];
let noiseNodes: AudioBufferSourceNode[] = [];

const initAudio = async () => {
  if (!audioCtx) {
    const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
    audioCtx = new AudioContextClass();
    masterGain = audioCtx.createGain();
    masterGain.connect(audioCtx.destination);
    masterGain.gain.value = 1.0; 
  }
  if (audioCtx.state === 'suspended') {
    await audioCtx.resume();
  }
};

const createNoiseBuffer = (type: 'pink' | 'brown' | 'white') => {
    if (!audioCtx) return null;
    const bufferSize = 4 * audioCtx.sampleRate; // 4 seconds
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = buffer.getChannelData(0);

    if (type === 'white') {
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
    } else if (type === 'pink') {
        let b0, b1, b2, b3, b4, b5, b6;
        b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
            output[i] *= 0.11;
            b6 = white * 0.115926;
        }
    } else if (type === 'brown') {
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            const out = (lastOut + (0.02 * white)) / 1.02;
            lastOut = out;
            output[i] = out * 3.5;
        }
    }
    return buffer;
};

export const playSoundscape = async (mode: CompassMode | 'Quick Win') => {
    await initAudio();
    stopSoundscape(); // Immediate sync cleanup

    if (!audioCtx || !masterGain) return;

    const now = audioCtx.currentTime;
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(1.0, now + 1.0);

    switch (mode) {
        case CompassMode.Surviving:
            createNoiseSource('brown', 0.9);
            createOscillator(60, 'sine', 0.2); 
            break;
        case CompassMode.Grounded:
            createNoiseSource('brown', 0.7);
            createOscillator(108, 'sine', 0.15); 
            createOscillator(432, 'sine', 0.1);
            break;
        case CompassMode.Drifting:
            createNoiseSource('pink', 0.8);
            createOscillator(200, 'triangle', 0.05); 
            createBinauralBeat(200, 14); 
            break;
        case 'Quick Win':
            createNoiseSource('pink', 0.6);
            createOscillator(528, 'sine', 0.15); 
            break;
        case CompassMode.Healing:
            createOscillator(174, 'sine', 0.4); 
            createBinauralBeat(174, 4); 
            break;
        case CompassMode.Growing:
            createNoiseSource('pink', 0.5);
            createOscillator(300, 'sine', 0.2); 
            createBinauralBeat(300, 10);
            break;
        case CompassMode.Flowing:
             createNoiseSource('pink', 0.3); 
             createOscillator(432, 'sine', 0.2); 
             break;
    }
};

const createNoiseSource = (type: 'pink' | 'brown' | 'white', vol = 0.5) => {
    if (!audioCtx || !masterGain) return;
    const buffer = createNoiseBuffer(type);
    if (!buffer) return;

    const noiseSrc = audioCtx.createBufferSource();
    noiseSrc.buffer = buffer;
    noiseSrc.loop = true;
    
    const noiseGain = audioCtx.createGain();
    noiseGain.gain.value = vol;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1200;

    noiseSrc.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(masterGain);
    
    noiseSrc.start();
    noiseNodes.push(noiseSrc);
};

const createOscillator = (freq: number, type: OscillatorType, vol: number, pan?: 'left' | 'right') => {
    if (!audioCtx || !masterGain) return;
    const osc = audioCtx.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;

    const oscGain = audioCtx.createGain();
    oscGain.gain.setValueAtTime(0, audioCtx.currentTime);
    oscGain.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + 1.5);

    if (pan && audioCtx.createStereoPanner) {
        const panner = audioCtx.createStereoPanner();
        panner.pan.value = pan === 'left' ? -0.7 : 0.7;
        osc.connect(oscGain);
        oscGain.connect(panner);
        panner.connect(masterGain);
    } else {
        osc.connect(oscGain);
        oscGain.connect(masterGain);
    }

    osc.start();
    oscillators.push(osc);
};

const createBinauralBeat = (baseFreq: number, beatFreq: number) => {
    createOscillator(baseFreq, 'sine', 0.15, 'left');
    createOscillator(baseFreq + beatFreq, 'sine', 0.15, 'right');
}

export const stopSoundscape = () => {
    // Synchronously stop all tracked nodes
    oscillators.forEach(o => { try { o.stop(); o.disconnect(); } catch(e) {} });
    noiseNodes.forEach(n => { try { n.stop(); n.disconnect(); } catch(e) {} });
    oscillators = [];
    noiseNodes = [];
    
    if (masterGain && audioCtx) {
        const now = audioCtx.currentTime;
        masterGain.gain.cancelScheduledValues(now);
        masterGain.gain.setValueAtTime(masterGain.gain.value, now);
        masterGain.gain.linearRampToValueAtTime(0, now + 0.2);
    }
};