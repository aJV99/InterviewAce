import { findPunctuationMarks } from '@/app/utils';
import { useRef, useState, useEffect } from 'react';

interface VoiceTestResult {
  enGBWorks: boolean;
  checked: boolean;
}

const useSpeaker = (handleResult: () => void) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [voiceTest, setVoiceTest] = useState<VoiceTestResult>({ enGBWorks: false, checked: false });

  const speechSynthesisUtterance = useRef<SpeechSynthesisUtterance | null>(null);
  const voices = speechSynthesis.getVoices();

  // Function to select the best voice based on test results
  const selectVoice = () => {
    if (voiceTest.checked) {
      if (voiceTest.enGBWorks) {
        return voices.find((voice) => voice.lang.startsWith('en-GB'));
      } else {
        return voices.find((voice) => voice.lang.startsWith('en-US'));
      }
    }
    return null;
  };

  const testVoiceBoundary = (voiceLang: string) => {
    const testUtterance = new SpeechSynthesisUtterance('Test');
    const testVoice = voices.find((voice) => voice.lang.startsWith(voiceLang));

    if (testVoice) {
      testUtterance.voice = testVoice;
      let boundaryTriggered = false;

      testUtterance.onboundary = (event) => {
        if (event.name === 'word') {
          boundaryTriggered = true;
          testUtterance.onboundary = null; // Clean up the event listener
          window.speechSynthesis.cancel(); // Stop the test utterance
          setVoiceTest({ enGBWorks: voiceLang === 'en-GB', checked: true });
        }
      };

      window.speechSynthesis.speak(testUtterance);
      setTimeout(() => {
        if (!boundaryTriggered) {
          setVoiceTest({ enGBWorks: false, checked: true });
        }
      }, 1000); // Fallback timeout if no boundary event triggers
    }
  };

  useEffect(() => {
    if (!voiceTest.checked && voices.length > 0) {
      testVoiceBoundary('en-GB');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voices]);

  const handleSpeak = (text: string) => {
    const punctuationMap = findPunctuationMarks(text);

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const selectedVoice = selectVoice();
    if (!selectedVoice) {
      console.log('Voice selection pending or no suitable voice found.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesisUtterance.current = utterance;
    utterance.voice = selectedVoice;

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
        if (punctuationMap.length !== 0 && event.charIndex + event.charLength === punctuationMap[0].index) {
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
