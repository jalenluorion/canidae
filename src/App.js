import React, { useState, useEffect } from 'react';
import { RainParticles, FireParticles } from './Components/Particles';
import ListView from './ViewsSide/List';
import NoteView from './ViewsSide/Notes';
import BlankView from './ViewsSide/Blank1'
import CampusView from './ViewsSide/Campus'
import TimerView from './ViewsTop/Timer'
import SettingsView from './ViewsTop/Settings'
import ControlContainer from './ControlView/Control'; // Import ControlContainer component
import YouTube from 'react-youtube'; // Import the react-youtube library

import './App.css';

const options = {
  backgrounds: [
    { value: 'c0_ejQQcrwI', label: 'Coffee Shop' },
    { value: '-VgN7nKx9MU', label: 'Fireplace' },
    { value: 'xg1gNlxto2M', label: 'New York City' },
    { value: 'CHFif_y2TyM', label: 'Library' },
    { value: 'mkgylOJSdhE', label: 'Backyard Rain' },
    { value: 'acsLxmnjMho', label: 'Treehouse' },
    { value: 'QX9ptr60JFw', label: 'Rainy Woods' },
    { value: 'jfKfPfyJRdk', label: 'Lofi Hip Hop' },
  ],
  audio: [
    { value: 'none', label: 'None' },
    { value: 'rain.mp3', label: 'Rain' },
    { value: 'fireplace.mp3', label: 'Fireplace' },
    { value: 'lofi', label: 'Lofi Hip Hop' }
  ],
};

function App() {
  const [selectedBackground, setSelectedBackground] = useState(options.backgrounds[0].value);
  const [selectedAudio, setSelectedAudio] = useState(options.audio[0].value);

  const [isRainPlaying, setIsRainPlaying] = useState(false);
  const [isFirePlaying, setIsFirePlaying] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false); // Track if the video is ready

  const [showListView, setShowListView] = useState(false);
  const [showNoteView, setShowNoteView] = useState(false);
  const [showBlankView, setShowBlankView] = useState(false);
  const [showCampusView, setShowCampusView] = useState(false);
  const [showTimerView, setShowTimerView] = useState(false);
  const [showSettingsView, setShowSettingsView] = useState(false);

  const [playLofi, setPlayLofi] = useState(false);
  const [lofiStatus, setLofiStatus] = useState(false);

  const [activeTab, setActiveTab] = useState('backgrounds');

  useEffect(() => {
    const audioElement = document.getElementById('backgroundAudio');
    if (selectedAudio === 'lofi') {
      audioElement.pause();
      setIsRainPlaying(false);
      setIsFirePlaying(false);
      setPlayLofi(true);
    } else if (selectedAudio !== 'none') {
      audioElement.src = `${process.env.PUBLIC_URL}/${selectedAudio}`;
      audioElement.play();

      setIsRainPlaying(selectedAudio === 'rain.mp3');
      setIsFirePlaying(selectedAudio === 'fireplace.mp3');
      setPlayLofi(false);
      setLofiStatus(false);
    } else {
      audioElement.pause();
      setIsRainPlaying(false);
      setIsFirePlaying(false);
      setPlayLofi(false);
      setLofiStatus(false);
    }
  }, [selectedAudio]);

  let videoOpts;

  if (selectedBackground === 'jfKfPfyJRdk') {
    videoOpts = {
      playerVars: {
        autoplay: 1,
        controls: 0,
        mute: 1,
        playsinline: 1,
      },
    };
  } else {
    videoOpts = {
      playerVars: {
        autoplay: 1,
        controls: 0,
        loop: 1,
        mute: 1,
        playsinline: 1,
        start: 60,
      },
    };
  }

  return (
    <div className="App">
      {playLofi && (
        <YouTube
          className='hidden-player'
          videoId="jfKfPfyJRdk"
          opts={{
            playerVars: {
              autoplay: 1,
              controls: 0,
              mute: 0,
            },
          }}
          onPlay={(event) => {
            // Video is ready, update the state
            setLofiStatus(true);
          }}
        />
      )}
      <div className="video-container">
        <YouTube
          videoId={selectedBackground}
          opts={videoOpts}
          onPlay={(event) => {
            // Video is ready, update the state
            setIsVideoReady(true);
          }}
        />
        {!isVideoReady && (
          <img
            className="video-thumbnail"
            src={`https://img.youtube.com/vi/${selectedBackground}/maxresdefault.jpg`}
            alt="Video Thumbnail"
          />
        )}
      </div>
      <div className="particle-container">
        {isRainPlaying && <RainParticles />}
        {isFirePlaying && <FireParticles />}
      </div>
      <div className="item-container">
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
            setVideoReady={setIsVideoReady}
            lofiStatus={lofiStatus}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
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
      </div>
      <audio id="backgroundAudio" loop>
        <source src={`${process.env.PUBLIC_URL}/${selectedAudio}`} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

export default App;
