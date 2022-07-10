const textarea = document.querySelector("textarea"),
  textToSpeechBtn = document.querySelector(".container button"),
  voiceList = document.querySelector(".container select");

let speechSynth = speechSynthesis;
let isSpeaking = true;

var supportMsg = document.getElementById("msg");

if ("speechSynthesis" in window) {
  supportMsg.innerHTML =
    "Your browser <strong>supports</strong> speech synthesis.";
} else {
  supportMsg.innerHTML =
    'Sorry your browser <strong>does not support</strong> speech synthesis.<br>Try this in <a href="http://www.google.co.uk/intl/en/chrome/browser/canary.html">Chrome Canary</a>.';
  supportMsg.classList.add("not-supported");
}

function voices(langSubstr) {
  speechSynthesis.getVoices().filter((voice) => {
    voice?.lang.replace("_", "-").substring(0, langSubstr?.length) ===
    langSubstr
    if (voiceList.value) {
      var selected = voice?.voiceURI == voiceList.value;
    }
    let option = ` <option value="${voice?.name}" ${selected}>${voice?.name} (${voice?.lang})</option>`;
    voiceList.insertAdjacentHTML("beforeend", option); // insert option tag before end of select element
  });
}

window.speechSynthesis.onvoiceschanged = (e) => {
  voices("en");
};

function textToSpeech(text) {
  let utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = utterance.voice?.lang;
  // set speech voice to user selected voice if available
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
