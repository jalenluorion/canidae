import React, { useState } from 'react';
import './Settings.css';

function SettingsView({
  options,
  selectedBackground,
  setSelectedBackground,
  selectedAudio,
  setSelectedAudio,
  setVideoReady,
}) {
  const [activeTab, setActiveTab] = useState('backgrounds');

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
                  selectedBackground === background.value ? 'selected' : ''
                }`}
                onClick={() => {
                  setSelectedBackground(background.value);
                  setVideoReady(false);
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
              <button
                key={index}
                className={`picker-button ${
                  selectedAudio === audioOption.value ? 'selected1' : ''
                }`}
                onClick={() => {
                  setSelectedAudio(audioOption.value);
                }}
              >
                {audioOption.label}
              </button>
            ))}
          </div>
        )}
    </div>
  );
}

export default SettingsView;
