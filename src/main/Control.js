import React from 'react';
import './Control.css';


const options = {
    backgrounds: [
        { value: 'background1.jpg', label: 'Image 1' },
        { value: 'background2.jpg', label: 'Image 2' },
        { value: 'background3.jpg', label: 'Image 3' },
        { value: 'background4.jpg', label: 'Image 4' },
    ],
    audio: [
        { value: 'none', label: 'None' },
        { value: 'rain.mp3', label: 'Rain' },
        { value: 'fireplace.mp3', label: 'Fireplace' },
    ],
};

function ControlContainer({
    showListView,
    setShowListView,
    showNoteView,
    setShowNoteView,
    selectedBackground,
    setSelectedBackground,
    selectedAudio,
    setSelectedAudio,
}) {
    return (
        <div className="control-container">
            <div className="control-row">
                <button className="control-button" onClick={() => setShowListView(!showListView)}>To-Do</button>
                <button className="control-button" onClick={() => setShowNoteView(!showNoteView)}>Notes</button>
                <button className="control-button">Page 3</button>
                <button className="control-button">Page 4</button>
            </div>
            <div className="control-row">
                <div className="picker-select">
                    {options.backgrounds.map((background, index) => (
                        <button
                            key={index}
                            className={`picker-button ${selectedBackground === background.value ? 'selected' : ''}`}
                            onClick={() => setSelectedBackground(background.value)}
                        >
                            {background.label}
                        </button>
                    ))}
                </div>
                <div className="picker-select">
                    {options.audio.map((audioOption, index) => (
                        <button
                            key={index}
                            className={`picker-button ${selectedAudio === audioOption.value ? 'selected' : ''}`}
                            onClick={() => setSelectedAudio(audioOption.value)}
                        >
                            {audioOption.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ControlContainer;
