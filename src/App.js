import React, { useState, useEffect } from 'react';
import { RainParticles, FireParticles } from './Components/Particles';
import ListView from './ViewsSide/List';
import NoteView from './ViewsSide/Notes';
import BlankView from './ViewsSide/Blank1'
import CampusView from './ViewsSide/Campus'
import SettingsView from './ViewsTop/Settings'
import ControlContainer from './ControlView/Control'; // Import ControlContainer component

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

  const [isRainPlaying, setIsRainPlaying] = useState(false);
  const [isFirePlaying, setIsFirePlaying] = useState(false);

  const [showListView, setShowListView] = useState(false);
  const [showNoteView, setShowNoteView] = useState(false);
  const [showBlankView, setShowBlankView] = useState(false);
  const [showCampusView, setShowCampusView] = useState(false);
  const [showSettingsView, setShowSettingsView] = useState(false);

  useEffect(() => {
    const audioElement = document.getElementById('backgroundAudio');

    if (selectedAudio !== 'none') {
      audioElement.src = `${process.env.PUBLIC_URL}/${selectedAudio}`;
      audioElement.play();

      setIsRainPlaying(selectedAudio === 'rain.mp3');
      setIsFirePlaying(selectedAudio === 'fireplace.mp3');
    } else {
      audioElement.pause();
      setIsRainPlaying(false);
      setIsFirePlaying(false);
    }
  }, [selectedAudio]);

  return (
    <div className="App" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/${selectedBackground})` }}>
      <div className="left-view">
        {showListView && <ListView />}
        {showBlankView && <BlankView />}
      </div>
      <div className="center-view">
        {showSettingsView && <SettingsView
          options={options}
          selectedBackground={selectedBackground}
          setSelectedBackground={setSelectedBackground}
          selectedAudio={selectedAudio}
          setSelectedAudio={setSelectedAudio}
        />}
        <ControlContainer
          showListView={showListView}
          setShowListView={setShowListView}
          showNoteView={showNoteView}
          setShowNoteView={setShowNoteView}
          showBlankView={showBlankView}
          setShowBlankView={setShowBlankView}
          showCampusView={showCampusView}
          setShowCampusView={setShowCampusView}
          showSettingsView={showSettingsView}
          setShowSettingsView={setShowSettingsView}
        />
      </div>
      <div className="right-view">
        {showNoteView && <NoteView />}
        {showCampusView && <CampusView />}
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
