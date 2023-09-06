import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faStickyNote, faClock, faPalette, faPersonMilitaryRifle, faBook, faExpand, faCompress, faList } from '@fortawesome/free-solid-svg-icons'; // Import the new icons
import './Control.css';

function ControlContainer({
    showListView,
    setShowListView,
    showNoteView,
    setShowNoteView,
    showBlankView,
    setShowBlankView,
    showCampusView,
    setShowCampusView,
    showSettingsView,
    setShowSettingsView
}) {
    const [isFullScreen, setIsFullScreen] = useState(false);

    const toggleFullScreen = () => {
        if (!isFullScreen) {
            // Request fullscreen
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) { // Firefox
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari, and Opera
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
                document.documentElement.msRequestFullscreen();
            }
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { // Firefox
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { // Chrome, Safari, and Opera
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { // IE/Edge
                document.msExitFullscreen();
            }
        }
    };

    // Listen for changes in fullscreen state
    useEffect(() => {
        const fullscreenChangeHandler = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', fullscreenChangeHandler);
        document.addEventListener('mozfullscreenchange', fullscreenChangeHandler);
        document.addEventListener('webkitfullscreenchange', fullscreenChangeHandler);
        document.addEventListener('msfullscreenchange', fullscreenChangeHandler);

        return () => {
            // Clean up event listeners
            document.removeEventListener('fullscreenchange', fullscreenChangeHandler);
            document.removeEventListener('mozfullscreenchange', fullscreenChangeHandler);
            document.removeEventListener('webkitfullscreenchange', fullscreenChangeHandler);
            document.removeEventListener('msfullscreenchange', fullscreenChangeHandler);
        };
    }, []);

    const handleListViewClick = () => {
        setShowListView(!showListView);
        if (showBlankView) setShowBlankView(false); // Close the other picker
    };

    const handleNoteViewClick = () => {
        setShowNoteView(!showNoteView);
        if (showCampusView) setShowCampusView(false); // Close the other picker
    };

    const handleBlankViewClick = () => {
        setShowBlankView(!showBlankView);
        if (showListView) setShowListView(false); // Close the other picker
    };

    const handleCampusViewClick = () => {
        setShowCampusView(!showCampusView);
        if (showNoteView) setShowNoteView(false); // Close the other picker
    };

    const handleSettingsViewClick = () => {
        setShowSettingsView(!showSettingsView);
    };

    return (
        <div className="control-container">
            <div className="control-title">
                <button className="">
                    <FontAwesomeIcon icon={faList} />
                </button>
                <h1>Virtual Study Room</h1>
                <button className="" onClick={toggleFullScreen}>
                    <FontAwesomeIcon icon={isFullScreen ? faCompress : faExpand} />
                </button>
            </div>
            <div className="button-row">
                <button className="control-button button4">
                    <div className="inner-circle">
                    </div>
                </button>
                <div className="view-picker">
                    <button className={`control-button button1 ${showListView ? 'active' : ''}`} onClick={handleListViewClick}>
                        <FontAwesomeIcon icon={faCheck} />
                        <span className="button-label">To-Do</span>
                    </button>
                    <button className={`control-button button1 ${showBlankView ? 'active' : ''}`} onClick={handleBlankViewClick}>
                        <FontAwesomeIcon icon={faPersonMilitaryRifle} />
                        <span className="button-label">NATO</span>
                    </button>
                </div>
                <button className={`control-button button3`}>
                    <FontAwesomeIcon icon={faClock} />
                    <span className="button-label">Timer</span>
                </button>
                <div className="view-picker">
                    <button className={`control-button button2 ${showNoteView ? 'active' : ''}`} onClick={handleNoteViewClick}>
                        <FontAwesomeIcon icon={faStickyNote} />
                        <span className="button-label">Notes</span>
                    </button>
                    <button className={`control-button button2 ${showCampusView ? 'active' : ''}`} onClick={handleCampusViewClick}>
                        <FontAwesomeIcon icon={faBook} />
                        <span className="button-label">Classes</span>
                    </button>
                </div>
                <button className={`control-button button5 ${showSettingsView ? 'active' : ''}`} onClick={handleSettingsViewClick}>
                    <FontAwesomeIcon icon={faPalette} />
                    <span className="button-label">Settings</span>
                </button>
            </div>
        </div>
    );
}

export default ControlContainer;
