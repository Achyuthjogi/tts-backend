let voices = [];

function loadVoices() {
    voices = speechSynthesis.getVoices();
    const select = document.getElementById("voiceSelect");
    select.innerHTML = "";

    voices.forEach((voice, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.text = `${voice.name} (${voice.lang})`;
        select.appendChild(option);
    });
}

speechSynthesis.onvoiceschanged = loadVoices;

function speakText() {
    const text = document.getElementById("text").value;
    const voiceIndex = document.getElementById("voiceSelect").value;

    if (!text) return alert("Enter some text");

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voices[voiceIndex];

    speechSynthesis.speak(utterance);

    // send usage data to backend
    fetch("http://localhost:8080/api/log", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ text })
    });
}
