import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faStickyNote, faClock, faUsers, faPalette } from '@fortawesome/free-solid-svg-icons';
import './Control.css';

function ControlContainer({
    showListView,
    setShowListView,
    showNoteView,
    setShowNoteView,
    showBlankView,
    setShowBlankView,
    showBlank1View,
    setShowBlank1View,
    showSettingsView,
    setShowSettingsView
}) {
    const handleListViewClick = () => {
        setShowListView(!showListView);
        if (showBlankView) setShowBlankView(false); // Close the other picker
    };

    const handleNoteViewClick = () => {
        setShowNoteView(!showNoteView);
        if (showBlank1View) setShowBlank1View(false); // Close the other picker
    };

    const handleBlankViewClick = () => {
        setShowBlankView(!showBlankView);
        if (showListView) setShowListView(false); // Close the other picker
    };

    const handleBlank1ViewClick = () => {
        setShowBlank1View(!showBlank1View);
        if (showNoteView) setShowNoteView(false); // Close the other picker
    };

    const handleSettingsViewClick = () => {
        setShowSettingsView(!showSettingsView);
    };

    return (
        <div className="control-container">
            <div className={`control-button button4`}>
            <FontAwesomeIcon icon={faUsers} />
                    <span className="button-label">Social</span>
            </div>
            <div className="view-picker">
                <div className={`control-button button1 ${showListView ? 'active' : ''}`} onClick={handleListViewClick}>
                    <FontAwesomeIcon icon={faCheck} />
                    <span className="button-label">To-Do</span>
                </div>
                <div className={`control-button button1 ${showBlankView ? 'active' : ''}`} onClick={handleBlankViewClick}>
                    <FontAwesomeIcon icon={faClock} />
                    <span className="button-label">?????</span>
                </div>
            </div>
            <div className={`control-button button3`}>
                    <FontAwesomeIcon icon={faClock} />
                    <span className="button-label">Clock</span>
            </div>
            <div className="view-picker">
                <div className={`control-button button2 ${showNoteView ? 'active' : ''}`} onClick={handleNoteViewClick}>
                    <FontAwesomeIcon icon={faStickyNote} />
                    <span className="button-label">Notes</span>
                </div>
                <div className={`control-button button2 ${showBlank1View ? 'active' : ''}`} onClick={handleBlank1ViewClick}>
                    <FontAwesomeIcon icon={faUsers} />
                    <span className="button-label">Campus</span>
                </div>
            </div>
            <div className={`control-button button5 ${showSettingsView ? 'active' : ''}`} onClick={handleSettingsViewClick}>
                <FontAwesomeIcon icon={faPalette} />
                <span className="button-label">Settings</span>
            </div>
        </div>
    );
}

export default ControlContainer;
