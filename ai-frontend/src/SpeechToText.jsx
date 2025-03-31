import { useState, useRef } from "react";

function SpeechToText() {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechInstanceRef = useRef(null);

  const startListening = () => {
    const recognition =
      new window.webkitSpeechRecognition() || new window.SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();
    setIsListening(true);

    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      setText(speechText);
      setIsListening(false);
      sendToBackend(speechText);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };
  };

  const sendToBackend = async (speechText) => {
    try {
      const response = await fetch(
        "http://localhost:3000/myAssistant/virtualAssistant",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: speechText }),
        }
      );

      const data = await response.json();
      setText((prevText) => `${prevText}\n\nAI: ${data.message}`);
      if (!data.stop) speakText(data.message);
    } catch (error) {
      console.error("Error sending text to backend", error);
    }
  };

  const speakText = (message) => {
    if ("speechSynthesis" in window) {
      stopSpeaking(); // Stop any ongoing speech before speaking new text

      const speechInstance = new SpeechSynthesisUtterance(message);
      speechInstance.rate = 1;
      speechInstance.pitch = 1;

      speechInstance.onstart = () => setIsSpeaking(true);
      speechInstance.onend = () => setIsSpeaking(false);

      speechInstanceRef.current = speechInstance;
      window.speechSynthesis.speak(speechInstance);
    }
  };

  const stopSpeaking = async () => {
    // Stop browser's speech synthesis first
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    // Also stop any speech on the backend
    try {
      const response = await fetch(
        "http://localhost:3000/myAssistant/virtualAssistant",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ stop: true }),
        }
      );

      const data = await response.json();
      console.log("Stop response:", data);

      // Update UI state
      setIsSpeaking(false);

      if (!response.ok) {
        throw new Error(data.error || "Failed to stop speech");
      }
    } catch (error) {
      console.error("Error stopping speech:", error);
    }
  };

  return (
    <div className={`assistant-container ${isListening ? "listening" : ""}`}>
      <div className="wave-bg"></div>

      <div className="assistant-header">
        <div className="assistant-header-icon">AI</div>
        <h1 className="assistant-title">Your Own AI-Assistant</h1>
        <h2 className="assistant-subtitle">
          Your AI-powered assistant—open apps like Youtube , Instagram etc..  fetch news, and hear responses
          aloud, all hands-free!"
        </h2>
      </div>

      <div className="status-container">
        <div
          className={`status-indicator listening-indicator ${
            isListening ? "active" : ""
          }`}
        >
          Listening<span className="listening-dots"></span>
        </div>

        <div
          className={`status-indicator speaking-indicator ${
            isSpeaking ? "active" : ""
          }`}
        >
          Speaking...
        </div>
      </div>

      <div className="button-container">
        <button onClick={startListening} className="speak-btn">
          <span className={`button-text ${!isListening ? "active" : ""}`}>
            Click to Speak
          </span>
          <span className={`button-text ${isListening ? "active" : ""}`}>
            Listening<span className="listening-dots"></span>
          </span>
        </button>

        <button
          onClick={stopSpeaking}
          className="stop-btn"
          disabled={!isSpeaking}
        >
          Stop Speaking
        </button>
      </div>

      <div className="output-box">
        {text || "Your AI responses will appear here..."}
      </div>
    </div>
  );
}

export default SpeechToText;
