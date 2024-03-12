import React, { useState } from 'react';

const useMicrophone = (
  handleResult: () => void,
  testsPassed: boolean,
  micPhrase: string,
  setTestsPassedTrue: () => void,
) => {
  const [transcript, setTranscript] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);

  const recognitionRef = React.useRef<SpeechRecognition | null>(null);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        'Your browser does not support the Web Speech API. Please use the latest versions of any of the following browsers: Google Chrome, Microsoft Edge, Mozilla Firefox',
      );
      return;
    }

    // Initialize recognition object and assign it to the ref
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true; // Keep listening even if the user pauses
    recognitionRef.current.lang = 'en-GB';
    recognitionRef.current.interimResults = false;
    recognitionRef.current.maxAlternatives = 1;

    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      const transcriptResult = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(' ');
      setTranscript(transcriptResult);
      console.log(transcriptResult);
      if (!testsPassed) {
        if (transcriptResult == micPhrase) {
          console.log('TEST WOOHOO');
          setStatus('SUCCESS!'); // Set status before starting the timeout

          // Wait for 2 seconds before executing the next steps
          setTimeout(() => {
            setTestsPassedTrue();
            if (recognitionRef.current) {
              recognitionRef.current.stop();
              recognitionRef.current = null; // Reset the ref after stopping
              setIsListening(false);
              setTranscript('');
            }
          }, 2000); // 2000 milliseconds = 2 seconds
        } else {
          setStatus('FAIL!'); // Set status before starting the timeout
          if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null; // Reset the ref after stopping
            setIsListening(false);
          }
        }
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
    };

    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null; // Reset the ref after stopping
      setIsListening(false);
      setTranscript('');
      handleResult();
      // nextQuestion(questionIndex);
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
  };
};

export default useMicrophone;
