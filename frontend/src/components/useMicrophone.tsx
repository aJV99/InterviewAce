import { getBrowserName } from '@/app/utils';
import { useState, useRef, useEffect } from 'react';

const useMicrophone = (
  handleResult: (string: string) => void,
  testsPassed: boolean,
  micPhrase: string,
  setTestsPassedTrue: () => void,
) => {
  const [transcript, setTranscript] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const currentTranscript = useRef<string>(''); // Use ref to track the current transcript

  const normalizeTranscript = (transcript: string) => {
    // Example: Capitalize the first letter and add a period at the end.
    if (transcript.charAt(0) === ' ') {
      return ' ' + transcript.charAt(1).toUpperCase() + transcript.slice(2).toLowerCase() + '.';
    } else {
      return transcript.charAt(0).toUpperCase() + transcript.slice(1).toLowerCase() + '.';
    }
  };

  useEffect(() => {
    currentTranscript.current = transcript; // Update ref whenever transcript changes
  }, [transcript]);

  const startListening = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        'Your browser does not support the Speech Recognition API. Please use the latest versions of any of the following browsers: Google Chrome, Microsoft Edge, Safari.',
      );
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.lang = 'en-GB';
    recognitionRef.current.interimResults = false;
    recognitionRef.current.maxAlternatives = 1;

    recognitionRef.current.onresult = (event) => {
      const browserName = getBrowserName();
      const transcriptResult = Array.from(event.results)
        .map((result) => {
          // Check if the browser is Edge; if so, return the original transcript without normalization
          if (browserName === 'Edge') {
            return result[0].transcript;
          } else {
            // For other browsers, apply normalization
            return normalizeTranscript(result[0].transcript);
          }
        })
        .join(' ');
      setTranscript(transcriptResult);
      if (!testsPassed && transcriptResult === micPhrase) {
        setStatus('SUCCESS!');
        stopListening(); // Stop listening right here
        setTimeout(() => {
          setTestsPassedTrue();
        }, 2000);
      } else if (!testsPassed) {
        setStatus('ERROR!');
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      if (event.error === 'no-speech') {
        console.log('No speech detected. Resetting transcript.');
        setTranscript(''); // Reset transcript if no speech is detected
        stopListening();
      }
    };

    recognitionRef.current.start();
  };

  const stopListening = () => {
    // Delay stopping the recognition to allow final words to be processed
    if (recognitionRef.current) {
      setTimeout(() => {
        if (recognitionRef.current) {
          recognitionRef.current.onend = () => {
            handleResult(currentTranscript.current); // Handle results with the most current transcript
            setTranscript(''); // Clear the transcript state
            if (recognitionRef.current) {
              recognitionRef.current.onend = null; // Clean up the event handler
            }
          };

          recognitionRef.current.stop(); // Stop the recognition service
          recognitionRef.current = null; // Reset the reference after stopping
          setIsListening(false); // Update listening state immediately
        }
      }, 3000); // Delay of 3 seconds to ensure all speech is processed
    }
  };

  const quit = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null; // Reset the ref after stopping
    }
  };

  return {
    status,
    setStatus,
    transcript,
    setTranscript,
    isListening,
    setIsListening,
    startListening,
    stopListening,
    quit,
  };
};

export default useMicrophone;
