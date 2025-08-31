import React from "react";

interface ManualModalProps {
  close: () => void;
}

const ManualModal: React.FC<ManualModalProps> = ({ close }) => (
  <div
    className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50"
    role="dialog"
    aria-modal="true"
    aria-labelledby="manual-title"
  >
    <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg text-gray-800">
      <h2 className="font-bold text-2xl mb-4" id="manual-title">
        How To Play: N-Queens
      </h2>
      <ul className="list-disc ml-5 mb-6 text-lg space-y-2">
        <li>Click a square to place or remove a queen.</li>
        <li>
          Place queens so that no two queens can attack each other:
          vertically, horizontally, or diagonally.
        </li>
        <li>Invalid moves (conflicting queens) cause game over.</li>
        <li>Place all queens correctly to win the level.</li>
        <li>Use Reset to try again anytime.</li>
        <li>Levels increase board size and difficulty.</li>
        <li>Earn points for placing queens and bonus on win.</li>
      </ul>
      <button
        onClick={close}
        className="btn btn-blue w-full py-3 rounded text-white font-semibold hover:bg-blue-700 transition"
        aria-label="Close manual"
      >
        Close
      </button>
    </div>
  </div>
);

export default ManualModal;
