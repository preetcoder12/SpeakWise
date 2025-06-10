import React, { useState, useEffect, useRef } from "react";
import { Mic, Send, Trash2, MessageCircle, Bot, User, Sparkles, MicOff } from "lucide-react";

const TexttoSpeech = () => {
  const [message, setMessage] = useState("");
  const [listening, setListening] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [inputFocused, setInputFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const recognitionRef = useRef(null);
  const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
   const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const textareaRef = useRef(null);


  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition API not supported in this browser.");
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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversations]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [message]);

  const handleVoiceToggle = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
    } else {
      if (recognitionRef.current) {
        setListening(true);
        recognitionRef.current.start();
      }
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (message.trim() === "" || isTyping) return;

    const userMessage = message.trim();
    const newConversation = {
      id: Date.now(),
      userMessage,
      botMessage: "",
      isLoading: true,
      timestamp: new Date()
    };

    setConversations(prev => [...prev, newConversation]);
    setMessage("");
    setIsTyping(true);

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: userMessage }]
              }
            ]
          }),
        }
      );

      const data = await res.json();

      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I apologize, but I couldn't generate a proper response. Please try again.";

      setConversations(prev =>
        prev.map(conv =>
          conv.id === newConversation.id
            ? { ...conv, botMessage: reply, isLoading: false }
            : conv
        )
      );
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setConversations(prev =>
        prev.map(conv =>
          conv.id === newConversation.id
            ? { ...conv, botMessage: "I'm sorry, I encountered an error while processing your request. Please try again.", isLoading: false }
            : conv
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleDeleteConversation = (idToRemove) => {
    setConversations(conversations.filter(conv => conv.id !== idToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessage = (text) => {
    let formatted = text
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-slate-800 border border-slate-600 rounded-lg p-3 sm:p-4 my-2 sm:my-4 overflow-x-auto text-xs sm:text-sm text-cyan-300 font-mono whitespace-pre-wrap">$1</pre>')
      .replace(/`([^`]+)`/g, '<code class="bg-slate-700 text-cyan-300 px-1 sm:px-1.5 py-0.5 rounded text-xs sm:text-sm font-mono">$1</code>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-slate-300 italic">$1</em>')
      .replace(/\n/g, "<br />")
      .replace(/^- (.*?)(<br\s*\/?>|$)/gm, '<li class="ml-4 list-disc text-slate-300">$1</li>');

    // Wrap bullet points in <ul> if any exist
    if (formatted.includes("<li")) {
      formatted = `<ul class="list-inside space-y-1">${formatted}</ul>`;
    }

    return formatted;
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Main Container */}
      <div className="relative min-h-screen flex flex-col w-full mx-auto p-2 sm:p-4 max-w-5xl">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-cyan-600/20 p-4 sm:p-8">
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-lg opacity-75 animate-pulse"></div>
                <div className="relative p-2 sm:p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                  <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>
              <div className="text-center">
                <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-1 sm:mb-2">
                  AI Assistant
                </h1>
                <p className="text-slate-400 text-sm sm:text-lg font-medium">Made by Preet • Intelligent conversations await</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl mb-4 sm:mb-6 flex flex-col">
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-3 sm:p-8 space-y-4 sm:space-y-8 custom-scrollbar"
            style={{ minHeight: '400px', maxHeight: '70vh' }}
          >
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12 sm:py-20 px-4">
                <div className="relative mb-6 sm:mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full blur-xl"></div>
                  <div className="relative p-4 sm:p-6 rounded-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-white/10">
                    <MessageCircle className="w-12 h-12 sm:w-16 sm:h-16 text-purple-400" />
                  </div>
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-200 mb-2 sm:mb-3">Welcome to your AI Assistant</h2>
                <p className="text-slate-400 text-base sm:text-lg max-w-md leading-relaxed">
                  Start a conversation by typing a message or using voice input. I'm here to help with any questions you have.
                </p>
              </div>
            ) : (
              <>
                {conversations.map((conversation) => (
                  <div key={conversation.id} className="space-y-4 sm:space-y-6 animate-fade-in">
                    {/* User Message */}
                    <div className="flex justify-end items-start gap-2 sm:gap-4">
                      <div className="w-full sm:max-w-[85%] md:max-w-[75%] group">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl sm:rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                          <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl sm:rounded-3xl rounded-tr-lg p-3 sm:p-6 shadow-lg">
                            <p className="text-white leading-relaxed text-sm sm:text-base font-medium break-words">
                              {conversation.userMessage}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="relative flex-shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-md opacity-50"></div>
                        <div className="relative p-2 sm:p-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600">
                          <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Bot Response */}
                    <div className="flex justify-start items-start gap-2 sm:gap-4">
                      <div className="relative flex-shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-md opacity-50"></div>
                        <div className="relative p-2 sm:p-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500">
                          <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                      </div>
                      <div className="w-full sm:max-w-[85%] md:max-w-[75%] group flex-1">
                        <div className="relative">
                          <div className="absolute inset-0 bg-slate-800/50 rounded-2xl sm:rounded-3xl blur-lg opacity-50"></div>
                          <div className="relative bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl sm:rounded-3xl rounded-tl-lg p-3 sm:p-6 shadow-lg">
                            {conversation.isLoading ? (
                              <div className="flex items-center gap-3">
                                <div className="flex gap-1">
                                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-cyan-400 rounded-full animate-bounce"></div>
                                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-cyan-400 rounded-full animate-bounce animation-delay-150"></div>
                                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-cyan-400 rounded-full animate-bounce animation-delay-300"></div>
                                </div>
                                <span className="text-slate-400 font-medium text-sm sm:text-base">AI is thinking...</span>
                              </div>
                            ) : (
                              <div className="flex justify-between items-start gap-2 sm:gap-6">
                                <div className="flex-1 min-w-0">
                                  <div
                                    className="prose prose-invert prose-p:my-1 sm:prose-p:my-2 prose-pre:my-2 sm:prose-pre:my-3 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:bg-slate-800 prose-code:text-cyan-300 text-sm sm:text-base max-w-none text-slate-200 leading-relaxed break-words"
                                    dangerouslySetInnerHTML={{ __html: formatMessage(conversation.botMessage) }}
                                  />
                                </div>
                                <button
                                  onClick={() => handleDeleteConversation(conversation.id)}
                                  className="text-slate-500 hover:text-red-400 transition-all duration-200 p-1 sm:p-2 rounded-xl hover:bg-red-500/10 group flex-shrink-0 ml-2"
                                  aria-label="Delete conversation"
                                >
                                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform duration-200" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-3 sm:p-6">
            <div className="flex gap-2 sm:gap-4 items-end">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  placeholder="Type your message here... (Shift + Enter for new line)"
                  value={message}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  rows="1"
                  className="w-full bg-slate-800/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 resize-none font-medium text-sm sm:text-base leading-relaxed"
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
                {inputFocused && (
                  <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full animate-pulse"></div>
                )}
              </div>

              {/* Voice Button */}
              <button
                onClick={handleVoiceToggle}
                className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex-shrink-0 ${listening
                  ? "bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-500/30 animate-pulse"
                  : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg shadow-purple-500/30"
                  }`}
                aria-label={listening ? "Stop listening" : "Start voice input"}
              >
                {listening ? (
                  <MicOff className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                ) : (
                  <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                )}
              </button>

              {/* Send Button */}
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || isTyping}
                className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 disabled:from-slate-700 disabled:to-slate-800 disabled:opacity-50 text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/30 disabled:scale-100 disabled:shadow-none flex-shrink-0"
                aria-label="Send message"
              >
                <Send className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {listening && (
              <div className="mt-4 sm:mt-6 text-center">
                <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-red-500/20 border border-red-500/40 rounded-full backdrop-blur-sm">
                  <div className="relative">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-ping absolute"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                  </div>
                  <span className="text-red-400 font-medium text-sm sm:text-base">Listening for your voice...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fade-in {
            animation: fade-in 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .animation-delay-150 {
            animation-delay: 150ms;
          }
          
          .animation-delay-300 {
            animation-delay: 300ms;
          }
          
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          
          .animation-delay-4000 {
            animation-delay: 4s;
          }
          
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #8b5cf6 #1e293b;
          }
          
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          
          @media (min-width: 640px) {
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
            }
          }
          
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(30, 41, 59, 0.5);
            border-radius: 4px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #8b5cf6, #ec4899);
            border-radius: 4px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #a855f7, #f472b6);
          }
        `}</style>
    </div>
  );
};

export default TexttoSpeech;