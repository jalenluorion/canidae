import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Settings.css';
import './ViewsFull.css'
import { CSSTransition } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp, faVolumeMute, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { api } from '../../Helper';

function SettingsView({
  visible,
  setVisible,
  mediaOptions,
  selectedBackground,
  setSelectedBackground,
  selectedAudio,
  setSelectedAudio,
  audioReady,
  activeTab,
  setActiveTab,
}) {
  const containerRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const { spaceId } = useParams();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target) && mounted) {
        setVisible(false);
      } else {
        setMounted(true);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [containerRef, setVisible, mounted]);

  const handleAudioButtonClick = (audioOption) => {
    if (selectedAudio === audioOption) {
      // If the clicked audio option is already selected, stop the audio and set it to 'none'
      setSelectedAudio({ value: 'none', label: 'None' });
    } else {
      setSelectedAudio(audioOption);
    }
  };

  return (
    <CSSTransition
      in={visible}
      timeout={200}
      classNames="alert"
      unmountOnExit
      onEntering={() => { setMounted(false); }}
    >
      <div className="settings-view">
        <div className="settings-container" ref={containerRef}>
          <div className="settings-tab-bar">
            <button
              className={`tab-button ${activeTab === 'backgrounds' ? 'active' : ''}`}
              onClick={() => setActiveTab('backgrounds')}
              style={{
                backgroundColor: activeTab === 'backgrounds' ? 'purple' : ''
              }}
            >
              Backgrounds
            </button>
            <button
              className={`tab-button ${activeTab === 'audio' ? 'active' : ''}`}
              onClick={() => setActiveTab('audio')}
              style={{
                backgroundColor: activeTab === 'audio' ? 'purple' : ''
              }}
            >
              Audio
            </button>
          </div>
          {activeTab === 'backgrounds' && (
            <div className="settings-content">
              {mediaOptions.backgrounds.map((background, index) => (
                <div className='background-button-container' key={background.value}>
                  <button
                    className={`background-button ${selectedBackground === background ? 'selected' : ''}`}
                    onClick={() => {
                      // save the background setting with the index value, like 0 1 or 2
                      api.post('/space/settings?id=' + spaceId, { background: index }, { withCredentials: true })
                      setSelectedBackground(background);
                    }}
                  >
                    <img
                      src={`https://img.youtube.com/vi/${background.value}/maxresdefault.jpg`}
                      alt={background.label}
                    />
                  </button>
                  <div className="background-label">{background.label}</div>
                </div>
              ))}

            </div>
          )}
          {activeTab === 'audio' && (
            <div className="settings-content">
              {mediaOptions.audio.map((audioOption, index) => (
                  <button
                    key={audioOption.value}
                    className={`audio-button ${selectedAudio === audioOption ? 'selected' : ''
                      }`}
                    onClick={() => handleAudioButtonClick(audioOption)}
                  >
                    {selectedAudio === audioOption && !audioReady ? (
                      <FontAwesomeIcon
                        icon={faSpinner} // Display buffering icon
                        className="audio-icon"
                        spin // Add spin animation to the buffering icon
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={selectedAudio === audioOption ? faVolumeUp : faVolumeMute}
                        className="audio-icon"
                      />
                    )}
                    {audioOption.label}
                  </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </CSSTransition>
  );
}

export default SettingsView;