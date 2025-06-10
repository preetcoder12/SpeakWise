import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";

const TexttoSpeech = () => {
  const [notes, setNotes] = useState([]);
  const [message, setMessage] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition API not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
      setListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Error occurred in recognition:", event.error);
      setListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const handleStart = () => {
    if (recognitionRef.current) {
      setListening(true);
      recognitionRef.current.start();
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleAddNote = () => {
    if (message.trim() !== "") {
      setNotes([...notes, message]);
      setMessage("");
    }
  };

  const handleDeleteNote = (indexToRemove) => {
    setNotes(notes.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-10">
      <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">🎤 Voice Notes by Preet</h1>
          <button
            onClick={() => navigate("/AI_bot")}
            className="text-sm bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md font-medium"
          >
            Go to Chatbot
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Type or speak your note here..."
            value={message}
            onChange={handleInputChange}
            className="flex-grow px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleStart}
            disabled={listening}
            className={`px-4 py-2 rounded-md font-medium ${
              listening
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {listening ? "Listening..." : "Start Speaking"}
          </button>
          <button
            onClick={handleAddNote}
            className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 font-medium"
          >
            Add Note
          </button>
        </div>

        {notes.length === 0 ? (
          <p className="text-center text-gray-400">No notes added yet.</p>
        ) : (
          <ul className="space-y-3">
            {notes.map((note, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-700 px-4 py-3 rounded-md"
              >
                <span className="text-white">{note}</span>
                <button
                  onClick={() => handleDeleteNote(index)}
                  className="text-red-400 hover:text-red-600 font-semibold"
                  aria-label={`Delete note ${index + 1}`}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TexttoSpeech;
