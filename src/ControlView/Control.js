import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faStickyNote, faClock, faUsers, faPalette } from '@fortawesome/free-solid-svg-icons';
import './Control.css';

function ControlContainer({
    showListView,
    setShowListView,
    showNoteView,
    setShowNoteView,
    showSettingsView,
    setShowSettingsView
}) {
    return (
        <div className="control-container">
            <div className="view-picker">
            <div className={`control-button button1 ${showListView ? 'active' : ''}`} onClick={() => setShowListView(!showListView)}>
                <FontAwesomeIcon icon={faCheck} />
                <span className="button-label">To-Do</span>
            </div>
            <div className={`control-button button1 ${showNoteView ? 'active' : ''}`} onClick={() => setShowNoteView(!showNoteView)}>
                <FontAwesomeIcon icon={faClock} />
                <span className="button-label">Clock</span>
            </div>
            </div>
            <div className={`control-button button5 ${showSettingsView ? 'active' : ''}`} onClick={() => setShowSettingsView(!showSettingsView)}>
                <FontAwesomeIcon icon={faPalette} />
                <span className="button-label">Settings</span>
            </div>
            <div className="view-picker">
            <div className={`control-button button2 ${showListView ? 'active' : ''}`} onClick={() => showListView(!showListView)}>
                <FontAwesomeIcon icon={faStickyNote} />
                <span className="button-label">Notes</span>
            </div>
            <div className={`control-button button2 ${showNoteView ? 'active' : ''}`} onClick={() => setShowNoteView(!showNoteView)}>
                <FontAwesomeIcon icon={faUsers} />
                <span className="button-label">Users</span>
            </div>
            </div>
        </div>
    );
}

export default ControlContainer;
