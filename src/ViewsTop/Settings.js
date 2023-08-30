// SettingsView.js

import React from 'react';

function SettingsView({
  options,
  selectedBackground,
  setSelectedBackground,
  selectedAudio,
  setSelectedAudio,
  isPopupVisible,
  togglePopup,
}) {
  return (
    <div className={`settings-view ${isPopupVisible ? 'visible' : ''}`}>
      <div className="popup-container">
        <div className="popup-content">
          <div className="picker-select">
            {isPopupVisible && (
              <>
                <h3>Backgrounds:</h3>
                {options.backgrounds.map((background, index) => (
                  <button
                    key={index}
                    className={`picker-button ${
                      selectedBackground === background.value ? 'selected' : ''
                    }`}
                    onClick={() => {
                      setSelectedBackground(background.value);
                      togglePopup(null);
                    }}
                  >
                    {background.label}
                  </button>
                ))}

                <h3>Audio:</h3>
                {options.audio.map((audioOption, index) => (
                  <button
                    key={index}
                    className={`picker-button ${
                      selectedAudio === audioOption.value ? 'selected' : ''
                    }`}
                    onClick={() => {
                      setSelectedAudio(audioOption.value);
                      togglePopup(null);
                    }}
                  >
                    {audioOption.label}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsView;
