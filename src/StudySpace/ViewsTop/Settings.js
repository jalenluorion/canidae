import React from 'react';
import './Settings.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp, faVolumeMute, faSpinner } from '@fortawesome/free-solid-svg-icons';

function SettingsView({
  options,
  selectedBackground,
  setSelectedBackground,
  selectedAudio,
  setSelectedAudio,
  audioReady,
  activeTab,
  setActiveTab,
}) {

  const handleAudioButtonClick = (audioOption) => {
    if (selectedAudio === audioOption) {
      // If the clicked audio option is already selected, stop the audio and set it to 'none'
      setSelectedAudio({ value: 'none', label: 'None' });
    } else {
      setSelectedAudio(audioOption);
    }
  };

  return (
    <div className="settings-container">
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
            {options.backgrounds.map((background, index) => (
              <div className='background-button-container'>
              <button
                key={index}
                className={`background-button ${
                  selectedBackground === background ? 'selected' : ''
                }`}
                onClick={() => {
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
          {options.audio.map((audioOption, index) => (
            audioOption.value !== 'none' && ( // Skip rendering 'None' as a button
              <button
                key={index}
                className={`audio-button ${
                  selectedAudio === audioOption ? 'selected' : ''
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
            )
          ))}
        </div>
      )}
    </div>
  );
}


export default SettingsView;
