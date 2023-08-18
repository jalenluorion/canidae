import React, { useState, useEffect } from 'react';
import { RainParticles, FireParticles } from './components/Particles';
import ListView from './components/List';
import NoteView from './components/Notes';
import './App.css';

const options = {
  backgrounds: [
    { value: 'background1.jpg', label: 'Background 1' },
    { value: 'background2.jpg', label: 'Background 2' },
    { value: 'background3.jpg', label: 'Background 3' },
    { value: 'background4.jpg', label: 'Background 4' },
  ],
  audio: [
    { value: 'none', label: 'None' },
    { value: 'rain.mp3', label: 'Rain' },
    { value: 'fireplace.mp3', label: 'Fireplace' },
  ],
};

function App() {
  const [selectedBackground, setSelectedBackground] = useState(options.backgrounds[0].value);
  const [selectedAudio, setSelectedAudio] = useState(options.audio[0].value);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [isRainPlaying, setIsRainPlaying] = useState(false);
  const [isFirePlaying, setIsFirePlaying] = useState(false);

  const [showListView, setShowListView] = useState(true);
  const [showNoteView, setShowNoteView] = useState(false);

  const handleBackgroundChange = (value) => {
    setSelectedBackground(value);
  };

  const handleAudioChange = (value) => {
    setSelectedAudio(value);
    setAudioPlaying(true);
  };

  const setBackground = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/${selectedBackground})`,
  };

  useEffect(() => {
    const audioElement = document.getElementById('backgroundAudio');

    if (selectedAudio !== 'none' && audioPlaying) {
      audioElement.src = `${process.env.PUBLIC_URL}/${selectedAudio}`;
      audioElement.play();

      setIsRainPlaying(selectedAudio === 'rain.mp3');
      setIsFirePlaying(selectedAudio === 'fireplace.mp3');
    } else {
      audioElement.pause();
      setIsRainPlaying(false);
      setIsFirePlaying(false);
    }
  }, [selectedAudio, audioPlaying]);

  return (
    <div className="App" style={setBackground}>
      <div className="app-row">
      <div className="left-view">
        {showListView && <ListView />}
      </div>
      <div className="right-view">
        {showNoteView && <NoteView />}
      </div>
      </div>
      <div className="control-container">
        <div className="control-row">
          <button className="control-button" onClick={() => { setShowListView(!showListView); }}>To-Do</button>
          <button className="control-button" onClick={() => { setShowNoteView(!showNoteView); }}>Notes</button>
          <button className="control-button">Page 3</button>
          <button className="control-button">Page 4</button>
        </div>
        <div className="control-row">
          <div className="picker-select">
            {options.backgrounds.map((background, index) => (
              <button
                key={index}
                className={`picker-button ${selectedBackground === background.value ? 'selected' : ''
                  }`}
                onClick={() => handleBackgroundChange(background.value)}
              >
                {background.label}
              </button>
            ))}
          </div>
          <div className="picker-select">
            {options.audio.map((audioOption, index) => (
              <button
                key={index}
                className={`picker-button ${selectedAudio === audioOption.value ? 'selected' : ''
                  }`}
                onClick={() => handleAudioChange(audioOption.value)}
              >
                {audioOption.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <audio id="backgroundAudio" loop>
        <source src={`${process.env.PUBLIC_URL}/${selectedAudio}`} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <div className="backgroundParticles">
        {isRainPlaying && <RainParticles />}
        {isFirePlaying && <FireParticles />}
      </div>
    </div>
  );
}

export default App;
