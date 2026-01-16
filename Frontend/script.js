let voices = [];
let mediaRecorder;
let audioChunks = [];

// Load available voices
function loadVoices() {
  voices = speechSynthesis.getVoices();
  const select = document.getElementById("voiceSelect");
  select.innerHTML = "";

  voices.forEach((v, i) => {
    const option = document.createElement("option");
    option.value = i;
    option.text = `${v.name} (${v.lang})`;
    select.appendChild(option);
  });
}

speechSynthesis.onvoiceschanged = loadVoices;

// Speak text (PLAY)
function speak() {
  const text = document.getElementById("text").value;
  const voiceIndex = document.getElementById("voiceSelect").value;

  if (!text) {
    alert("Please enter text");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = voices[voiceIndex];
  speechSynthesis.speak(utterance);

  // 🔥 SEND USAGE TO BACKEND
  fetch("https://tts-backend-k1ec.onrender.com/api/log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  }).catch(() => {
    console.log("Backend logging failed");
  });
}

// Download MP3
async function downloadAudio() {
  const text = document.getElementById("text").value;
  const voiceIndex = document.getElementById("voiceSelect").value;

  if (!text) {
    alert("Please enter text");
    return;
  }

  // Ask browser to capture audio
  const stream = await navigator.mediaDevices.getDisplayMedia({
    audio: true,
    video: false
  });

  mediaRecorder = new MediaRecorder(stream);
  audioChunks = [];

  mediaRecorder.ondataavailable = e => audioChunks.push(e.data);

  mediaRecorder.onstop = () => {
    const blob = new Blob(audioChunks, { type: "audio/mp3" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "tts-audio.mp3";
    a.click();
  };

  mediaRecorder.start();

  // Speak while recording
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = voices[voiceIndex];
  speechSynthesis.speak(utterance);

  // Stop recording after 4 seconds (adjust if needed)
  setTimeout(() => {
    mediaRecorder.stop();
  }, 4000);
}
