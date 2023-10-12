import React, { useState, useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { RainParticles, FireParticles } from './Components/Particles';

import ControlContainer from './ControlView/Control';
import YouTube from 'react-youtube';
import axios from 'axios';

import './Space.css';

function StudySpace({
  loggedIn,
  options,
  views,
}) {
  const [selectedBackground, setSelectedBackground] = useState(options.backgrounds[0]);
  const [videoReady, setVideoReady] = useState(false);

  const [selectedAudio, setSelectedAudio] = useState({ value: 'none', label: 'None' });
  const [playAudio, setPlayAudio] = useState(false);
  const [audioReady, setAudioReady] = useState(false);

  const [isRainPlaying, setIsRainPlaying] = useState(false);
  const [isFirePlaying, setIsFirePlaying] = useState(false);

  const [showUserView, setShowUserView] = useState(false);

  const [showLeft1View, setShowLeft1View] = useState(false);
  const [showLeft2View, setShowLeft2View] = useState(false);
  const [showTopView, setShowTopView] = useState(false);
  const [showRight1View, setShowRight1View] = useState(false);
  const [showRight2View, setShowRight2View] = useState(false);
  const [showFarRightView, setShowFarRightView] = useState(false);

  const [activeTab, setActiveTab] = useState('backgrounds');

  const [user, setUser] = useState(null);

  useEffect(() => {
    setAudioReady(false);
    if (selectedAudio.value !== 'none') {
      setIsRainPlaying(selectedAudio.label === 'Rain');
      setIsFirePlaying(selectedAudio.label === 'Fireplace');
      setPlayAudio(true);
    } else {
      setIsRainPlaying(false);
      setIsFirePlaying(false);
      setPlayAudio(false);
    }
  }, [selectedAudio]);
  useEffect(() => {
    setVideoReady(false);
  }, [selectedBackground]);

  let videoOpts;

  if (selectedBackground.live === true) {
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

  let { userId } = useParams();

  useEffect(() => {
    const api = axios.create({
      baseURL: 'http://localhost:3001'
    });

    if (loggedIn === true) {
      api.get(`user/`, { withCredentials: true })
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [loggedIn]);

  return (
    <div className="App">
      {playAudio && (
        <YouTube
          className='hidden-player'
          videoId={selectedAudio.value}
          opts={{
            playerVars: {
              autoplay: 1,
              controls: 0,
              mute: 0,
            },
          }}
          onPlay={(event) => {
            // Video is ready, update the state
            setAudioReady(true);
          }}
        />
      )}
      <div className="video-container">
        <YouTube
          videoId={selectedBackground.value}
          opts={videoOpts}
          onPlay={(event) => {
            // Video is ready, update the state
            setVideoReady(true);
          }}
        />
        {!videoReady && (
          <img
            className="video-thumbnail"
            src={`https://img.youtube.com/vi/${selectedBackground.value}/maxresdefault.jpg`}
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
          <views.left1View.component visible={showLeft1View} />
          <views.left2View.component visible={showLeft2View} />
        </div>
        <div className="top-view">
          <views.topView.component visible={showTopView} />
        </div>
        <div className="control-view">
          <ControlContainer
            loggedIn={loggedIn}
            user={user}
            views={views}
            showUserView={showUserView}
            setShowUserView={setShowUserView}
            showLeft1View={showLeft1View}
            setShowLeft1View={setShowLeft1View}
            showRight1View={showRight1View}
            setShowRight1View={setShowRight1View}
            showLeft2View={showLeft2View}
            setShowLeft2View={setShowLeft2View}
            showRight2View={showRight2View}
            setShowRight2View={setShowRight2View}
            showTopView={showTopView}
            setShowTopView={setShowTopView}
            showFarRightView={showFarRightView}
            setShowFarRightView={setShowFarRightView}
          />
        </div>
        <div className="right-view">
          <views.right1View.component visible={showRight1View} />
          <views.right2View.component visible={showRight2View} />
        </div>
      </div>
      <views.farRightView.component
        visible={showFarRightView}
        setVisible={setShowFarRightView}
        options={options}
        selectedBackground={selectedBackground}
        setSelectedBackground={setSelectedBackground}
        selectedAudio={selectedAudio}
        setSelectedAudio={setSelectedAudio}
        audioReady={audioReady}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <views.userView.component
        visible={showUserView}
        setVisible={setShowUserView}
        user={user}
      />
        <Outlet />
    </div>
  );
}

export default StudySpace;
