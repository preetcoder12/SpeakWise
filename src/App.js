import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Home';
import TexttoSpeech from './TexttoSpeech';
import Ai_response from './AI_response';
import Translator from './Translator';


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Notes" element={<TexttoSpeech />} />
        <Route path="/AI_bot" element={<Ai_response />} />
        <Route path="/trans" element={<Translator/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
