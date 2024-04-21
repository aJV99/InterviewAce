import { findPunctuationMarks } from '@/app/utils';
import { useRef, useState } from 'react';

const useSpeaker = (handleResult: () => void) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [spokenText, setSpokenText] = useState('');

  const speechSynthesisUtterance = useRef<SpeechSynthesisUtterance | null>(null);
  const voices = speechSynthesis.getVoices();
  const selectedVoice = voices.find((voice) => voice.lang.startsWith('en-GB'));

  const handleSpeak = (text: string) => {
    const punctuationMap = findPunctuationMarks(text);

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesisUtterance.current = utterance;
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    } else {
      console.log('Preferred language voice not found, using default.');
    }

    // Set properties for the speech synthesis
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      handleResult();
    };

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        let word = text.slice(event.charIndex, event.charIndex + event.charLength);
        if (punctuationMap.length != 0 && event.charIndex + event.charLength == punctuationMap[0].index) {
          word += punctuationMap[0].character;
          punctuationMap.shift();
        }
        setSpokenText((prev) => `${prev} ${word}`);
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  return { isSpeaking, spokenText, setSpokenText, handleSpeak };
};

export default useSpeaker;
