export const speak = (text: string, preferredLang: string = "en-GB") => {
  function setVoiceAndSpeak(voices: any[]) {
    // Attempt to find a voice with the preferred language code
    const selectedVoice = voices.find((voice) => voice.lang.startsWith(preferredLang));

    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    } else {
      console.log("Preferred language voice not found, using default.");
    }
    speechSynthesis.speak(utterance);
  }

  let voices = speechSynthesis.getVoices();
  if (voices.length > 0) {
    setVoiceAndSpeak(voices);
  } else {
    speechSynthesis.onvoiceschanged = () => {
      voices = speechSynthesis.getVoices();
      setVoiceAndSpeak(voices);
    };
  }
};
