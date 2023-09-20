import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

import './Notes.css';
import './ViewsSide.css'

const FilesView = () => {
  const [note, setNote] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [buttonClicked, setButtonClicked] = useState(false);

  const popupRef = useRef(null);

  useEffect(() => {
    const savedNote = Cookies.get('savedNote');
    if (savedNote) {
      setNote(savedNote);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target) && !buttonClicked) {
        setIsPopupOpen(false);
      }
      setButtonClicked(false);
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [buttonClicked]);

  const handleNoteChange = (e) => {
    const updatedNote = e.target.value;
    setNote(updatedNote);
    Cookies.set('savedNote', updatedNote, { expires: 7 });
  };

  const handleDownload = (e) => {
    setIsPopupOpen(!isPopupOpen);
    setButtonClicked(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setTitle('');
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const downloadNote = (e) => {
    e.stopPropagation();

    const downloadTitle = title.trim() ? title : 'Notes';
    const blob = new Blob([note], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${downloadTitle}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    setIsPopupOpen(false);
    setTitle('');
  };

  return (
    <div className="container">
      <div className="top-bar">
        <div className="title">
          <h1>
            Files (Coming Soon)
          </h1>
          <button className="menu-icon" onClick={handleDownload} style={{ cursor: `pointer` }}>
            <FontAwesomeIcon icon={faDownload} />
          </button>
        </div>

        {isPopupOpen && (
          <div className="menu-dropdown blue-accent" ref={popupRef}>
            <input
              type="text"
              placeholder="Enter a title"
              value={title}
              onChange={handleTitleChange}
            />
            <button onClick={downloadNote}>Download</button>
            <button onClick={closePopup}>Cancel</button>
          </div>
        )}
      </div>

      <textarea
        value={note}
        className="text-area main-body"
        onChange={handleNoteChange}
        placeholder="Write your notes here..."
      />
    </div>
  );
};

export default FilesView;