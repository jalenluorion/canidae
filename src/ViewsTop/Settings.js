// SettingsView.js

import React from 'react';
import './Settings.css';

function SettingsView({
  options,
  selectedBackground,
  setSelectedBackground,
  selectedAudio,
  setSelectedAudio,
}) {
  return (
      <div className="settings-container">
          <div className="settings-picker">
              <div className="settings-group">
                <h3>Backgrounds:</h3>
                {options.backgrounds.map((background, index) => (
                  <button
                    key={index}
                    className={`picker-button ${
                      selectedBackground === background.value ? 'selected' : ''
                    }`}
                    onClick={() => {
                      setSelectedBackground(background.value);
                    }}
                  >
                    {background.label}
                  </button>
                ))}
              </div>
              <div className="settings-group">
                <h3>Audio:</h3>
                {options.audio.map((audioOption, index) => (
                  <button
                    key={index}
                    className={`picker-button ${
                      selectedAudio === audioOption.value ? 'selected' : ''
                    }`}
                    onClick={() => {
                      setSelectedAudio(audioOption.value);
                    }}
                  >
                    {audioOption.label}
                  </button>
                ))}
              </div>
          </div>
      </div>
  );
}

export default SettingsView;
