import React, { useEffect } from 'react';
import { useVoiceRecognition } from '../../hooks/useVoiceRecognition/useVoiceRecognition';

interface VoiceControlProps {
  onConfirm: () => void;
  onReject: () => void;
  isEnabled?: boolean;
}

const VoiceControl = ({ onConfirm, onReject, isEnabled = true }: VoiceControlProps) => {
  const commands = [
    { command: 'complete order', action: onConfirm },
    { command: 'reject order', action: onReject }
  ];

  const { isListening, transcript, startListening, stopListening, isSupported } = useVoiceRecognition(commands);

  useEffect(() => {
    if (!isEnabled && isListening) {
      stopListening();
    }
  }, [isEnabled, isListening, stopListening]);

  if (!isEnabled) {
    return null;
  }

  if (!isSupported) {
    return (
      <div className="voice-control bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
        <div className="text-sm text-gray-500">
          🚫 Voice control not supported in this browser
        </div>
      </div>
    );
  }

  return (
    <div className="voice-control bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-blue-800">
          🎤 Voice Control
        </h3>
        <button
          onClick={isListening ? stopListening : startListening}
          className={`px-3 py-1 rounded text-xs font-medium transition ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isListening ? '🔴 Stop' : '🎤 Start (10s)'}
        </button>
      </div>
      
      {isListening && (
        <div className="text-xs text-blue-600 animate-pulse">
          🎧 Listening... Say "confirm order" or "reject order"
        </div>
      )}
      
      {transcript && (
        <div className="text-xs text-gray-600 mt-1 bg-gray-100 p-2 rounded">
          Last heard: "{transcript}"
        </div>
      )}
      
    </div>
  );
};

export default VoiceControl;