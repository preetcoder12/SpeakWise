import React from 'react';
import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();

  const navinote = () => {
    navigate("/Notes");
  };

  const navibot = () => {
    navigate("/AI_bot");
  };

  const navitrans = () => {
    navigate("/trans");
  };

 

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
  <div className="text-center space-y-10 max-w-md w-full">
    
    {/* Project Name */}
    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 drop-shadow-[0_5px_10px_rgba(255,255,255,0.1)]">
      SpeakEZ by Preet
    </h1>

    {/* Welcome Text */}
    <h2 className="text-white text-3xl font-semibold">
      👋 Welcome to the Dashboard
    </h2>

    {/* Buttons */}
    <div className="space-y-4">
      <button
        onClick={navinote}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium rounded-2xl shadow-md hover:shadow-xl transition duration-300"
      >
        📝 Notepad
      </button>

      <button
        onClick={navibot}
        className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white text-lg font-medium rounded-2xl shadow-md hover:shadow-xl transition duration-300"
      >
        🤖 AI Bot
      </button>
      <button
        onClick={navitrans}
        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white text-lg font-medium rounded-2xl shadow-md hover:shadow-xl transition duration-300"
      >
        🎙️ Translator
      </button>
    </div>

    {/* Social Links */}
    <div className="flex justify-center gap-6 pt-4">
      <a
        href="https://github.com/preetcoder12/speech_Bot"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white hover:underline hover:text-gray-300 transition"
      >
        GitHub
      </a>
      <a
        href="https://www.linkedin.com/in/preet-gusain-986b022a5/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:underline hover:text-blue-300 transition"
      >
        LinkedIn
      </a>
    </div>
  </div>
</div>

  );
};

export default Home;
