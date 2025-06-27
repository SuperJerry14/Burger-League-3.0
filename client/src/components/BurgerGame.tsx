import React, { useEffect, useCallback } from 'react';
import { useBurgerGame } from '../lib/stores/useBurgerGame';
import { useAudio } from '../lib/stores/useAudio';
import GameUI from './GameUI';
import HeroCard from './HeroCard';
import AchievementToast from './AchievementToast';
import PrestigeModal from './PrestigeModal';
import ParticleSystem from './ParticleSystem';

const BurgerGame: React.FC = () => {
  const {
    burgers,
    bps,
    totalBurgers,
    totalClicks,
    clickPower,
    heroes,
    owned,
    achievements,
    hiddenAchievements,
    prestigeLevel,
    prestigePoints,
    notification,
    showNotificationPopup,
    boss,
    buyHero,
    upgradeClickPower,
    manualClick,
    checkAchievements,
    canPrestige,
    prestige,
    attackBoss,
    isBossUnlocked,
    gameLoaded,
    loadGame,
    saveGame
  } = useBurgerGame();

  const { playHit, playSuccess, toggleMute, isMuted } = useAudio();

  // Load game on component mount
  useEffect(() => {
    loadGame();
  }, [loadGame]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!gameLoaded) return;
    
    const interval = setInterval(() => {
      saveGame();
    }, 30000);

    return () => clearInterval(interval);
  }, [gameLoaded, saveGame]);

  // Burger production interval
  useEffect(() => {
    if (!gameLoaded) return;
    
    const interval = setInterval(() => {
      useBurgerGame.getState().addBurgers(bps / 10);
    }, 100);

    return () => clearInterval(interval);
  }, [gameLoaded, bps]);

  const handleManualClick = useCallback((event: React.MouseEvent) => {
    manualClick();
    playHit();
    
    // Add click animation and particles
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Trigger particle effect at click position
    const particles = document.getElementById('particles');
    if (particles) {
      const particle = document.createElement('div');
      particle.className = 'click-particle';
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.textContent = `+${clickPower}`;
      particles.appendChild(particle);
      
      setTimeout(() => {
        particles.removeChild(particle);
      }, 1000);
    }
  }, [manualClick, playHit, clickPower]);

  const handleHeroPurchase = useCallback((heroId: number) => {
    const success = buyHero(heroId);
    if (success) {
      playSuccess();
      checkAchievements();
    }
  }, [buyHero, playSuccess, checkAchievements]);

  const handleUpgradeClick = useCallback(() => {
    const success = upgradeClickPower();
    if (success) {
      playSuccess();
    }
  }, [upgradeClickPower, playSuccess]);

  if (!gameLoaded) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-3"></div>
          <h4>Loading Burger Justice League...</h4>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ background: '#f5f5f5' }}>
      {/* Simple header */}
      <div className="text-center py-4">
        <h1 className="display-4 fw-bold text-dark mb-3">Burger Justice League</h1>
      </div>

      {/* Main game layout */}
      <div className="container-fluid px-4">
        <div className="row">
          {/* Left panel - Heroes */}
          <div className="col-md-4">
            <div className="bg-white rounded-3 p-3 shadow-sm h-100">
              <div className="hero-list">
                {heroes.map((hero, index) => {
                  const costMultiplier = Math.pow(1.15, owned[index]);
                  const currentCost = Math.floor(hero.cost * costMultiplier);
                  const canAfford = burgers >= currentCost;
                  
                  return (
                    <div key={index} className="d-flex align-items-center mb-3 p-2 border rounded hero-item">
                      <div className="hero-avatar me-3">
                        <img 
                          src={`/avatars/${hero.name.toLowerCase().replace(/\s+/g, '-')}.svg`}
                          alt={hero.name}
                          style={{ width: '50px', height: '50px' }}
                          className="rounded-circle"
                        />
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-1 fw-bold text-dark">{hero.name}</h6>
                        <div className="text-muted small">Cost: {currentCost.toLocaleString()} burgers</div>
                        <div className="text-muted small">{hero.bps} bps</div>
                        {owned[index] > 0 && (
                          <div className="text-success small">Owned: {owned[index]}</div>
                        )}
                      </div>
                      <button
                        className={`btn ${canAfford ? 'btn-primary' : 'btn-outline-secondary'} btn-sm`}
                        onClick={() => handleHeroPurchase(index)}
                        disabled={!canAfford}
                        style={{ minWidth: '60px' }}
                      >
                        Buy
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Center panel - Main burger */}
          <div className="col-md-4">
            <div className="text-center">
              {/* Burger counter */}
              <div className="mb-4">
                <h2 className="display-5 fw-bold text-dark mb-1">{Math.floor(burgers).toLocaleString()} burgers</h2>
                <p className="text-muted mb-0">{bps.toFixed(1)} burgers per second</p>
              </div>

              {/* Main burger button */}
              <div className="position-relative mb-4" id="particles">
                <button
                  className="btn p-0 border-0 bg-transparent burger-button"
                  onClick={handleManualClick}
                  style={{ 
                    width: '200px', 
                    height: '200px',
                    fontSize: '150px',
                    transition: 'all 0.1s ease',
                    transform: 'scale(1)'
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'scale(0.95)';
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  🍔
                </button>
              </div>

              {/* Click power upgrade */}
              <div className="mt-4">
                <button
                  className={`btn ${clickPower * 10 <= burgers ? 'btn-success' : 'btn-outline-secondary'} mb-2`}
                  onClick={handleUpgradeClick}
                  disabled={clickPower * 10 > burgers}
                >
                  Upgrade Click (+{clickPower}) - Cost: {(clickPower * 10).toLocaleString()}
                </button>
                
                {/* Prestige button */}
                <button
                  className={`btn ${canPrestige() ? 'btn-warning' : 'btn-outline-secondary'} w-100`}
                  onClick={prestige}
                  disabled={!canPrestige()}
                  title={!canPrestige() ? 'Need 1,000,000 total burgers to prestige' : `Reset for +${Math.floor(totalBurgers / 1000000)} prestige points`}
                >
                  <i className="fas fa-crown me-2"></i>
                  Prestige {canPrestige() && `(+${Math.floor(totalBurgers / 1000000)} points)`}
                </button>
                
                {/* Prestige info */}
                {prestigeLevel > 0 && (
                  <div className="mt-2 p-2 bg-light rounded text-center">
                    <small className="text-primary fw-bold">
                      Prestige Level {prestigeLevel} | {prestigePoints} Points
                      <br />
                      +{prestigePoints * 10}% Click Power | +{prestigePoints * 5}% BPS
                    </small>
                  </div>
                )}
              </div>

              {/* Boss Battle Section */}
              {isBossUnlocked() && (
                <div className="mt-4 p-3 bg-danger bg-opacity-10 border border-danger rounded">
                  <h6 className="text-danger fw-bold mb-2">
                    <i className="fas fa-skull me-2"></i>
                    Boss Battle: That Guy
                  </h6>
                  
                  {!boss.isActive && !boss.isDefeated && (
                    <button
                      className="btn btn-danger w-100 mb-2"
                      onClick={attackBoss}
                    >
                      Challenge That Guy!
                    </button>
                  )}
                  
                  {boss.isActive && (
                    <div>
                      <div className="d-flex align-items-center mb-2">
                        <img 
                          src="/avatars/that-guy.svg" 
                          alt="That Guy" 
                          style={{ width: '40px', height: '40px' }}
                          className="me-2"
                        />
                        <div className="flex-grow-1">
                          <div className="progress mb-1" style={{ height: '20px' }}>
                            <div 
                              className="progress-bar bg-danger" 
                              style={{ width: `${(boss.currentHealth / boss.maxHealth) * 100}%` }}
                            >
                              {Math.floor((boss.currentHealth / boss.maxHealth) * 100)}%
                            </div>
                          </div>
                          <small className="text-muted">
                            {boss.currentHealth.toLocaleString()} / {boss.maxHealth.toLocaleString()} HP
                          </small>
                        </div>
                      </div>
                      <button
                        className="btn btn-outline-danger w-100"
                        onClick={attackBoss}
                      >
                        Attack! (Damage: {(clickPower * (1 + prestigePoints * 0.1) * 100).toLocaleString()})
                      </button>
                    </div>
                  )}
                  
                  {boss.isDefeated && (
                    <div className="text-center">
                      <div className="text-success fw-bold mb-2">
                        <i className="fas fa-crown me-2"></i>
                        That Guy Defeated!
                      </div>
                      <small className="text-muted">You've completed the game!</small>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right panel - Achievements */}
          <div className="col-md-4">
            <div className="bg-white rounded-3 p-3 shadow-sm h-100">
              <h5 className="fw-bold text-dark mb-3">Achievements</h5>
              <div className="achievement-list">
                {achievements.concat(hiddenAchievements.filter(a => a.completed)).map((achievement, index) => (
                  <div key={index} className="d-flex align-items-center mb-3 p-2 border rounded achievement-item">
                    <div className="achievement-badge me-3">
                      <div className={`rounded-circle d-flex align-items-center justify-content-center ${achievement.completed ? 'bg-warning text-dark' : 'bg-secondary text-white'}`} 
                           style={{ width: '45px', height: '45px', fontSize: '12px', fontWeight: 'bold' }}>
                        {achievement.completed ? '✓' : '?'}
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1 fw-bold text-dark">{achievement.name}</h6>
                      <div className="text-muted small">{achievement.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Endgame message */}
      {hiddenAchievements.find(a => a.name === "Final Roast")?.completed && (
        <div className="position-fixed bottom-0 start-50 translate-middle-x mb-4 alert alert-danger text-center" 
             style={{ zIndex: 1000, fontSize: '20px', maxWidth: '600px' }}>
          <strong>🎭 Irony Man approaches That Guy and says: 'Nice gauntlet, bro. You compensatin' for something?'</strong>
        </div>
      )}

      {/* Notification popup */}
      {showNotificationPopup && (
        <div className="position-fixed top-0 end-0 m-3 alert alert-success alert-dismissible" 
             style={{ zIndex: 9999, minWidth: '300px' }}>
          <strong>🎉 {notification}</strong>
        </div>
      )}

      {/* Settings and controls */}
      <div className="position-fixed top-0 end-0 p-3" style={{ marginTop: showNotificationPopup ? '80px' : '0' }}>
        <button 
          className={`btn ${isMuted ? 'btn-outline-secondary' : 'btn-outline-primary'} me-2 btn-sm`}
          onClick={toggleMute}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          <i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'}`}></i>
        </button>
        <button 
          className="btn btn-outline-success btn-sm"
          onClick={saveGame}
          title="Save Game"
        >
          <i className="fas fa-save"></i>
        </button>
      </div>

      {/* Custom styles for clean look */}
      <style>{`
        .hero-item:hover, .achievement-item:hover {
          background-color: #f8f9fa !important;
          transition: all 0.2s ease;
        }
        
        .burger-button:hover {
          transform: scale(1.05) !important;
          transition: all 0.1s ease;
        }
        
        .burger-button:active {
          transform: scale(0.95) !important;
        }
        
        .click-particle {
          position: absolute;
          color: #ffc107;
          font-weight: bold;
          font-size: 1.2rem;
          pointer-events: none;
          z-index: 1000;
          animation: particleFloat 1s ease-out forwards;
        }
        
        @keyframes particleFloat {
          0% {
            opacity: 1;
            transform: translateY(0px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-50px) scale(1.2);
          }
        }
      `}</style>
    </div>
  );
};

export default BurgerGame;
