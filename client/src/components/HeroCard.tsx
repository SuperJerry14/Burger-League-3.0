import React from 'react';
import { Hero } from '../lib/constants';

interface HeroCardProps {
  hero: Hero;
  owned: number;
  canAfford: boolean;
  onPurchase: () => void;
}

const HeroCard: React.FC<HeroCardProps> = ({ hero, owned, canAfford, onPurchase }) => {
  const costMultiplier = Math.pow(1.15, owned);
  const currentCost = Math.floor(hero.cost * costMultiplier);

  return (
    <div className={`card h-100 ${canAfford ? 'border-success' : 'border-secondary'}`}>
      <div className="card-body p-3">
        <div className="row align-items-center">
          <div className="col-2 text-center">
            <div className="fs-2">{hero.emoji}</div>
          </div>
          <div className="col-6">
            <h6 className="card-title mb-1 text-warning">{hero.name}</h6>
            <small className="text-muted">{hero.description}</small>
            <div className="mt-1">
              <small className="text-info">
                <i className="fas fa-bolt me-1"></i>
                {hero.bps} BPS each
              </small>
            </div>
            {owned > 0 && (
              <div className="badge bg-primary mt-1">
                Owned: {owned}
              </div>
            )}
          </div>
          <div className="col-4 text-end">
            <button
              className={`btn btn-sm w-100 ${canAfford ? 'btn-success' : 'btn-outline-secondary'}`}
              onClick={onPurchase}
              disabled={!canAfford}
            >
              <div className="d-flex flex-column">
                <small>
                  <i className="fas fa-coins me-1"></i>
                  {currentCost.toLocaleString()}
                </small>
                <small>Recruit</small>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroCard;
