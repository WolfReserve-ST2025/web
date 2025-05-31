import { useState, useEffect, useRef, useCallback } from 'react';
import type { 
  ISpeechRecognition, 
  ISpeechRecognitionEvent, 
  ISpeechRecognitionErrorEvent,
  ISpeechRecognitionConstructor 
} from './ISpeechRecognition';

interface VoiceCommand {
  command: string;
  action: () => void;
}

export const useVoiceRecognition = (commands: VoiceCommand[]) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    //check if browser supports speech recognition
    const supported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    setIsSupported(supported);
    
    if (!supported) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognitionConstructor: ISpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition!;
    
    if (!SpeechRecognitionConstructor) {
      console.warn('Speech recognition constructor not available');
      return;
    }

    try {
      recognitionRef.current = new SpeechRecognitionConstructor();
      
      const recognition = recognitionRef.current;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: ISpeechRecognitionEvent) => {
        //get the final text from what was spoken
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript.trim()) {
          setTranscript(finalTranscript);
          
          //check if spokne matches any command 
          commands.forEach(({ command, action }) => {
            if (finalTranscript.toLowerCase().includes(command.toLowerCase())) {
              action(); // execute the command if it matches
              stopListening();
            }
          });
        }
      };

      recognition.onerror = (event: ISpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };

    } catch (error) {
      console.error('Error initializing speech recognition:', error);
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.warn('Error stopping speech recognition:', error);
        }
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [commands]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || !isSupported || isListening) {
      return;
    }

    try {
      recognitionRef.current.start();
      setIsListening(true);
      setTranscript('');
      
      // Auto-stop after 10 seconds
      timeoutRef.current = setTimeout(() => {
        stopListening();
      }, 10000);
      
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsListening(false);
    }
  }, [isListening, isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.warn('Error stopping speech recognition:', error);
      }
      setIsListening(false);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [isListening]);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSupported
  };
};