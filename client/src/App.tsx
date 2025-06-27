import React, { useEffect } from 'react';
import BurgerGame from './components/BurgerGame';
import { useAudio } from './lib/stores/useAudio';

function App() {
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();

  useEffect(() => {
    // Initialize audio files
    const bgMusic = new Audio('/sounds/background.mp3');
    const hitSfx = new Audio('/sounds/hit.mp3');
    const successSfx = new Audio('/sounds/success.mp3');

    // Configure background music
    bgMusic.loop = true;
    bgMusic.volume = 0.3;

    // Configure sound effects
    hitSfx.volume = 0.5;
    successSfx.volume = 0.6;

    // Store in audio state
    setBackgroundMusic(bgMusic);
    setHitSound(hitSfx);
    setSuccessSound(successSfx);

    return () => {
      // Cleanup audio on unmount
      bgMusic.pause();
      bgMusic.src = '';
      hitSfx.src = '';
      successSfx.src = '';
    };
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  return (
    <div className="App">
      <BurgerGame />
    </div>
  );
}

export default App;
