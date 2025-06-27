import React from 'react';
import { Achievement } from '../lib/constants';

interface AchievementToastProps {
  achievement: Achievement;
  isCompleted: boolean;
}

const AchievementToast: React.FC<AchievementToastProps> = ({ achievement, isCompleted }) => {
  return (
    <div className={`card mb-2 ${isCompleted ? 'border-success bg-success bg-opacity-10' : 'border-secondary'}`}>
      <div className="card-body p-2">
        <div className="d-flex align-items-center">
          <div className="me-2">
            {isCompleted ? (
              <i className="fas fa-check-circle text-success"></i>
            ) : (
              <i className="far fa-circle text-muted"></i>
            )}
          </div>
          <div className="flex-grow-1">
            <small className={`fw-bold ${isCompleted ? 'text-success' : 'text-light'}`}>
              {achievement.name}
            </small>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>
              {achievement.description}
            </div>
            {achievement.reward && (
              <div className="text-warning" style={{ fontSize: '0.75rem' }}>
                <i className="fas fa-gift me-1"></i>
                {achievement.reward}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementToast;
