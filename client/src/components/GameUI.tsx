import React from 'react';

const GameUI: React.FC = () => {
  return (
    <div className="game-ui position-fixed" style={{ top: '10px', right: '10px', zIndex: 1050 }}>
      {/* Any overlay UI elements can go here */}
      <div className="d-flex flex-column gap-2">
        {/* Future UI elements like notifications, etc. */}
      </div>
    </div>
  );
};

export default GameUI;
