import React, { useState, useEffect } from 'react';
import { RainParticles, FireParticles } from './Components/Particles';
import ListView from './ViewsSide/List';
import NoteView from './ViewsSide/Notes';
import BlankView from './ViewsSide/Blank1'
import CampusView from './ViewsSide/Campus'
import TimerView from './ViewsTop/Timer'
import SettingsView from './ViewsTop/Settings'
import ControlContainer from './ControlView/Control'; // Import ControlContainer component

import './App.css';

const options = {
  backgrounds: [
    { value: 'c0_ejQQcrwI?si=9P9O6_z0U819vVLB', label: 'Coffee Shop' },
    { value: '-VgN7nKx9MU?si=hxXrSfbPnMn2XUqO', label: 'Fireplace' },
    { value: 'xg1gNlxto2M?si=GB79cFrfOPN--0KV', label: 'New York City' },
    { value: 'CHFif_y2TyM?si=Jgwua93tWtqUDYch', label: 'Library' },
  ],
  audio: [
    { value: 'none', label: 'None' },
    { value: 'rain.mp3', label: 'Rain' },
    { value: 'fireplace.mp3', label: 'Fireplace' },
  ],
};

function App() {
  const [selectedBackground, setSelectedBackground] = useState(options.backgrounds[3].value);
  const [selectedAudio, setSelectedAudio] = useState(options.audio[0].value);

  const [isRainPlaying, setIsRainPlaying] = useState(false);
  const [isFirePlaying, setIsFirePlaying] = useState(false);

  const [showListView, setShowListView] = useState(false);
  const [showNoteView, setShowNoteView] = useState(false);
  const [showBlankView, setShowBlankView] = useState(false);
  const [showCampusView, setShowCampusView] = useState(false);
  const [showTimerView, setShowTimerView] = useState(false);
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
    <div className="App">
      <div className="video-container">
        <iframe
          src={`https://www.youtube.com/embed/${selectedBackground}&start=60&controls=0&autoplay=1&loop=1&mute=1&playsinline=1`}
        >
        </iframe>
      </div>
      <div className="particle-container">
        {isRainPlaying && <RainParticles />}
        {isFirePlaying && <FireParticles />}
      </div>
      <div className="left-view">
        {showListView && <ListView />}
        {showBlankView && <BlankView />}
      </div>
      <div className="top-view">
        {showTimerView && <TimerView />}
      </div>
      <div className="control-view">
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
          showTimerView={showTimerView}
          setShowTimerView={setShowTimerView}
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
    </div>
  );
}

export default App;
