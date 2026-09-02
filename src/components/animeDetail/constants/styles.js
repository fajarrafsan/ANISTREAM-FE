export const customStyles = `
  .dotted-bg {
    background-image: radial-gradient(#ff1e56 0.7px, transparent 0.7px);
    background-size: 24px 24px;
    opacity: 0.04;
  }
  .glass-panel-dark {
    background: rgba(10, 10, 15, 0.72);
    border: 1px solid rgba(255, 30, 86, 0.08);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }
  .glass-panel-light {
    background: rgba(255, 255, 255, 0.85);
    border: 1px solid rgba(226, 232, 240, 0.9);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }
  .custom-scrollbar::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #0d0508;
    border-radius: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #ff1e56;
    border-radius: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #cc0033;
  }
  @keyframes pulse-glow {
    0%, 100% { transform: scale(1); opacity: 0.4; }
    50% { transform: scale(1.05); opacity: 0.8; }
  }
  .glow-pulse {
    animation: pulse-glow 3s infinite ease-in-out;
  }
`;