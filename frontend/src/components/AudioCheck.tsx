import React, { useState, useEffect } from 'react';
import { Button } from '@chakra-ui/react';

// Define the component with TypeScript
const AudioCheck: React.FC = () => {
  // Explicitly set the type of mediaRecorder's state to null or MediaRecorder
  const [isMicAccessible, setIsMicAccessible] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');

  useEffect(() => {
    // Function to check and request microphone access
    const checkMicrophoneAccess = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setIsMicAccessible(true);

        // Initialize the MediaRecorder and set it in the state
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);

        let chunks: BlobPart[] = [];
        recorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };

        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
          chunks = [];
          const audioURL = window.URL.createObjectURL(blob);
          setAudioUrl(audioURL);
        };
      } catch (error) {
        console.error('Microphone access was denied', error);
        setIsMicAccessible(false);
      }
    };

    checkMicrophoneAccess();
  }, []);

  const startRecording = () => {
    mediaRecorder?.start();
    // Reset previous recording URL
    setAudioUrl('');
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    // The onstop event handler will update the audioUrl state
  };

  const playRecording = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch((error) => console.error('Playback failed', error));
    }
  };

  return (
    <div>
      {isMicAccessible ? (
        <div>
          <Button onClick={startRecording} colorScheme="teal" m={2}>
            Start Recording
          </Button>
          <Button onClick={stopRecording} colorScheme="red" m={2}>
            Stop Recording
          </Button>
          <Button onClick={playRecording} colorScheme="blue" m={2}>
            Play Recording
          </Button>
        </div>
      ) : (
        <div>Please allow microphone access and refresh the page.</div>
      )}
    </div>
  );
};

export default AudioCheck;
