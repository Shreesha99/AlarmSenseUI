import React from "react";
import { CheckCircle2 } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const FeedbackThankYouModal: React.FC<Props> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4">
      <div
        className="
          relative w-full max-w-md
          bg-white
          rounded-md
          shadow-lg
          border border-gray-200
          overflow-hidden
          animate-[fadeIn_0.25s_ease-out]
        "
      >
        <div className="h-1 w-full bg-[#00646C]" />

        <div className="px-6 py-10 text-center space-y-6">
          {/* Animated Lucide Icon */}
          <div className="flex justify-center">
            <CheckCircle2 className="w-14 h-14 text-green-500 animated-check-icon" />
          </div>

          <h3 className="text-lg font-semibold text-gray-900">Thank You</h3>

          <p className="text-sm text-gray-600">
            Your feedback has been recorded and will improve future root cause
            predictions.
          </p>

          <button
            onClick={onClose}
            className="mt-2 bg-[#00646C] text-white px-6 py-2 text-sm font-medium hover:opacity-90 transition"
          >
            Close
          </button>
        </div>
      </div>

      <style>
        {`
          .animated-check-icon {
            animation: iconPop 0.6s cubic-bezier(.22,1,.36,1) forwards;
          }

          .animated-check-icon circle {
            stroke-dasharray: 160;
            stroke-dashoffset: 160;
            animation: drawCircle 0.9s cubic-bezier(.4,0,.2,1) forwards;
          }

          .animated-check-icon path {
            stroke-dasharray: 60;
            stroke-dashoffset: 60;
            animation: drawCheck 0.6s cubic-bezier(.4,0,.2,1) forwards;
            animation-delay: 0.55s;
          }

          @keyframes drawCircle {
            0% {
              stroke-dashoffset: 160;
            }
            100% {
              stroke-dashoffset: 0;
            }
          }

          @keyframes drawCheck {
            0% {
              stroke-dashoffset: 60;
            }
            100% {
              stroke-dashoffset: 0;
            }
          }

          @keyframes iconPop {
            0% {
              transform: scale(0.95);
              opacity: 0;
            }
            60% {
              transform: scale(1.05);
              opacity: 1;
            }
            100% {
              transform: scale(1);
            }
          }
        `}
      </style>
    </div>
  );
};

export default FeedbackThankYouModal;
