const textarea = document.querySelector("textarea"),
  textToSpeechBtn = document.querySelector(".container button"),
  voiceList = document.querySelector(".container select");

let speechSynth = speechSynthesis;
let isSpeaking = true;

function voices() {
  for (let voice of speechSynth.getVoices()) {
    if (voiceList.value) {
      var selected = speechSynthesis.getVoices().filter((voice) => {
        return voice.voiceURI == voiceList.value;
      })[0];
    }
    let option = ` <option value="${voice.name}" ${selected}>${voice.name} (${voice.lang})</option>`;
    voiceList.insertAdjacentHTML("beforeend", option); // insert option tag before end of select element
  }
}

speechSynth.addEventListener("voiceschanged", voices);

function textToSpeech(text) {
  let utterance = new SpeechSynthesisUtterance(text);
  // set sppech voice to user selected voice if available
  for (let voice of speechSynth.getVoices()) {
    if (voice.name === voiceList.value) {
      utterance.voice = voice;
    }
  }
  speechSynth.speak(utterance); // speak the text
}

textToSpeechBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (textarea.value !== "") {
    if (!speechSynth.speaking) {
      // speak only when an utterance is not being spoken
      textToSpeech(textarea.value);
    }
    if (textarea.value.length > 80) {
      if (isSpeaking) {
        speechSynth.resume();
        isSpeaking = false;
        textToSpeechBtn.innerText = "Pause Speech";
      } else {
        speechSynth.pause();
        isSpeaking = true;
        textToSpeechBtn.innerText = "Resume Speech";
      }

      // Check if an utterance is being spoken every 100ms.
      // If not, change the button text
      setInterval(() => {
        if (!speechSynth.speaking && !isSpeaking) {
          isSpeaking = true;
          textToSpeechBtn.innerText = "Speak Text";
        }
      });
    } else {
      textToSpeechBtn.innerText = "Speak Text";
    }
  }
});
