import { useCallback, useEffect, useRef, useState } from 'react';

interface AudioContextState {
  context: AudioContext | null;
  isPlaying: boolean;
  isMuted: boolean;
}

export const useAudio = () => {
  const [audioState, setAudioState] = useState<AudioContextState>({
    context: null,
    isPlaying: false,
    isMuted: false,
  });
  
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const currentNoteRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Super Mario Bros main theme melody (simplified)
  const melody = [
    659, 659, 0, 659, 0, 523, 659, 0, 784, 0, 0, 0, 392, 0, 0, 0,
    523, 0, 0, 392, 0, 0, 330, 0, 0, 440, 0, 494, 0, 466, 0, 440,
    0, 392, 659, 784, 880, 0, 698, 784, 0, 659, 0, 523, 587, 494,
    0, 523, 0, 0, 392, 0, 0, 330, 0, 0, 440, 0, 494, 0, 466, 0, 440
  ];

  const initAudio = () => {
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const gainNode = context.createGain();
      gainNode.connect(context.destination);
      gainNode.gain.value = 0.1; // Low volume
      
      setAudioState(prev => ({ ...prev, context }));
      gainNodeRef.current = gainNode;
      
      return context;
    } catch (error) {
      console.warn('Audio context not supported:', error);
      return null;
    }
  };

  const playNote = (frequency: number, duration: number = 200) => {
    // Get or initialize audio context
    const context = audioState.context || initAudio();
    if (!context || audioState.isMuted) return;
    
    try {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      oscillator.type = 'square'; // 8-bit sound
      oscillator.frequency.setValueAtTime(frequency, context.currentTime);
      
      gainNode.gain.setValueAtTime(0.05, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration / 1000);
      
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + duration / 1000);
    } catch (error) {
      console.warn('Error playing note:', error);
    }
  };

  const startBackgroundMusic = () => {
    if (audioState.isPlaying || audioState.isMuted) return;
    
    const context = audioState.context || initAudio();
    if (!context) return;

    setAudioState(prev => ({ ...prev, isPlaying: true }));
    currentNoteRef.current = 0;
    
    const playMelody = () => {
      if (audioState.isMuted) return;
      
      const frequency = melody[currentNoteRef.current];
      if (frequency > 0) {
        playNote(frequency, 300);
      }
      
      currentNoteRef.current = (currentNoteRef.current + 1) % melody.length;
    };
    
    intervalRef.current = setInterval(playMelody, 300);
  };

  const stopBackgroundMusic = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setAudioState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const toggleMute = () => {
    setAudioState(prev => {
      const newMuted = !prev.isMuted;
      if (newMuted) {
        stopBackgroundMusic();
      }
      return { ...prev, isMuted: newMuted };
    });
  };

  const playJumpSound = () => {
    if (audioState.isMuted) return;
    
    // Initialize audio context if not already done
    const context = audioState.context || initAudio();
    if (!context) return;
    
    playNote(523, 100); // C note
  };

  const playCoinSound = () => {
    if (audioState.isMuted) return;
    playNote(784, 150); // G note
  };

  const playPowerUpSound = () => {
    if (audioState.isMuted) return;
    // Power-up sound sequence
    setTimeout(() => playNote(523, 100), 0);
    setTimeout(() => playNote(659, 100), 100);
    setTimeout(() => playNote(784, 100), 200);
    setTimeout(() => playNote(1047, 200), 300);
  };

  const playEnemyDefeatSound = () => {
    if (audioState.isMuted) return;
    playNote(196, 200); // Low G note
  };

  const playPipeSound = () => {
    if (audioState.isMuted) return;
    // Pipe entry sound sequence (descending notes)
    setTimeout(() => playNote(523, 150), 0);   // C
    setTimeout(() => playNote(440, 150), 150); // A
    setTimeout(() => playNote(349, 150), 300); // F
    setTimeout(() => playNote(262, 200), 450); // Low C
  };

  useEffect(() => {
    return () => {
      stopBackgroundMusic();
      if (audioState.context) {
        audioState.context.close();
      }
    };
  }, [audioState.context, stopBackgroundMusic]);

  return {
    startBackgroundMusic,
    stopBackgroundMusic,
    toggleMute,
    playJumpSound,
    playCoinSound,
    playPowerUpSound,
    playEnemyDefeatSound,
    playPipeSound,
    isPlaying: audioState.isPlaying,
    isMuted: audioState.isMuted,
  };
};