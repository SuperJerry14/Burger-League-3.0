import React from 'react';

interface PrestigeModalProps {
  canPrestige: boolean;
  prestigePoints: number;
  onPrestige: () => void;
}

const PrestigeModal: React.FC<PrestigeModalProps> = ({ canPrestige, prestigePoints, onPrestige }) => {
  const handlePrestige = () => {
    onPrestige();
    // Close modal using Bootstrap's modal API
    const modal = document.getElementById('prestigeModal');
    if (modal) {
      const bsModal = (window as any).bootstrap.Modal.getInstance(modal);
      if (bsModal) {
        bsModal.hide();
      }
    }
  };

  return (
    <div className="modal fade" id="prestigeModal" tabIndex={-1} aria-labelledby="prestigeModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content bg-dark border-warning">
          <div className="modal-header border-warning">
            <h5 className="modal-title text-warning" id="prestigeModalLabel">
              <i className="fas fa-crown me-2"></i>
              Prestige System
            </h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div className="text-center mb-4">
              <div className="display-1 text-warning">👑</div>
              <h4 className="text-warning">Ascend to Greatness!</h4>
            </div>
            
            <div className="alert alert-warning">
              <h6><i className="fas fa-exclamation-triangle me-2"></i>Warning!</h6>
              <p className="mb-0">
                Prestiging will reset your burgers, heroes, and upgrades, but you'll gain <strong>{prestigePoints} Prestige Points</strong> that provide permanent bonuses!
              </p>
            </div>

            <div className="row text-center">
              <div className="col-6">
                <div className="card bg-secondary">
                  <div className="card-body">
                    <h6 className="text-warning">You'll Lose</h6>
                    <ul className="list-unstyled text-start small">
                      <li>• All Burgers</li>
                      <li>• All Heroes</li>
                      <li>• Click Upgrades</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="card bg-warning text-dark">
                  <div className="card-body">
                    <h6>You'll Gain</h6>
                    <ul className="list-unstyled text-start small">
                      <li>• +{prestigePoints} Prestige Points</li>
                      <li>• +{prestigePoints * 10}% Click Power</li>
                      <li>• +{prestigePoints * 5}% BPS Bonus</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {!canPrestige && (
              <div className="alert alert-info mt-3">
                <i className="fas fa-info-circle me-2"></i>
                You need at least 1,000,000 total burgers to prestige.
              </div>
            )}
          </div>
          <div className="modal-footer border-warning">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              Cancel
            </button>
            <button 
              type="button" 
              className={`btn ${canPrestige ? 'btn-warning' : 'btn-outline-secondary'}`}
              onClick={handlePrestige}
              disabled={!canPrestige}
            >
              <i className="fas fa-crown me-2"></i>
              Prestige Now
            </button>
          </div>
        </div>
      </div>
      
      {/* Load Bootstrap JS for modal functionality */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
    </div>
  );
};

export default PrestigeModal;
