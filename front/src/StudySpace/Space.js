import React, { useState, useEffect, lazy, Suspense } from 'react';
import { RainParticles, FireParticles } from './Components/Particles';
import { Await } from 'react-router-dom';
import YouTube from 'react-youtube';
import { resolvePromise } from '../Helper';
import './Space.css';
import Loading from './ViewsFull/Loading';

const Controls = lazy(() => import('./Controls'));

function StudySpace({
  data,
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
          onPlay={() => {
            setAudioReady(true);
          }}
        />
      )}
      <div className="video-container">
        <YouTube
          videoId={selectedBackground.value}
          opts={videoOpts}
          onPlay={() => {
            setVideoReady(true);
            resolvePromise();
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
      <Suspense fallback={<Loading />}>
        <Await
          resolve={data.isVideoReady}
          errorElement={
            <p>Error loading package location!</p>
          }
        />
        <Controls
          data={data}
          options={options}
          views={views}
          selectedBackground={selectedBackground}
          setSelectedBackground={setSelectedBackground}
          selectedAudio={selectedAudio}
          setSelectedAudio={setSelectedAudio}
          audioReady={audioReady}
        />
      </Suspense>
    </div>
  );
}

export default StudySpace;
